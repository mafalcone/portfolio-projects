import React, { useMemo, useState } from 'react'
import jsPDF from 'jspdf'

const projects = [
  {
    name: 'TaskPulse',
    area: 'Fullstack / MERN',
    status: 'Live demo',
    desc: 'Task management frontend with login flow, dashboard behavior and task CRUD patterns.',
    stack: 'React, Vite, Node.js, Express, MongoDB',
    href: 'https://portfolio-projects-dfi2.vercel.app',
    external: true
  },
  {
    name: 'Service Estimate Calculator',
    area: 'Frontend / business tooling',
    status: 'Live demo',
    desc: 'Editable calculator for materials, labor, subtotals and PDF export.',
    stack: 'React, Vite, jsPDF',
    href: '#estimate-demo',
    external: false
  }
]

function toNumber(value) {
  const parsed = parseFloat(String(value).replace(',', '.'))
  return Number.isNaN(parsed) ? 0 : parsed
}

export default function PublicPortfolio() {
  const [items, setItems] = useState([
    { description: 'Cable 2x2.5mm', type: 'material', quantity: 20, price: 1500 },
    { description: 'Service labor', type: 'labor', quantity: 5, price: 3500 }
  ])

  const totals = useMemo(() => items.reduce((acc, item) => {
    const subtotal = toNumber(item.quantity) * toNumber(item.price)
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
    doc.setFontSize(10)
    let y = 25
    items.forEach((item, index) => {
      const subtotal = toNumber(item.quantity) * toNumber(item.price)
      doc.text(`${index + 1}. ${item.description || 'Item'} - ${item.quantity} x $${toNumber(item.price).toFixed(2)} = $${subtotal.toFixed(2)}`, 10, y)
      y += 6
      if (y > 270) {
        doc.addPage()
        y = 20
      }
    })
    y += 6
    doc.setFontSize(13)
    doc.text(`Total: $${totals.total.toFixed(2)}`, 10, y)
    doc.save('service-estimate.pdf')
  }

  return (
    <main className="app">
      <section className="hero">
        <p className="eyebrow">Technical Portfolio</p>
        <h1>Manuel Falcone</h1>
        <p className="hero-text">Infrastructure, support, backend/frontend, automation and security-oriented projects with practical implementation details.</p>
        <div className="hero-actions">
          <a className="btn primary" href="#projects">View projects</a>
          <a className="btn secondary" href="https://github.com/mafalcone/portfolio-projects" target="_blank" rel="noreferrer">Repository</a>
        </div>
      </section>

      <section className="section" id="projects">
        <div className="section-header">
          <p className="eyebrow">Selected work</p>
          <h2>Live projects</h2>
          <p>Projects currently available as public browser demos.</p>
        </div>
        <div className="project-grid">
          {projects.map(project => (
            <a className="project-card" key={project.name} href={project.href} target={project.external ? '_blank' : undefined} rel={project.external ? 'noreferrer' : undefined}>
              <div className="card-topline"><span>{project.area}</span><strong>{project.status}</strong></div>
              <h3>{project.name}</h3>
              <p>{project.desc}</p>
              <small>{project.stack}</small>
              <span className="card-link">Open project →</span>
            </a>
          ))}
        </div>
      </section>

      <section className="section calculator-section" id="estimate-demo">
        <div className="section-header">
          <p className="eyebrow">Live demo</p>
          <h2>Service estimate calculator</h2>
          <p>Edit materials and labor, calculate totals and export a PDF.</p>
        </div>
        <div className="table-wrapper">
          <table className="items-table">
            <thead><tr><th>Description</th><th>Type</th><th>Qty.</th><th>Unit price</th><th>Subtotal</th><th></th></tr></thead>
            <tbody>{items.map((item, index) => {
              const subtotal = toNumber(item.quantity) * toNumber(item.price)
              return <tr key={index}>
                <td><input value={item.description} onChange={event => updateItem(index, 'description', event.target.value)} /></td>
                <td><select value={item.type} onChange={event => updateItem(index, 'type', event.target.value)}><option value="material">Material</option><option value="labor">Labor</option></select></td>
                <td><input type="number" min="0" value={item.quantity} onChange={event => updateItem(index, 'quantity', event.target.value)} /></td>
                <td><input type="number" min="0" value={item.price} onChange={event => updateItem(index, 'price', event.target.value)} /></td>
                <td className="numeric">${subtotal.toFixed(2)}</td>
                <td><button className="btn danger small" onClick={() => removeItem(index)}>X</button></td>
              </tr>
            })}</tbody>
          </table>
          <div className="table-actions"><button className="btn secondary" onClick={addItem}>+ Add item</button><button className="btn primary" onClick={exportPdf}>Export PDF</button></div>
        </div>
        <div className="totals"><div className="card"><h3>Materials</h3><p>${totals.materials.toFixed(2)}</p></div><div className="card"><h3>Labor</h3><p>${totals.labor.toFixed(2)}</p></div><div className="card total"><h3>Total</h3><p>${totals.total.toFixed(2)}</p></div></div>
      </section>
    </main>
  )
}
