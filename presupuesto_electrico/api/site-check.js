export default async function handler(req, res) {
  const input = String(req.query.url || '').trim();
  if (!input) return res.status(400).json({ error: 'Missing url' });

  let target;
  try {
    target = new URL(input.startsWith('http') ? input : `https://${input}`);
  } catch {
    return res.status(400).json({ error: 'Invalid url' });
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
      referrerPolicy: response.headers.get('referrer-policy')
    };

    const present = Object.values(headers).filter(Boolean).length;
    const score = Math.round((present / Object.keys(headers).length) * 100);

    return res.status(200).json({
      target: target.toString(),
      finalUrl: response.url,
      status: response.status,
      timeMs: Date.now() - started,
      score,
      headers
    });
  } catch (error) {
    return res.status(502).json({ error: error?.message || 'Request failed' });
  }
}
