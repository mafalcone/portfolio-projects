import React, { useState, useMemo } from 'react'
import jsPDF from 'jspdf'

const emptyItem = {
  descripcion: '',
  tipo: 'material', // material | mano_obra
  cantidad: 1,
  precio: 0
}

function parseNumber(value) {
  const v = parseFloat(String(value).replace(',', '.'))
  return isNaN(v) ? 0 : v
}

export default function App() {
  const [items, setItems] = useState([
    { ...emptyItem, descripcion: 'Cable 2x2.5mm', cantidad: 20, precio: 1500, tipo: 'material' },
    { ...emptyItem, descripcion: 'Colocación tomacorrientes', cantidad: 5, precio: 3500, tipo: 'mano_obra' }
  ])

  const handleChangeItem = (index, field, value) => {
    setItems(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const handleAddItem = () => {
    setItems(prev => [...prev, { ...emptyItem }])
  }

  const handleRemoveItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const totals = useMemo(() => {
    let materiales = 0
    let manoObra = 0

    items.forEach(item => {
      const cantidad = parseNumber(item.cantidad)
      const precio = parseNumber(item.precio)
      const subtotal = cantidad * precio

      if (item.tipo === 'mano_obra') {
        manoObra += subtotal
      } else {
        materiales += subtotal
      }
    })

    return {
      materiales,
      manoObra,
      total: materiales + manoObra
    }
  }, [items])

  const handleExportPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.text('Presupuesto', 10, 15)

    doc.setFontSize(11)
    let y = 25
    doc.text('Items:', 10, y)
    y += 5

    items.forEach((item, idx) => {
      const cantidad = parseNumber(item.cantidad)
      const precio = parseNumber(item.precio)
      const subtotal = cantidad * precio
      const linea = `${idx + 1}. [${item.tipo === 'mano_obra' ? 'MO' : 'MAT'}] ${item.descripcion} - Cant: ${cantidad} - $${precio.toFixed(2)} - Sub: $${subtotal.toFixed(2)}`
      doc.text(linea, 10, y)
      y += 6
      if (y > 270) {
        doc.addPage()
        y = 20
      }
    })

    y += 5
    doc.text(`Subtotales:`, 10, y)
    y += 6
    doc.text(`Materiales: $${totals.materiales.toFixed(2)}`, 10, y)
    y += 6
    doc.text(`Mano de obra: $${totals.manoObra.toFixed(2)}`, 10, y)
    y += 6
    doc.setFontSize(13)
    doc.text(`TOTAL: $${totals.total.toFixed(2)}`, 10, y)

    doc.save('presupuesto.pdf')
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Presupuesto</h1>
        </div>
        <button className="btn primary" onClick={handleExportPDF}>
          Exportar PDF
        </button>
      </header>

      <section className="table-wrapper">
        <table className="items-table">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Tipo</th>
              <th>Cant.</th>
              <th>Precio unitario</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const cantidad = parseNumber(item.cantidad)
              const precio = parseNumber(item.precio)
              const subtotal = cantidad * precio

              return (
                <tr key={idx}>
                  <td>
                    <input
                      type="text"
                      value={item.descripcion}
                      onChange={e => handleChangeItem(idx, 'descripcion', e.target.value)}
                      placeholder="Ej: Cable, tablero, mano de obra..."
                    />
                  </td>
                  <td>
                    <select
                      value={item.tipo}
                      onChange={e => handleChangeItem(idx, 'tipo', e.target.value)}
                    >
                      <option value="material">Material</option>
                      <option value="mano_obra">Mano de obra</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={item.cantidad}
                      onChange={e => handleChangeItem(idx, 'cantidad', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={item.precio}
                      onChange={e => handleChangeItem(idx, 'precio', e.target.value)}
                    />
                  </td>
                  <td className="numeric">
                    ${subtotal.toFixed(2)}
                  </td>
                  <td>
                    <button
                      className="btn danger small"
                      onClick={() => handleRemoveItem(idx)}
                    >
                      X
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <button className="btn secondary" onClick={handleAddItem}>
          + Agregar ítem
        </button>
      </section>

      <section className="totals">
        <div className="card">
          <h3>Materiales</h3>
          <p>${totals.materiales.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Mano de obra</h3>
          <p>${totals.manoObra.toFixed(2)}</p>
        </div>
        <div className="card total">
          <h3>Total</h3>
          <p>${totals.total.toFixed(2)}</p>
        </div>
      </section>
    </div>
  )
}
