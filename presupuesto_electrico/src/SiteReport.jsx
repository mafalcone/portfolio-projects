export default function SiteReport({ result }) {
  if (!result) return null

  if (result.error) {
    return <div className="table-wrapper" style={{ marginTop: 16 }}>
      <h3>Request failed</h3>
      <p>{result.error}</p>
    </div>
  }

  const checks = result.checks || []

  return <div className="table-wrapper" style={{ marginTop: 16 }}>
    <h3>Hardening report</h3>
    <p>Status: {result.status}</p>
    <p>Score: {result.score ?? '-'}/100</p>
    <p>Response time: {result.timeMs ?? '-'} ms</p>
    <p>Final URL: {result.finalUrl || '-'}</p>

    {checks.length > 0 && <div style={{ marginTop: 18 }}>
      <h3>Checks</h3>
      {checks.map(check => <div key={check.id} style={{ marginTop: 12, padding: 14, border: '1px solid rgba(148,163,184,.18)', borderRadius: 14, background: 'rgba(2,6,23,.35)' }}>
        <div className="card-topline"><span>{check.label}</span><strong>{check.status} / {check.severity}</strong></div>
        <p style={{ color: '#cbd5e1', marginBottom: 0 }}>{check.detail}</p>
      </div>)}
    </div>}
  </div>
}
