'use client'

import { useState, useEffect } from 'react'

export default function EstoqueAdminPage() {
  const [essences, setEssences] = useState([])
  const [alcohols, setAlcohols] = useState([])
  const [bottles, setBottles] = useState([])
  const [bases, setBases] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: 'essence',
    name: '',
    quantity: '',
    cost: '',
    size: '100ml'
  })

  useEffect(() => {
    fetchStock()
  }, [])

  const fetchStock = async () => {
    try {
      const [essRes, alcRes, botRes, baseRes] = await Promise.all([
        fetch('/api/stock/essences'),
        fetch('/api/stock/alcohols'),
        fetch('/api/stock/bottles'),
        fetch('/api/stock/bases')
      ])

      setEssences(await essRes.json() || [])
      setAlcohols(await alcRes.json() || [])
      setBottles(await botRes.json() || [])
      setBases(await baseRes.json() || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/stock/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        alert('Material adicionado!')
        setFormData({ type: 'essence', name: '', quantity: '', cost: '', size: '100ml' })
        setShowForm(false)
        fetchStock()
      } else {
        alert('Erro ao adicionar material')
      }
    } catch (error) {
      alert('Erro ao adicionar material')
    }
  }

  if (loading) return <div className="p-8">Carregando...</div>

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Estoque de Produção</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          + Adicionar Material
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">Adicionar Material</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tipo *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="input-field"
                >
                  <option value="essence">Essência</option>
                  <option value="alcohol">Álcool</option>
                  <option value="bottle">Frasco</option>
                  <option value="base">Base Pronta</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nome *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                  placeholder="Ex: Rosa Damascena"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Quantidade * {formData.type === 'essence' && '(ml)'}
                  {formData.type === 'alcohol' && '(litros)'}
                  {(formData.type === 'bottle' || formData.type === 'base') && '(unidades)'}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Custo (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({...formData, cost: e.target.value})}
                  className="input-field"
                  required
                />
              </div>

              {formData.type === 'bottle' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Tamanho</label>
                  <select
                    value={formData.size}
                    onChange={(e) => setFormData({...formData, size: e.target.value})}
                    className="input-field"
                  >
                    <option value="30ml">30ml</option>
                    <option value="50ml">50ml</option>
                    <option value="100ml">100ml</option>
                    <option value="150ml">150ml</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <button type="submit" className="btn-primary">
                Adicionar
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Essences */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4">Essências</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-4">Nome</th>
                <th className="p-4">Quantidade (ml)</th>
                <th className="p-4">Custo (R$)</th>
              </tr>
            </thead>
            <tbody>
              {essences.map((item: any) => (
                <tr key={item.id} className="border-b">
                  <td className="p-4">{item.name}</td>
                  <td className="p-4">{item.quantityMl}ml</td>
                  <td className="p-4">R$ {item.cost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alcohols */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4">Álcool</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-4">Nome</th>
                <th className="p-4">Quantidade (L)</th>
                <th className="p-4">Custo (R$)</th>
              </tr>
            </thead>
            <tbody>
              {alcohols.map((item: any) => (
                <tr key={item.id} className="border-b">
                  <td className="p-4">{item.name}</td>
                  <td className="p-4">{item.quantityLiters}L</td>
                  <td className="p-4">R$ {item.cost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottles */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4">Frascos</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-4">Modelo</th>
                <th className="p-4">Tamanho</th>
                <th className="p-4">Quantidade</th>
                <th className="p-4">Custo (R$)</th>
              </tr>
            </thead>
            <tbody>
              {bottles.map((item: any) => (
                <tr key={item.id} className="border-b">
                  <td className="p-4">{item.model}</td>
                  <td className="p-4">{item.size}</td>
                  <td className="p-4">{item.quantity} un</td>
                  <td className="p-4">R$ {item.cost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bases */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4">Bases Prontas</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-4">Nome</th>
                <th className="p-4">Quantidade</th>
                <th className="p-4">Custo (R$)</th>
              </tr>
            </thead>
            <tbody>
              {bases.map((item: any) => (
                <tr key={item.id} className="border-b">
                  <td className="p-4">{item.name}</td>
                  <td className="p-4">{item.quantity} un</td>
                  <td className="p-4">R$ {item.cost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
