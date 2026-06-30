export default async function handler(req, res) {
  const input = String(req.query.url || '').trim();
  if (!input) return res.status(400).json({ error: 'Missing url' });

  let target;
  try {
    target = new URL(input.startsWith('http') ? input : `https://${input}`);
  } catch {
    return res.status(400).json({ error: 'Invalid url' });
  }

  if (!['http:', 'https:'].includes(target.protocol)) {
    return res.status(400).json({ error: 'Only http and https urls are supported' });
  }

  const started = Date.now();

  try {
    const response = await fetch(target.toString(), {
      method: 'GET',
      redirect: 'follow',
      headers: { 'user-agent': 'PortfolioSiteCheck/1.0' }
    });

    const headers = {
      csp: response.headers.get('content-security-policy'),
      hsts: response.headers.get('strict-transport-security'),
      frameOptions: response.headers.get('x-frame-options'),
      contentTypeOptions: response.headers.get('x-content-type-options'),
      referrerPolicy: response.headers.get('referrer-policy'),
      permissionsPolicy: response.headers.get('permissions-policy'),
      server: response.headers.get('server'),
      poweredBy: response.headers.get('x-powered-by')
    };

    const checks = [
      {
        id: 'https',
        label: 'HTTPS',
        status: response.url.startsWith('https://') ? 'pass' : 'review',
        severity: response.url.startsWith('https://') ? 'low' : 'high',
        detail: response.url.startsWith('https://') ? 'Final URL uses HTTPS.' : 'Final URL is not HTTPS.'
      },
      {
        id: 'csp',
        label: 'Content Security Policy',
        status: headers.csp ? 'pass' : 'missing',
        severity: headers.csp ? 'low' : 'medium',
        detail: headers.csp ? 'CSP header is present.' : 'Add a Content-Security-Policy header to reduce script/content injection risk.'
      },
      {
        id: 'hsts',
        label: 'HSTS',
        status: headers.hsts ? 'pass' : 'missing',
        severity: headers.hsts ? 'low' : 'medium',
        detail: headers.hsts ? 'Strict-Transport-Security header is present.' : 'Add HSTS after confirming HTTPS is correctly configured.'
      },
      {
        id: 'frame',
        label: 'Frame protection',
        status: headers.frameOptions || headers.csp ? 'pass' : 'missing',
        severity: headers.frameOptions || headers.csp ? 'low' : 'medium',
        detail: headers.frameOptions || headers.csp ? 'Frame protection signal found.' : 'Add X-Frame-Options or CSP frame-ancestors.'
      },
      {
        id: 'content-type',
        label: 'Content type protection',
        status: headers.contentTypeOptions ? 'pass' : 'missing',
        severity: headers.contentTypeOptions ? 'low' : 'low',
        detail: headers.contentTypeOptions ? 'X-Content-Type-Options header is present.' : 'Add X-Content-Type-Options: nosniff.'
      },
      {
        id: 'leakage',
        label: 'Information exposure',
        status: headers.poweredBy ? 'review' : 'pass',
        severity: headers.poweredBy ? 'low' : 'low',
        detail: headers.poweredBy ? 'X-Powered-By is exposed.' : 'No X-Powered-By header exposed.'
      }
    ];

    const score = Math.max(0, Math.min(100, Math.round(
      checks.reduce((total, check) => total + (check.status === 'pass' ? 1 : check.status === 'review' ? 0.5 : 0), 0) / checks.length * 100
    )));

    return res.status(200).json({
      target: target.toString(),
      finalUrl: response.url,
      status: response.status,
      timeMs: Date.now() - started,
      score,
      headers,
      checks
    });
  } catch (error) {
    return res.status(502).json({ error: error?.message || 'Request failed' });
  }
}
