import React, { useMemo, useState } from 'react'
import jsPDF from 'jspdf'

const projects = [
  {
    name: 'TaskPulse',
    area: 'Fullstack / MERN',
    status: 'Demo mode + optional backend',
    desc: 'Task management app with authentication flow, API integration and CRUD behavior.',
    stack: 'React, Vite, Node.js, Express, MongoDB, JWT'
  },
  {
    name: 'Log Monitor',
    area: 'Infrastructure / DevOps',
    status: 'Code-first Python dashboard',
    desc: 'Log parser and system metrics dashboard for CPU, memory, process and log visibility.',
    stack: 'Python, FastAPI, Jinja2, psutil'
  },
  {
    name: 'Web Hardening Auditor',
    area: 'Cybersecurity / DevSecOps',
    status: 'Security auditing tool',
    desc: 'Audits web security posture using headers, HTTPS/TLS checks, cookie flags and scoring.',
    stack: 'Python, security checks, HTML reports'
  },
  {
    name: 'Nutrition Analyzer',
    area: 'Python / API',
    status: 'Lightweight API/UI',
    desc: 'Small FastAPI project for food lookup, nutritional data and clean API structure.',
    stack: 'Python, FastAPI, Jinja2'
  }
]

const initialItems = [
  { description: 'Cable 2x2.5mm', type: 'material', quantity: 20, price: 1500 },
  { description: 'Service labor', type: 'labor', quantity: 5, price: 3500 }
]

function numberValue(value) {
  const parsed = parseFloat(String(value).replace(',', '.'))
  return Number.isNaN(parsed) ? 0 : parsed
}

export default function App() {
  const [items, setItems] = useState(initialItems)

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        const subtotal = numberValue(item.quantity) * numberValue(item.price)
        if (item.type === 'labor') acc.labor += subtotal
        else acc.materials += subtotal
        acc.total += subtotal
        return acc
      },
      { materials: 0, labor: 0, total: 0 }
    )
  }, [items])

  function updateItem(index, field, value) {
    setItems(prev => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
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
      const subtotal = numberValue(item.quantity) * numberValue(item.price)
      doc.text(`${index + 1}. ${item.description || 'Item'} - ${item.quantity} x $${numberValue(item.price).toFixed(2)} = $${subtotal.toFixed(2)}`, 10, y)
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
        <p className="hero-text">
          IT, infrastructure, support, backend/frontend, automation and security-oriented projects built for technical review.
        </p>
        <div className="hero-actions">
          <a className="btn primary" href="https://github.com/mafalcone/portfolio-projects" target="_blank" rel="noreferrer">View repository</a>
          <a className="btn secondary" href="#projects">View projects</a>
        </div>
      </section>

      <section className="section" id="projects">
        <div className="section-header">
          <p className="eyebrow">Selected work</p>
          <h2>Project index</h2>
        </div>
        <div className="project-grid">
          {projects.map(project => (
            <article className="project-card" key={project.name}>
              <div className="card-topline">
                <span>{project.area}</span>
                <strong>{project.status}</strong>
              </div>
              <h3>{project.name}</h3>
              <p>{project.desc}</p>
              <small>{project.stack}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="section calculator-section">
        <div className="section-header">
          <p className="eyebrow">Live demo</p>
          <h2>Service estimate calculator</h2>
          <p>Editable frontend demo for materials, labor, subtotals and PDF export.</p>
        </div>

        <div className="table-wrapper">
          <table className="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Type</th>
                <th>Qty.</th>
                <th>Unit price</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const subtotal = numberValue(item.quantity) * numberValue(item.price)
                return (
                  <tr key={index}>
                    <td><input value={item.description} onChange={e => updateItem(index, 'description', e.target.value)} /></td>
                    <td>
                      <select value={item.type} onChange={e => updateItem(index, 'type', e.target.value)}>
                        <option value="material">Material</option>
                        <option value="labor">Labor</option>
                      </select>
                    </td>
                    <td><input type="number" min="0" value={item.quantity} onChange={e => updateItem(index, 'quantity', e.target.value)} /></td>
                    <td><input type="number" min="0" value={item.price} onChange={e => updateItem(index, 'price', e.target.value)} /></td>
                    <td className="numeric">${subtotal.toFixed(2)}</td>
                    <td><button className="btn danger small" onClick={() => removeItem(index)}>X</button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="table-actions">
            <button className="btn secondary" onClick={addItem}>+ Add item</button>
            <button className="btn primary" onClick={exportPdf}>Export PDF</button>
          </div>
        </div>

        <div className="totals">
          <div className="card"><h3>Materials</h3><p>${totals.materials.toFixed(2)}</p></div>
          <div className="card"><h3>Labor</h3><p>${totals.labor.toFixed(2)}</p></div>
          <div className="card total"><h3>Total</h3><p>${totals.total.toFixed(2)}</p></div>
        </div>
      </section>
    </main>
  )
}
