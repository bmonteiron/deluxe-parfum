'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    paymentMethod: 'PIX'
  })

  useEffect(() => {
    const cartStr = localStorage.getItem('cart')
    if (cartStr) {
      setCart(JSON.parse(cartStr))
    } else {
      router.push('/carrinho')
    }
  }, [])

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          customerData: formData,
          paymentMethod: formData.paymentMethod
        })
      })

      if (res.ok) {
        const order = await res.json()
        localStorage.removeItem('cart')
        alert(`Pedido #${order.id.slice(0, 8)} criado com sucesso! Entraremos em contato em breve.`)
        router.push('/')
      } else {
        alert('Erro ao criar pedido')
      }
    } catch (error) {
      alert('Erro ao processar pedido')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white">
        <nav className="container mx-auto px-4 py-6">
          <Link href="/" className="text-2xl font-serif font-bold">
            DELUXE <span className="text-gold-400">PARFUM</span>
          </Link>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-serif mb-12">Finalizar Compra</h1>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Seus Dados</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome Completo *</label>
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
                <label className="block text-sm font-medium mb-2">Telefone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="input-field"
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Forma de Pagamento *</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  className="input-field"
                >
                  <option value="PIX">PIX</option>
                  <option value="CARD">Cartão</option>
                  <option value="CASH">Dinheiro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Observações</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="input-field"
                  rows={3}
                  placeholder="Alguma informação adicional?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'Processando...' : 'Confirmar Pedido'}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Resumo do Pedido</h2>
            
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Frete:</span>
                <span>Retirada no local</span>
              </div>
              <div className="flex justify-between text-2xl font-bold border-t pt-2">
                <span>Total:</span>
                <span>R$ {getTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded">
              <p className="text-sm text-blue-900">
                ℹ️ Após confirmar o pedido, entraremos em contato pelo WhatsApp para combinar a retirada e o pagamento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
