#!/usr/bin/env python3
"""
Web Hardening Auditor (Portfolio)

A lightweight CLI tool that checks a site's basic hardening posture:
- Common security headers
- HTTPS/TLS certificate metadata (best-effort)
- Cookie flags (best-effort)
- Info-leak headers (Server, X-Powered-By)
- Additional checks (TLS version, HTTP→HTTPS redirect)
Outputs a JSON report + a shareable HTML report.
"""

from __future__ import annotations

import argparse
import json
import socket
import ssl
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional, Tuple
from urllib.parse import urlparse, urlunparse

import requests


SECURITY_HEADERS = [
    "Content-Security-Policy",
    "Strict-Transport-Security",
    "X-Frame-Options",
    "X-Content-Type-Options",
    "Referrer-Policy",
    "Permissions-Policy",
]

INFO_LEAK_HEADERS = ["Server", "X-Powered-By"]


@dataclass
class HttpsInfo:
    issuer: Optional[Dict[str, str]]
    expires: Optional[str]
    tls_version: Optional[str]


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def normalize_target(url: str) -> str:
    """
    Normalizes the target URL to include a scheme.
    If no scheme is provided, defaults to https://
    """
    u = url.strip()
    parsed = urlparse(u)
    if not parsed.scheme:
        parsed = urlparse("https://" + u)
    if not parsed.netloc and parsed.path:
        parsed = parsed._replace(netloc=parsed.path, path="")
    return urlunparse(parsed)


def build_url(parsed, scheme: str) -> str:
    return urlunparse(parsed._replace(scheme=scheme))


def get_tls_and_cert(host: str, port: int = 443, timeout: int = 7) -> HttpsInfo:
    """
    Fetches TLS protocol version and basic certificate metadata via a direct TLS handshake.
    Best-effort: some endpoints may block direct handshakes or require SNI/ciphers not available.
    """
    ctx = ssl.create_default_context()
    with socket.create_connection((host, port), timeout=timeout) as sock:
        with ctx.wrap_socket(sock, server_hostname=host) as ssock:
            tls_version = ssock.version()
            cert = ssock.getpeercert() or {}
            issuer_list = cert.get("issuer")
            issuer = dict(x[0] for x in issuer_list) if issuer_list else None
            expires = cert.get("notAfter")
            return HttpsInfo(issuer=issuer, expires=expires, tls_version=tls_version)


def http_to_https_redirect_check(parsed, timeout: int = 10) -> Optional[bool]:
    """
    Checks whether http://HOST redirects to https://HOST (or to an https URL on the same host).
    Returns True/False, or None if the check could not be performed.
    """
    host = parsed.hostname
    if not host:
        return None

    http_url = build_url(parsed, "http")
    https_url = build_url(parsed, "https")

    try:
        r = requests.get(http_url, timeout=timeout, allow_redirects=True, headers={"User-Agent": "WebHardeningAuditor/1.0"})
        if not r.history:
            return False
        final = r.url or ""
        final_parsed = urlparse(final)
        if final_parsed.scheme == "https":
            return True
        # Some sites redirect http->https and then back via meta/js; keep it simple.
        return final.startswith(https_url) or final_parsed.scheme == "https"
    except Exception:
        return None


def extract_cookie_flags(resp: requests.Response) -> list:
    """
    Extracts cookie flag hints from Set-Cookie headers.
    Requests' cookie jar doesn't reliably expose HttpOnly/SameSite, so we parse raw headers best-effort.
    """
    cookies_out = []
    raw = resp.headers.get("Set-Cookie")
    if not raw:
        return cookies_out

    # Multiple Set-Cookie headers may be collapsed by some servers/proxies; handle simple split heuristic.
    parts = raw.split("\n") if "\n" in raw else [raw]

    for line in parts:
        segs = [s.strip() for s in line.split(";")]
        if not segs:
            continue
        name_val = segs[0]
        name = name_val.split("=", 1)[0].strip() if "=" in name_val else name_val.strip()

        flags = {
            "secure": any(s.lower() == "secure" for s in segs[1:]),
            "httponly": any(s.lower() == "httponly" for s in segs[1:]),
            "samesite": None,
        }
        for s in segs[1:]:
            if s.lower().startswith("samesite="):
                flags["samesite"] = s.split("=", 1)[1].strip()

        cookies_out.append({"name": name, "flags": flags})
    return cookies_out


def audit(url: str, timeout: int = 10) -> Dict[str, Any]:
    target = normalize_target(url)
    parsed = urlparse(target)

    result: Dict[str, Any] = {
        "url": target,
        "timestamp": utc_now_iso(),
        "headers": {},
        "cookies": [],
        "https": {},
        "leaks": [],
        "checks": {},
        "score": 100,
        "recommendations": [],
    }

    # Request (best-effort)
    try:
        resp = requests.get(
            target,
            timeout=timeout,
            allow_redirects=True,
            headers={"User-Agent": "WebHardeningAuditor/1.0"},
        )
    except Exception as e:
        result["score"] = 0
        result["recommendations"].append(f"Request failed: {type(e).__name__}")
        return result

    headers = resp.headers

    # Security headers
    for h in SECURITY_HEADERS:
        if h in headers:
            result["headers"][h] = "present"
        else:
            result["headers"][h] = "missing"
            result["score"] -= 10
            result["recommendations"].append(f"Missing security header: {h}")

    # Info leakage headers
    for h in INFO_LEAK_HEADERS:
        if h in headers:
            result["leaks"].append({h: headers.get(h)})
            result["score"] -= 5
            result["recommendations"].append(f"Information leak header exposed: {h}")

    # Cookies (best-effort)
    cookies = extract_cookie_flags(resp)
    result["cookies"] = cookies
    for c in cookies:
        name = c.get("name", "cookie")
        flags = c.get("flags", {})
        if flags and flags.get("secure") is False and parsed.scheme == "https":
            result["score"] -= 5
            result["recommendations"].append(f"Cookie not marked Secure: {name}")
        if flags and flags.get("httponly") is False:
            result["score"] -= 3
            result["recommendations"].append(f"Cookie not marked HttpOnly: {name}")

    # HTTPS / TLS
    if parsed.scheme != "https":
        result["score"] -= 20
        result["recommendations"].append("Site is not using HTTPS")
    else:
        host = parsed.hostname
        if host:
            try:
                info = get_tls_and_cert(host)
                result["https"] = {
                    "issuer": info.issuer,
                    "expires": info.expires,
                }
                result["checks"]["tls_version"] = info.tls_version
            except Exception:
                result["score"] -= 10
                result["recommendations"].append("Could not read TLS/certificate metadata")

    # HTTP -> HTTPS redirect
    redirect_ok = http_to_https_redirect_check(parsed)
    result["checks"]["http_to_https_redirect"] = redirect_ok
    if redirect_ok is False:
        result["score"] -= 10
        result["recommendations"].append("HTTP does not properly redirect to HTTPS")

    result["score"] = max(0, min(100, int(result["score"])))
    return result


def render_html(data: Dict[str, Any], path: Path) -> None:
    def pill(label: str, value: str) -> str:
        return f"""
        <div class="pill">
          <span class="pill-label">{label}</span>
          <span class="pill-value">{value}</span>
        </div>
        """

    headers_items = "".join(
        f'<li><span class="k">{k}</span>: <span class="{("good" if v=="present" else "bad")}">{v}</span></li>'
        for k, v in data.get("headers", {}).items()
    ) or "<li><span class='muted'>No headers checked</span></li>"

    leaks_items = "".join(
        f"<li><span class='k'>{list(x.keys())[0]}</span>: <span class='muted'>{list(x.values())[0]}</span></li>"
        for x in data.get("leaks", [])
    ) or "<li><span class='muted'>No information leakage detected</span></li>"

    checks = data.get("checks", {}) or {}
    checks_items = ""
    if checks:
        for k, v in checks.items():
            checks_items += f"<li><span class='k'>{k}</span>: <span class='muted'>{v}</span></li>"
    else:
        checks_items = "<li><span class='muted'>No additional checks</span></li>"

    recs = data.get("recommendations", []) or []
    recs_items = "".join(f"<li>{r}</li>" for r in recs) or "<li>All good 🎉</li>"

    score = data.get("score", 0)
    score_class = "good" if score >= 80 else ("warn" if score >= 50 else "bad")

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Web Hardening Auditor Report</title>
<style>
  :root {{
    --bg: #0b1020;
    --card: rgba(6, 10, 24, 0.75);
    --border: rgba(255,255,255,0.08);
    --text: #e5e7eb;
    --muted: rgba(229,231,235,0.65);
    --accent: #38bdf8;
    --good: #4ade80;
    --warn: #fbbf24;
    --bad: #f87171;
  }}
  body {{
    margin: 0;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Sans";
    background: radial-gradient(1200px 700px at 20% 10%, rgba(56,189,248,0.18), transparent 60%),
                radial-gradient(900px 600px at 80% 40%, rgba(99,102,241,0.12), transparent 55%),
                var(--bg);
    color: var(--text);
    padding: 28px 18px;
  }}
  .wrap {{
    max-width: 920px;
    margin: 0 auto;
  }}
  .card {{
    background: var(--card);
    border: 1px solid var(--border);
    box-shadow: 0 18px 60px rgba(0,0,0,0.45);
    border-radius: 22px;
    padding: 22px 18px;
  }}
  h1 {{
    margin: 0 0 14px 0;
    font-size: 28px;
    color: var(--accent);
    letter-spacing: 0.2px;
  }}
  h2 {{
    margin: 18px 0 8px 0;
    font-size: 20px;
  }}
  .pills {{
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    margin: 10px 0 16px 0;
  }}
  .pill {{
    display:flex;
    justify-content: space-between;
    align-items:center;
    gap: 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 12px 14px;
  }}
  .pill-label {{
    color: var(--muted);
    font-weight: 600;
  }}
  .pill-value {{
    font-weight: 700;
    overflow-wrap: anywhere;
  }}
  .score.good {{ color: var(--good); }}
  .score.warn {{ color: var(--warn); }}
  .score.bad  {{ color: var(--bad);  }}
  ul {{
    margin: 10px 0 0 0;
    padding-left: 20px;
  }}
  li {{ margin: 7px 0; }}
  .k {{
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New";
  }}
  .muted {{ color: var(--muted); }}
  .good {{ color: var(--good); font-weight: 700; }}
  .warn {{ color: var(--warn); font-weight: 700; }}
  .bad  {{ color: var(--bad);  font-weight: 700; }}
  .note {{
    margin-top: 16px;
    color: var(--muted);
    font-size: 13px;
  }}
</style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <h1>Web Hardening Auditor</h1>

      <div class="pills">
        {pill("Target", data.get("url", ""))}
        {pill("Score", f'<span class="score {score_class}">{score}/100</span>')}
        {pill("Time", data.get("timestamp", ""))}
      </div>

      <h2>Security headers</h2>
      <ul>{headers_items}</ul>

      <h2>Information leakage</h2>
      <ul>{leaks_items}</ul>

      <h2>Additional checks</h2>
      <ul>{checks_items}</ul>

      <h2>Recommendations</h2>
      <ul>{recs_items}</ul>

      <div class="note">Note: Lightweight hardening auditor, not a full vulnerability scanner.</div>
    </div>
  </div>
</body>
</html>
"""
    path.write_text(html, encoding="utf-8")


def ensure_reports_dir() -> Path:
    d = Path("reports")
    d.mkdir(parents=True, exist_ok=True)
    return d


def write_reports(data: Dict[str, Any]) -> Tuple[Path, Path]:
    reports = ensure_reports_dir()
    parsed = urlparse(data.get("url", ""))
    host = (parsed.hostname or "target").replace(":", "_")
    ts = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    json_path = reports / f"report_{host}_{ts}.json"
    html_path = reports / f"report_{host}_{ts}.html"

    json_path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    render_html(data, html_path)
    return json_path, html_path


def main() -> None:
    parser = argparse.ArgumentParser(description="Web Hardening Auditor (CLI + HTML report)")
    parser.add_argument("url", help="Target URL (example: https://example.com)")
    parser.add_argument("--timeout", type=int, default=10, help="Request timeout (seconds)")
    args = parser.parse_args()

    data = audit(args.url, timeout=args.timeout)
    json_path, html_path = write_reports(data)

    print("[+] Audit complete")
    print(f"[+] Score: {data.get('score', 0)}/100")
    print(f"[+] JSON report: {json_path}")
    print(f"[+] HTML report: {html_path}")


if __name__ == "__main__":
    main()
