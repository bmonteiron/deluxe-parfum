'use client'

import { useState, useEffect } from 'react'

interface Order {
  id: string
  user: { name: string; email: string }
  status: string
  paymentMethod: string
  paymentStatus: string
  total: number
  createdAt: string
  items: any[]
}

export default function PedidosAdminPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPayment, setFilterPayment] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [orders, filterStatus, filterPayment])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(data)
    } catch (error) {
      alert('Erro ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...orders]

    if (filterStatus !== 'all') {
      filtered = filtered.filter(o => o.status === filterStatus)
    }

    if (filterPayment !== 'all') {
      filtered = filtered.filter(o => o.paymentStatus === filterPayment)
    }

    setFilteredOrders(filtered)
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status,
          paymentStatus: orders.find(o => o.id === id)?.paymentStatus 
        })
      })
      fetchOrders()
    } catch (error) {
      alert('Erro ao atualizar status')
    }
  }

  const updatePayment = async (id: string, paymentStatus: string) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: orders.find(o => o.id === id)?.status,
          paymentStatus
        })
      })
      fetchOrders()
    } catch (error) {
      alert('Erro ao atualizar pagamento')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800',
      PAID: 'bg-green-100 text-green-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) return <div className="p-8">Carregando...</div>

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Pedidos</h1>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Status do Pedido</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">Todos</option>
              <option value="PENDING_PAYMENT">Aguardando Pagamento</option>
              <option value="PAID">Pago</option>
              <option value="PROCESSING">Processando</option>
              <option value="SHIPPED">Enviado</option>
              <option value="DELIVERED">Entregue</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status do Pagamento</label>
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="input-field"
            >
              <option value="all">Todos</option>
              <option value="PENDING">Pendente</option>
              <option value="PAID">Pago</option>
              <option value="FAILED">Falhou</option>
              <option value="REFUNDED">Reembolsado</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterStatus('all')
                setFilterPayment('all')
              }}
              className="btn-outline w-full"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">Pedido #{order.id.slice(0, 8)}</h3>
                <p className="text-sm text-gray-600">
                  {order.user.name} • {order.user.email}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">R$ {order.total.toFixed(2)}</p>
                <p className="text-sm text-gray-600">{order.paymentMethod}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status do Pedido</label>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="input-field"
                >
                  <option value="PENDING_PAYMENT">Aguardando Pagamento</option>
                  <option value="PAID">Pago</option>
                  <option value="PROCESSING">Processando</option>
                  <option value="SHIPPED">Enviado</option>
                  <option value="DELIVERED">Entregue</option>
                  <option value="CANCELLED">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status do Pagamento</label>
                <select
                  value={order.paymentStatus}
                  onChange={(e) => updatePayment(order.id, e.target.value)}
                  className="input-field"
                >
                  <option value="PENDING">Pendente</option>
                  <option value="PAID">Pago</option>
                  <option value="FAILED">Falhou</option>
                  <option value="REFUNDED">Reembolsado</option>
                </select>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Itens do Pedido:</p>
              <div className="space-y-1">
                {order.items.map((item: any) => (
                  <p key={item.id} className="text-sm text-gray-600">
                    • {item.product.name} - {item.quantity}x R$ {item.price.toFixed(2)}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="card text-center py-12 text-gray-500">
            Nenhum pedido encontrado
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Mostrando {filteredOrders.length} de {orders.length} pedidos
      </div>
    </div>
  )
}
