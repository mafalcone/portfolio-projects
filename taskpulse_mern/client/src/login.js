// /api/login.js - Serverless function para Vercel

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
  const email = body.email;

  if (!email) {
    res.statusCode = 400;
    return res.json({ error: 'email required' });
  }

  // Demo: devolvemos un token fijo
  res.statusCode = 200;
  return res.json({
    token: 'demo-token',
    email,
  });
};
