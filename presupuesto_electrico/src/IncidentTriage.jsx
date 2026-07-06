const patterns = [
  { type: 'Authentication', match: ['login', 'auth', 'password', 'failed'], severity: 'medium', action: 'Review source, rate limits and account activity.' },
  { type: 'Backup', match: ['backup', 'snapshot', 'restore'], severity: 'medium', action: 'Confirm job result, retention and restore point.' },
  { type: 'Storage', match: ['disk', 'storage', 'space', 'usage'], severity: 'medium', action: 'Check capacity trend and cleanup/expand plan.' },
  { type: 'Service', match: ['service', 'restart', 'crash', 'timeout'], severity: 'high', action: 'Review service health, recent deploys and dependencies.' },
  { type: 'Network', match: ['dns', 'network', 'latency', 'connection'], severity: 'medium', action: 'Check connectivity, DNS and upstream availability.' }
]

export function classifyIncidents(rows) {
  return rows.map((row) => {
    const text = row.toLowerCase()
    const found = patterns.find(pattern => pattern.match.some(token => text.includes(token)))
    const type = found?.type || 'General'
    const severity = row.toUpperCase().includes('ERROR') ? 'high' : found?.severity || (row.toUpperCase().includes('WARN') ? 'medium' : 'low')
    const action = found?.action || 'Review event context and correlate with nearby logs.'
    return { row, type, severity, action }
  })
}

export default function IncidentTriage({ rows }) {
  const incidents = classifyIncidents(rows).slice(-6).reverse()

  return <div className="table-wrapper" style={{ marginTop: 16 }}>
    <h3>Incident triage</h3>
    {incidents.map((incident, index) => <div key={`${incident.row}-${index}`} style={{ marginTop: 12, padding: 14, border: '1px solid rgba(148,163,184,.18)', borderRadius: 14, background: 'rgba(2,6,23,.35)' }}>
      <div className="card-topline"><span>{incident.type}</span><strong>{incident.severity}</strong></div>
      <p style={{ color: '#f8fafc', marginBottom: 6 }}>{incident.row}</p>
      <p style={{ color: '#cbd5e1', margin: 0 }}>{incident.action}</p>
    </div>)}
  </div>
}
