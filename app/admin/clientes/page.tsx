'use client'

import { useState, useEffect } from 'react'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  orders: any[]
  createdAt: string
}

export default function ClientesAdminPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '123456'
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customers')
      const data = await res.json()
      setCustomers(data)
    } catch (error) {
      alert('Erro ao carregar clientes')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        alert('Cliente cadastrado!')
        setFormData({ name: '', email: '', phone: '', password: '123456' })
        setShowForm(false)
        fetchCustomers()
      } else {
        const error = await res.json()
        alert(error.error || 'Erro ao cadastrar')
      }
    } catch (error) {
      alert('Erro ao cadastrar cliente')
    }
  }

  const getTotalSpent = (orders: any[]) => {
    return orders.reduce((sum, order) => sum + order.total, 0)
  }

  if (loading) return <div className="p-8">Carregando...</div>

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          + Novo Cliente
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">Cadastrar Cliente</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Telefone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="input-field"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Senha Inicial</label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <button type="submit" className="btn-primary">
                Cadastrar
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="border-b">
            <tr className="text-left">
              <th className="p-4">Nome</th>
              <th className="p-4">Email</th>
              <th className="p-4">Telefone</th>
              <th className="p-4">Pedidos</th>
              <th className="p-4">Total Gasto</th>
              <th className="p-4">Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{customer.name}</td>
                <td className="p-4">{customer.email}</td>
                <td className="p-4">{customer.phone || '-'}</td>
                <td className="p-4">{customer.orders.length}</td>
                <td className="p-4 font-bold">R$ {getTotalSpent(customer.orders).toFixed(2)}</td>
                <td className="p-4 text-sm text-gray-500">
                  {new Date(customer.createdAt).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {customers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Nenhum cliente cadastrado
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Total de {customers.length} cliente(s)
      </div>
    </div>
  )
}
