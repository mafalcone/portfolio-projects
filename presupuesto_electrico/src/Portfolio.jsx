import React, { useMemo, useState } from 'react'
import jsPDF from 'jspdf'

const sampleLogs = `[2026-06-29 08:12:03] INFO Backup job started
[2026-06-29 08:12:41] INFO Connected to database
[2026-06-29 08:13:09] WARNING Disk usage above 80%
[2026-06-29 08:13:44] ERROR Login attempt blocked
[2026-06-29 08:14:30] INFO Backup job completed`

const foods = [
  { name: 'Rice', kcal: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: 'Egg', kcal: 155, protein: 13, carbs: 1.1, fat: 11 },
  { name: 'Chicken breast', kcal: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Lentils', kcal: 116, protein: 9, carbs: 20, fat: 0.4 },
  { name: 'Oats', kcal: 389, protein: 16.9, carbs: 66, fat: 6.9 },
  { name: 'Banana', kcal: 89, protein: 1.1, carbs: 23, fat: 0.3 }
]

const projects = [
  { name: 'TaskPulse', area: 'Fullstack', status: 'Live app', desc: 'Task manager demo with auth flow and CRUD behavior.', href: 'https://portfolio-projects-dfi2.vercel.app' },
  { name: 'Log Monitor', area: 'Infra / Ops', status: 'Browser demo', desc: 'Paste logs and get a quick operational summary.', href: '#log-demo' },
  { name: 'Site Audit', area: 'DevSecOps', status: 'Browser demo', desc: 'Generate a quick website review preview.', href: '#site-demo' },
  { name: 'Nutrition Analyzer', area: 'Python / API', status: 'Browser demo', desc: 'Search nutrition data from a sample dataset.', href: '#nutrition-demo' },
  { name: 'Service Estimate', area: 'Frontend', status: 'Browser demo', desc: 'Build an estimate and export a PDF.', href: '#estimate-demo' }
]

function numberValue(value) {
  const parsed = parseFloat(String(value).replace(',', '.'))
  return Number.isNaN(parsed) ? 0 : parsed
}

function parseLogs(text) {
  const lines = text.split('\n').filter(Boolean)
  const count = word => lines.filter(line => line.toLowerCase().includes(word)).length
  return { total: lines.length, info: count('info'), warning: count('warning'), error: count('error'), latest: lines.slice(-3).reverse() }
}

function buildReport(target) {
  const value = target.trim() || 'https://example.com'
  const good = value.startsWith('https://')
  return { target: value, score: good ? 82 : 58, https: good ? 'Pass' : 'Review', headers: good ? 'Partial' : 'Missing', info: 'Review response metadata' }
}

export default function Portfolio() {
  const [logs, setLogs] = useState(sampleLogs)
  const [foodQuery, setFoodQuery] = useState('rice')
  const [target, setTarget] = useState('https://example.com')
  const [report, setReport] = useState(buildReport('https://example.com'))
  const [items, setItems] = useState([
    { description: 'Cable 2x2.5mm', type: 'material', quantity: 20, price: 1500 },
    { description: 'Service labor', type: 'labor', quantity: 5, price: 3500 }
  ])

  const stats = useMemo(() => parseLogs(logs), [logs])
  const foodResults = useMemo(() => foods.filter(food => food.name.toLowerCase().includes(foodQuery.toLowerCase())), [foodQuery])
  const totals = useMemo(() => items.reduce((acc, item) => {
    const subtotal = numberValue(item.quantity) * numberValue(item.price)
    if (item.type === 'labor') acc.labor += subtotal
    else acc.materials += subtotal
    acc.total += subtotal
    return acc
  }, { materials: 0, labor: 0, total: 0 }), [items])

  function updateItem(index, field, value) {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item))
  }

  function addItem() {
    setItems(prev => [...prev, { description: '', type: 'material', quantity: 1, price: 0 }])
  }

  function removeItem(index) {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  function exportPdf() {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Service Estimate', 10, 15)
    doc.setFontSize(11)
    let y = 25
    items.forEach((item, index) => {
      const subtotal = numberValue(item.quantity) * numberValue(item.price)
      doc.text(`${index + 1}. ${item.description || 'Item'} - ${subtotal.toFixed(2)}`, 10, y)
      y += 6
    })
    doc.text(`Total: ${totals.total.toFixed(2)}`, 10, y + 8)
    doc.save('service-estimate.pdf')
  }

  return <main className="app">
    <section className="hero">
      <p className="eyebrow">Technical Portfolio</p>
      <h1>Manuel Falcone</h1>
      <p className="hero-text">Infrastructure, support, fullstack, automation and security-oriented projects with browser demos and source code.</p>
      <div className="hero-actions"><a className="btn primary" href="#projects">Open demos</a><a className="btn secondary" href="https://github.com/mafalcone/portfolio-projects" target="_blank" rel="noreferrer">Repository</a></div>
    </section>

    <section className="section" id="projects">
      <div className="section-header"><p className="eyebrow">Selected work</p><h2>Projects</h2><p>Each card opens a live app or a browser demo.</p></div>
      <div className="project-grid">{projects.map(project => <a className="project-card" key={project.name} href={project.href} target={project.href.startsWith('http') ? '_blank' : undefined} rel={project.href.startsWith('http') ? 'noreferrer' : undefined}><div className="card-topline"><span>{project.area}</span><strong>{project.status}</strong></div><h3>{project.name}</h3><p>{project.desc}</p><span className="card-link">Open demo →</span></a>)}</div>
    </section>

    <section className="section demo-section" id="log-demo"><div className="section-header"><p className="eyebrow">Browser demo</p><h2>Log Monitor</h2><p>Paste logs and review the summary.</p></div><textarea className="demo-textarea" value={logs} onChange={event => setLogs(event.target.value)} /><div className="metrics-grid"><div className="card"><h3>Total</h3><p>{stats.total}</p></div><div className="card"><h3>Info</h3><p>{stats.info}</p></div><div className="card"><h3>Warnings</h3><p>{stats.warning}</p></div><div className="card"><h3>Errors</h3><p>{stats.error}</p></div></div><div className="console-card">{stats.latest.map((line, index) => <code key={index}>{line}</code>)}</div></section>

    <section className="section demo-section" id="site-demo"><div className="section-header"><p className="eyebrow">Browser demo</p><h2>Site Audit</h2><p>Generate a quick report preview for a target URL.</p></div><div className="inline-form"><input value={target} onChange={event => setTarget(event.target.value)} /><button className="btn primary" onClick={() => setReport(buildReport(target))}>Generate report</button></div><div className="report-card"><div className="score-badge">{report.score}/100</div><h3>{report.target}</h3><ul><li><strong>HTTPS:</strong> {report.https}</li><li><strong>Headers:</strong> {report.headers}</li><li><strong>Public info:</strong> {report.info}</li></ul></div></section>

    <section className="section demo-section" id="nutrition-demo"><div className="section-header"><p className="eyebrow">Browser demo</p><h2>Nutrition Analyzer</h2><p>Search food items and review values per 100g.</p></div><div className="inline-form"><input value={foodQuery} onChange={event => setFoodQuery(event.target.value)} placeholder="Search food" /></div><div className="project-grid compact-grid">{foodResults.map(food => <div className="project-card static-card" key={food.name}><h3>{food.name}</h3><p>{food.kcal} kcal · {food.protein}g protein · {food.carbs}g carbs · {food.fat}g fat</p></div>)}</div></section>

    <section className="section calculator-section" id="estimate-demo"><div className="section-header"><p className="eyebrow">Browser demo</p><h2>Service estimate calculator</h2><p>Edit materials and labor, calculate totals and export a PDF.</p></div><div className="table-wrapper"><table className="items-table"><thead><tr><th>Description</th><th>Type</th><th>Qty.</th><th>Unit price</th><th>Subtotal</th><th></th></tr></thead><tbody>{items.map((item, index) => { const subtotal = numberValue(item.quantity) * numberValue(item.price); return <tr key={index}><td><input value={item.description} onChange={e => updateItem(index, 'description', e.target.value)} /></td><td><select value={item.type} onChange={e => updateItem(index, 'type', e.target.value)}><option value="material">Material</option><option value="labor">Labor</option></select></td><td><input type="number" min="0" value={item.quantity} onChange={e => updateItem(index, 'quantity', e.target.value)} /></td><td><input type="number" min="0" value={item.price} onChange={e => updateItem(index, 'price', e.target.value)} /></td><td className="numeric">${subtotal.toFixed(2)}</td><td><button className="btn danger small" onClick={() => removeItem(index)}>X</button></td></tr> })}</tbody></table><div className="table-actions"><button className="btn secondary" onClick={addItem}>+ Add item</button><button className="btn primary" onClick={exportPdf}>Export PDF</button></div></div><div className="totals"><div className="card"><h3>Materials</h3><p>${totals.materials.toFixed(2)}</p></div><div className="card"><h3>Labor</h3><p>${totals.labor.toFixed(2)}</p></div><div className="card total"><h3>Total</h3><p>${totals.total.toFixed(2)}</p></div></div></section>
  </main>
}
