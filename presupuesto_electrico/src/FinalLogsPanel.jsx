import { useMemo, useState } from 'react'
import IncidentTriage from './IncidentTriage'

const sampleLogs = `[2026-06-29 08:12:03] INFO Backup job started
[2026-06-29 08:12:41] INFO Database connection restored
[2026-06-29 08:13:09] WARN Disk usage above 80%
[2026-06-29 08:13:44] ERROR Login attempt blocked
[2026-06-29 08:14:10] WARN Service restart timeout
[2026-06-29 08:14:30] INFO Backup job completed`

function parseLogs(text) {
  const rows = text.split('\n').map(line => line.trim()).filter(Boolean)
  const count = token => rows.filter(row => row.toUpperCase().includes(token)).length
  return { rows, total: rows.length, info: count('INFO'), warn: count('WARN'), error: count('ERROR') }
}

export function FinalLogsPanel() {
  const [logs, setLogs] = useState(sampleLogs)
  const stats = useMemo(() => parseLogs(logs), [logs])

  return <div className="tool-stack">
    <div className="tool-heading"><span className="tool-icon green">▦</span><div><h2>Incident Log Triage</h2><p>Parse logs, classify events and suggest next actions.</p></div></div>
    <textarea className="log-input" value={logs} onChange={event => setLogs(event.target.value)} />
    <div className="score-grid"><div className="score-card"><span>Total</span><strong>{stats.total}</strong></div><div className="score-card"><span>Info</span><strong>{stats.info}</strong></div><div className="score-card"><span>Warnings</span><strong>{stats.warn}</strong></div><div className="score-card"><span>Errors</span><strong>{stats.error}</strong></div></div>
    <IncidentTriage rows={stats.rows} />
  </div>
}
