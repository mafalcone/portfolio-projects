function isUnsupportedHost(hostname) {
  const host = String(hostname || '').toLowerCase().replace(/^\[|\]$/g, '');
  return (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    host === '0.0.0.0' ||
    host === '::1' ||
    host === '::' ||
    host === 'fc00::' ||
    host === 'fe80::' ||
    host.startsWith('127.') ||
    host.startsWith('10.') ||
    host.startsWith('192.168.') ||
    host.startsWith('169.254.') ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host)
  );
}

function normalizeTarget(input) {
  const hasProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(input);
  const target = new URL(hasProtocol ? input : `https://${input}`);
  target.hash = '';
  return target;
}

function validateTarget(target) {
  if (!['http:', 'https:'].includes(target.protocol)) {
    return 'Only http and https urls are supported';
  }

  if (target.username || target.password || isUnsupportedHost(target.hostname)) {
    return 'Target host is not supported';
  }

  return null;
}

function buildFetchOptions(method, signal) {
  return {
    method,
    redirect: 'manual',
    signal,
    headers: { 'user-agent': 'PortfolioSiteCheck/1.0' }
  };
}

async function fetchWithValidatedRedirects(startUrl, method, signal) {
  let current = startUrl;

  for (let redirectCount = 0; redirectCount <= 5; redirectCount += 1) {
    const response = await fetch(current.toString(), buildFetchOptions(method, signal));
    const location = response.headers.get('location');

    if (![301, 302, 303, 307, 308].includes(response.status) || !location) {
      return response;
    }

    current = new URL(location, current);
    current.hash = '';
    const validationError = validateTarget(current);
    if (validationError) throw new Error('Unsupported redirect target');
  }

  throw new Error('Too many redirects');
}

export default async function handler(req, res) {
  const input = String(req.query.url || '').trim();
  if (!input || input.length > 2048) return res.status(400).json({ error: 'Invalid url' });

  let target;
  try {
    target = normalizeTarget(input);
  } catch {
    return res.status(400).json({ error: 'Invalid url' });
  }

  const validationError = validateTarget(target);
  if (validationError) return res.status(400).json({ error: validationError });

  const started = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6500);

  try {
    let response = await fetchWithValidatedRedirects(target, 'HEAD', controller.signal);
    if (response.status === 405 || response.status === 501) {
      response = await fetchWithValidatedRedirects(target, 'GET', controller.signal);
    }

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
        severity: 'low',
        detail: headers.contentTypeOptions ? 'X-Content-Type-Options header is present.' : 'Add X-Content-Type-Options: nosniff.'
      },
      {
        id: 'leakage',
        label: 'Information exposure',
        status: headers.poweredBy ? 'review' : 'pass',
        severity: 'low',
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
    const message = error?.name === 'AbortError' ? 'Request timed out' : 'Request failed';
    return res.status(502).json({ error: message });
  } finally {
    clearTimeout(timeout);
  }
}
