import { useState } from 'react'

const sample = {
  status: 200,
  score: 71,
  timeMs: 412,
  finalUrl: 'https://example.com/',
  checks: [
    { id: 'https', label: 'HTTPS', status: 'pass', severity: 'low', detail: 'The site is using HTTPS.' },
    { id: 'csp', label: 'Content Policy', status: 'missing', severity: 'medium', detail: 'Recommended header not detected.' },
    { id: 'hsts', label: 'HSTS', status: 'missing', severity: 'medium', detail: 'Recommended header not detected.' },
    { id: 'frame', label: 'Frame Options', status: 'missing', severity: 'medium', detail: 'Recommended header not detected.' },
    { id: 'type', label: 'Content Type Options', status: 'missing', severity: 'low', detail: 'Recommended header not detected.' },
    { id: 'info', label: 'Information Signal', status: 'pass', severity: 'low', detail: 'No extra signal detected.' }
  ]
}

export function FinalWebPanel() {
  const [target, setTarget] = useState('https://example.com')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const report = result || sample
  const jsonReport = JSON.stringify(report, null, 2)
  const exportHref = `data:application/json;charset=utf-8,${encodeURIComponent(jsonReport)}`

  async function analyze() {
    setLoading(true)
    try {
      const response = await fetch(`/api/site-check?url=${encodeURIComponent(target)}`)
      setResult(await response.json())
    } finally {
      setLoading(false)
    }
  }

  async function copyReport() {
    await navigator.clipboard.writeText(jsonReport)
  }

  return <div className="hardening-layout">
    <div className="tool-left">
      <div className="tool-heading"><span className="tool-icon purple">◇</span><div><h2>Web Hardening Review</h2><p>Review response headers and public configuration signals.</p></div></div>
      <label>Test any URL</label>
      <div className="analyze-row"><input value={target} onChange={event => setTarget(event.target.value)} /><button className="btn-analyze" onClick={analyze}>{loading ? 'Checking...' : 'Analyze'}</button></div>
      <div className="score-grid"><div className="score-card"><span>Overall Score</span><strong>{report.score ?? '-'}</strong><small>/ 100</small></div><div className="score-card"><span>Status</span><strong className="ok">{report.status ? 'OK' : 'Review'}</strong><small>{report.status ?? '-'}</small></div><div className="score-card"><span>Response Time</span><strong>{report.timeMs ?? '-'}</strong><small>ms</small></div><div className="score-card wide"><span>Final URL</span><small className="url-text">{report.finalUrl || '-'}</small></div></div>
    </div>
    <div className="report-card"><div className="report-actions"><h2>Hardening Report</h2><div><button onClick={copyReport}>Copy Report (JSON)</button><a className="btn-ghost" href={exportHref} download="web-hardening-report.json">Export JSON</a></div></div><table><thead><tr><th>Check</th><th>Status</th><th>Severity</th><th>Recommendation</th></tr></thead><tbody>{(report.checks || []).map(check => <tr key={check.id}><td>{check.label}</td><td className={check.status === 'pass' ? 'pass' : 'missing'}>{check.status}</td><td>{check.severity}</td><td>{check.detail}</td></tr>)}</tbody></table></div>
  </div>
}
