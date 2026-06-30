import React, { useMemo, useState } from 'react'
import jsPDF from 'jspdf'
import { projectDetails, securityFocus } from './projectDetails'

const projects = [
  { id: 'taskpulse', name: 'TaskPulse', area: 'Fullstack / MERN', status: 'Live app', desc: 'Task manager with login flow, dashboard and CRUD behavior.', stack: 'React, Vite, Node.js, Express, MongoDB' },
  { id: 'logs', name: 'Log Monitor', area: 'Infra / Ops', status: 'Interactive demo', desc: 'Log parser that summarizes severity and recent events.', stack: 'Python/FastAPI source + browser demo' },
  { id: 'site', name: 'Site Check', area: 'DevSecOps', status: 'Live API demo', desc: 'Server-side URL check with status, response time and selected headers.', stack: 'Vercel Function + frontend report' },
  { id: 'nutrition', name: 'Nutrition Analyzer', area: 'Python / API', status: 'Interactive demo', desc: 'Food lookup with visible sample dataset and nutrition values.', stack: 'Python/FastAPI source + browser demo' },
  { id: 'estimate', name: 'Service Estimate', area: 'Frontend', status: 'Live demo', desc: 'Editable estimate calculator with PDF export.', stack: 'React, Vite, jsPDF' }
]

const sampleLogs = `[2026-06-29 08:12:03] INFO Backup job started
[2026-06-29 08:12:41] INFO Database connection restored
[2026-06-29 08:13:09] WARN Disk usage above 80%
[2026-06-29 08:13:44] ERROR Failed login attempt blocked
[2026-06-29 08:14:30] INFO Backup job completed`

const foods = [
  { name: 'Rice', kcal: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: 'Potato', kcal: 77, protein: 2, carbs: 17, fat: 0.1 },
  { name: 'Egg', kcal: 155, protein: 13, carbs: 1.1, fat: 11 },
  { name: 'Chicken breast', kcal: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Lentils', kcal: 116, protein: 9, carbs: 20, fat: 0.4 },
  { name: 'Oats', kcal: 389, protein: 16.9, carbs: 66, fat: 6.9 },
  { name: 'Banana', kcal: 89, protein: 1.1, carbs: 23, fat: 0.3 }
]

const headerLabels = {
  csp: 'Content-Security-Policy',
  hsts: 'Strict-Transport-Security',
  frameOptions: 'X-Frame-Options',
  contentTypeOptions: 'X-Content-Type-Options',
  referrerPolicy: 'Referrer-Policy'
}

function toNumber(value) {
  const parsed = parseFloat(String(value).replace(',', '.'))
  return Number.isNaN(parsed) ? 0 : parsed
}

function parseLogs(text) {
  const rows = text.split('\n').map(line => line.trim()).filter(Boolean)
  const count = token => rows.filter(row => row.toUpperCase().includes(token)).length
  return { rows, total: rows.length, info: count('INFO'), warn: count('WARN'), error: count('ERROR') }
}

function DetailPanel({ active }) {
  const details = projectDetails[active] || []
  const showSecurity = active === 'site' || active === 'logs'

  return <div className="project-grid" style={{ marginTop: 24 }}>
    <div className="project-card" style={{ minHeight: 'auto' }}>
      <div className="card-topline"><span>Technical value</span><strong>What it demonstrates</strong></div>
      <ul style={{ color: '#cbd5e1', lineHeight: 1.6, paddingLeft: 18 }}>
        {details.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
    {showSecurity && <div className="project-card" style={{ minHeight: 'auto' }}>
      <div className="card-topline"><span>Security focus</span><strong>Blue-team / DevSecOps</strong></div>
      <ul style={{ color: '#cbd5e1', lineHeight: 1.6, paddingLeft: 18 }}>
        {securityFocus.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>}
  </div>
}

export default function PublicPortfolioV2() {
  const [active, setActive] = useState('taskpulse')
  const [logs, setLogs] = useState(sampleLogs)
  const [foodQuery, setFoodQuery] = useState('')
  const [target, setTarget] = useState('https://example.com')
  const [siteResult, setSiteResult] = useState(null)
  const [siteLoading, setSiteLoading] = useState(false)
  const [items, setItems] = useState([
    { description: 'Cable 2x2.5mm', type: 'material', quantity: 20, price: 1500 },
    { description: 'Service labor', type: 'labor', quantity: 5, price: 3500 }
  ])

  const stats = useMemo(() => parseLogs(logs), [logs])
  const query = foodQuery.trim().toLowerCase()
  const filteredFoods = useMemo(() => query ? foods.filter(food => food.name.toLowerCase().includes(query)) : [], [query])
  const totals = useMemo(() => items.reduce((acc, item) => {
    const subtotal = toNumber(item.quantity) * toNumber(item.price)
    if (item.type === 'labor') acc.labor += subtotal
    else acc.materials += subtotal
    acc.total += subtotal
    return acc
  }, { materials: 0, labor: 0, total: 0 }), [items])

  const headerRows = siteResult?.headers ? Object.entries(headerLabels).map(([key, label]) => ({ label, value: siteResult.headers[key] })) : []

  function updateItem(index, field, value) {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item))
  }

  function exportPdf() {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Service Estimate', 10, 15)
    doc.setFontSize(10)
    let y = 25
    items.forEach((item, index) => {
      const subtotal = toNumber(item.quantity) * toNumber(item.price)
      doc.text(`${index + 1}. ${item.description || 'Item'} - $${subtotal.toFixed(2)}`, 10, y)
      y += 6
    })
    doc.text(`Total: $${totals.total.toFixed(2)}`, 10, y + 8)
    doc.save('service-estimate.pdf')
  }

  async function runSiteCheck() {
    setSiteLoading(true)
    setSiteResult(null)
    try {
      const response = await fetch(`/api/site-check?url=${encodeURIComponent(target)}`)
      setSiteResult(await response.json())
    } finally {
      setSiteLoading(false)
    }
  }

  return <main className="app">
    <section className="hero">
      <p className="eyebrow">Technical Portfolio</p>
      <h1>Manuel Falcone</h1>
      <p className="hero-text">Infrastructure, support, backend/frontend, automation and security-oriented projects with practical implementation details.</p>
      <div className="hero-actions"><a className="btn primary" href="#projects">View projects</a><a className="btn secondary" href="https://github.com/mafalcone/portfolio-projects" target="_blank" rel="noreferrer">Repository</a></div>
    </section>

    <section className="section" id="projects">
      <div className="section-header"><p className="eyebrow">Selected work</p><h2>Projects</h2><p>Choose a project to open its live app or interactive demo.</p></div>
      <div className="project-grid">{projects.map(project => <button className="project-card" key={project.id} onClick={() => setActive(project.id)}><div className="card-topline"><span>{project.area}</span><strong>{project.status}</strong></div><h3>{project.name}</h3><p>{project.desc}</p><small>{project.stack}</small><span className="card-link">Open project →</span></button>)}</div>
    </section>

    <section className="section">
      {active === 'taskpulse' && <div><div className="section-header"><p className="eyebrow">Live app</p><h2>TaskPulse</h2><p>Register with a valid email and password, then login to manage browser-local demo tasks.</p></div><a className="btn primary" href="https://portfolio-projects-dfi2.vercel.app" target="_blank" rel="noreferrer">Open TaskPulse demo</a></div>}

      {active === 'logs' && <div><div className="section-header"><p className="eyebrow">Interactive demo</p><h2>Log Monitor</h2><p>Paste logs and inspect operational severity counts.</p></div><textarea style={{width:'100%',minHeight:160,borderRadius:16,padding:16,background:'#020617',color:'#f8fafc',border:'1px solid rgba(148,163,184,.2)'}} value={logs} onChange={e => setLogs(e.target.value)} /><div className="totals"><div className="card"><h3>Total</h3><p>{stats.total}</p></div><div className="card"><h3>Info</h3><p>{stats.info}</p></div><div className="card"><h3>Warnings</h3><p>{stats.warn}</p></div><div className="card"><h3>Errors</h3><p>{stats.error}</p></div></div><div className="table-wrapper" style={{marginTop:16}}>{stats.rows.slice(-5).map((row, i) => <p key={i} style={{margin:'8px 0',color:'#cbd5e1'}}>{row}</p>)}</div></div>}

      {active === 'site' && <div><div className="section-header"><p className="eyebrow">Live API demo</p><h2>Site Check</h2><p>Runs through a Vercel serverless function and builds a readable report from real response data.</p></div><div className="hero-actions"><input style={{flex:1,minWidth:260,borderRadius:999,padding:'12px 16px',background:'#020617',color:'#f8fafc',border:'1px solid rgba(148,163,184,.2)'}} value={target} onChange={e => setTarget(e.target.value)} /><button className="btn primary" onClick={runSiteCheck}>{siteLoading ? 'Checking...' : 'Run check'}</button></div>{siteResult && <div className="table-wrapper" style={{marginTop:16}}><h3>Report summary</h3><p>Status: {siteResult.status || siteResult.error}</p><p>Score: {siteResult.score ?? '-'}/100</p><p>Response time: {siteResult.timeMs ?? '-'} ms</p><p>Final URL: {siteResult.finalUrl || '-'}</p>{headerRows.length > 0 && <><h3 style={{marginTop:18}}>Header checks</h3>{headerRows.map(row => <p key={row.label}><strong>{row.label}:</strong> {row.value || 'Missing'}</p>)}</>}</div>}</div>}

      {active === 'nutrition' && <div><div className="section-header"><p className="eyebrow">Interactive demo</p><h2>Nutrition Analyzer</h2><p>Available foods: {foods.map(food => food.name).join(', ')}.</p></div><input style={{width:'100%',borderRadius:999,padding:'12px 16px',background:'#020617',color:'#f8fafc',border:'1px solid rgba(148,163,184,.2)'}} value={foodQuery} onChange={e => setFoodQuery(e.target.value)} placeholder="Search food" />{!query && <p style={{color:'#cbd5e1',marginTop:16}}>Type a food name to see the nutrition card.</p>}{query && filteredFoods.length === 0 && <p style={{color:'#cbd5e1',marginTop:16}}>No match in the demo dataset.</p>}<div className="project-grid" style={{marginTop:16}}>{filteredFoods.map(food => <div className="project-card" key={food.name}><h3>{food.name}</h3><p>{food.kcal} kcal · {food.protein}g protein · {food.carbs}g carbs · {food.fat}g fat</p></div>)}</div></div>}

      {active === 'estimate' && <div id="estimate-demo"><div className="section-header"><p className="eyebrow">Live demo</p><h2>Service estimate calculator</h2><p>Edit materials and labor, calculate totals and export a PDF.</p></div><div className="table-wrapper"><table className="items-table"><thead><tr><th>Description</th><th>Type</th><th>Qty.</th><th>Unit price</th><th>Subtotal</th></tr></thead><tbody>{items.map((item, index) => { const subtotal = toNumber(item.quantity) * toNumber(item.price); return <tr key={index}><td><input value={item.description} onChange={e => updateItem(index, 'description', e.target.value)} /></td><td><select value={item.type} onChange={e => updateItem(index, 'type', e.target.value)}><option value="material">Material</option><option value="labor">Labor</option></select></td><td><input type="number" value={item.quantity} onChange={e => updateItem(index, 'quantity', e.target.value)} /></td><td><input type="number" value={item.price} onChange={e => updateItem(index, 'price', e.target.value)} /></td><td className="numeric">${subtotal.toFixed(2)}</td></tr> })}</tbody></table><div className="table-actions"><button className="btn secondary" onClick={() => setItems(prev => [...prev, { description: '', type: 'material', quantity: 1, price: 0 }])}>+ Add item</button><button className="btn primary" onClick={exportPdf}>Export PDF</button></div></div><div className="totals"><div className="card"><h3>Materials</h3><p>${totals.materials.toFixed(2)}</p></div><div className="card"><h3>Labor</h3><p>${totals.labor.toFixed(2)}</p></div><div className="card total"><h3>Total</h3><p>${totals.total.toFixed(2)}</p></div></div></div>}

      <DetailPanel active={active} />
    </section>
  </main>
}
