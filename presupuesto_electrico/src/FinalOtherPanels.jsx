import { useMemo, useState } from 'react'
import jsPDF from 'jspdf'

const foods = [
  { name: 'Rice', kcal: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: 'Potato', kcal: 77, protein: 2, carbs: 17, fat: 0.1 },
  { name: 'Egg', kcal: 155, protein: 13, carbs: 1.1, fat: 11 },
  { name: 'Chicken breast', kcal: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Lentils', kcal: 116, protein: 9, carbs: 20, fat: 0.4 },
  { name: 'Oats', kcal: 389, protein: 16.9, carbs: 66, fat: 6.9 },
  { name: 'Banana', kcal: 89, protein: 1.1, carbs: 23, fat: 0.3 }
]

function toNumber(value) {
  const parsed = parseFloat(String(value).replace(',', '.'))
  return Number.isNaN(parsed) ? 0 : parsed
}

export function TaskPulsePanel() {
  return <div className="simple-panel"><div className="tool-heading"><span className="tool-icon blue">☑</span><div><h2>TaskPulse</h2><p>Public demo with browser-local auth flow, dashboard and task CRUD.</p></div></div><a className="btn-primary" href="https://portfolio-projects-dfi2.vercel.app" target="_blank" rel="noreferrer">Open TaskPulse demo →</a></div>
}

export function NutritionPanel() {
  const [foodQuery, setFoodQuery] = useState('')
  const query = foodQuery.trim().toLowerCase()
  const filteredFoods = useMemo(() => query ? foods.filter(food => food.name.toLowerCase().includes(query)) : [], [query])
  return <div className="tool-stack"><div className="tool-heading"><span className="tool-icon blue">♢</span><div><h2>Nutrition Analyzer</h2><p>Search sample nutritional values from a clean lookup UI.</p></div></div><input className="search-input" value={foodQuery} onChange={event => setFoodQuery(event.target.value)} placeholder="Search food: rice, potato, egg..." />{!query && <p className="muted-note">Type a food name to see the nutrition card.</p>}<div className="mini-grid">{filteredFoods.map(food => <div className="mini-card" key={food.name}><h3>{food.name}</h3><p>{food.kcal} kcal · {food.protein}g protein · {food.carbs}g carbs · {food.fat}g fat</p></div>)}</div></div>
}

export function EstimatePanel() {
  const [items, setItems] = useState([{ description: 'Cable 2x2.5mm', type: 'material', quantity: 20, price: 1500 }, { description: 'Service labor', type: 'labor', quantity: 5, price: 3500 }])
  const totals = useMemo(() => items.reduce((acc, item) => { const subtotal = toNumber(item.quantity) * toNumber(item.price); if (item.type === 'labor') acc.labor += subtotal; else acc.materials += subtotal; acc.total += subtotal; return acc }, { materials: 0, labor: 0, total: 0 }), [items])
  function updateItem(index, field, value) { setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item)) }
  function exportPdf() {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    doc.setFillColor(2, 6, 23)
    doc.rect(0, 0, pageWidth, 34, 'F')
    doc.setTextColor(248, 250, 252)
    doc.setFontSize(18)
    doc.text('Service Estimate', 14, 17)
    doc.setFontSize(10)
    doc.text('Generated from Manuel Falcone technical portfolio demo', 14, 25)
    doc.setDrawColor(249, 115, 22)
    doc.setLineWidth(1.1)
    doc.line(14, 39, pageWidth - 14, 39)
    let y = 50
    doc.setTextColor(71, 85, 105)
    doc.setFontSize(9)
    doc.text('DESCRIPTION', 14, y)
    doc.text('TYPE', 88, y)
    doc.text('QTY', 116, y)
    doc.text('UNIT', 137, y)
    doc.text('SUBTOTAL', 166, y)
    y += 5
    doc.setDrawColor(226, 232, 240)
    doc.line(14, y, pageWidth - 14, y)
    y += 8
    items.forEach(item => {
      const subtotal = toNumber(item.quantity) * toNumber(item.price)
      if (y > 260) { doc.addPage(); y = 22 }
      doc.setTextColor(15, 23, 42)
      doc.setFontSize(10)
      doc.text(String(item.description || 'Item').slice(0, 32), 14, y)
      doc.text(String(item.type || '-'), 88, y)
      doc.text(String(item.quantity || 0), 116, y)
      doc.text(`$${toNumber(item.price).toFixed(2)}`, 137, y)
      doc.text(`$${subtotal.toFixed(2)}`, 166, y)
      y += 8
    })
    y += 6
    doc.setFillColor(241, 245, 249)
    doc.roundedRect(116, y, 80, 34, 3, 3, 'F')
    doc.setTextColor(71, 85, 105)
    doc.setFontSize(9)
    doc.text('Materials', 122, y + 9)
    doc.text(`$${totals.materials.toFixed(2)}`, 166, y + 9)
    doc.text('Labor', 122, y + 18)
    doc.text(`$${totals.labor.toFixed(2)}`, 166, y + 18)
    doc.setTextColor(249, 115, 22)
    doc.setFontSize(12)
    doc.text('Total', 122, y + 29)
    doc.text(`$${totals.total.toFixed(2)}`, 164, y + 29)
    doc.save('service-estimate.pdf')
  }
  return <div className="tool-stack"><div className="tool-heading"><span className="tool-icon orange">▣</span><div><h2>Service Estimate</h2><p>Create service quotes, calculate totals and export PDF.</p></div></div><div className="estimate-table"><table><thead><tr><th>Description</th><th>Type</th><th>Qty.</th><th>Unit price</th><th>Subtotal</th></tr></thead><tbody>{items.map((item, index) => { const subtotal = toNumber(item.quantity) * toNumber(item.price); return <tr key={index}><td><input value={item.description} onChange={event => updateItem(index, 'description', event.target.value)} /></td><td><select value={item.type} onChange={event => updateItem(index, 'type', event.target.value)}><option value="material">Material</option><option value="labor">Labor</option></select></td><td><input type="number" value={item.quantity} onChange={event => updateItem(index, 'quantity', event.target.value)} /></td><td><input type="number" value={item.price} onChange={event => updateItem(index, 'price', event.target.value)} /></td><td>${subtotal.toFixed(2)}</td></tr> })}</tbody></table></div><div className="cta-row"><button className="btn-ghost" onClick={() => setItems(prev => [...prev, { description: '', type: 'material', quantity: 1, price: 0 }])}>+ Add item</button><button className="btn-primary" onClick={exportPdf}>Export PDF</button></div><div className="score-grid"><div className="score-card"><span>Materials</span><strong>${totals.materials.toFixed(2)}</strong></div><div className="score-card"><span>Labor</span><strong>${totals.labor.toFixed(2)}</strong></div><div className="score-card"><span>Total</span><strong>${totals.total.toFixed(2)}</strong></div></div></div>
}
