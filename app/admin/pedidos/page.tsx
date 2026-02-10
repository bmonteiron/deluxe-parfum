import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminPedidosPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || !(session.user as any).isAdmin) {
    redirect('/login')
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      address: true,
      items: {
        include: {
          product: true
        }
      }
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white">
        <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/admin" className="text-2xl font-serif font-bold">
            DELUXE <span className="text-gold-400">ADMIN</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/" className="hover:text-gold-400">Ver Loja</Link>
            <span className="text-sm text-gray-400">{session.user?.name}</span>
          </div>
        </nav>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white min-h-screen shadow-md">
          <nav className="p-6 space-y-2">
            <Link href="/admin" className="block px-4 py-2 rounded hover:bg-gray-100">
              📊 Dashboard
            </Link>
            <Link href="/admin/produtos" className="block px-4 py-2 rounded hover:bg-gray-100">
              🛍️ Produtos
            </Link>
            <Link href="/admin/pedidos" className="block px-4 py-2 rounded bg-black text-white">
              📦 Pedidos
            </Link>
            <Link href="/admin/clientes" className="block px-4 py-2 rounded hover:bg-gray-100">
              👥 Clientes
            </Link>
            <Link href="/admin/estoque" className="block px-4 py-2 rounded hover:bg-gray-100">
              📋 Estoque de Produção
            </Link>
            <Link href="/admin/producao" className="block px-4 py-2 rounded hover:bg-gray-100">
              🏭 Produção
            </Link>
            <Link href="/admin/financeiro" className="block px-4 py-2 rounded hover:bg-gray-100">
              💰 Financeiro
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">Gestão de Pedidos</h1>

          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      Pedido #{order.id.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <OrderStatusBadge status={order.status} />
                    <p className="text-xs text-gray-600 mt-1">
                      Pagamento: <PaymentStatusBadge status={order.paymentStatus} />
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  {/* Cliente */}
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-700">👤 Cliente</h4>
                    <p className="font-medium">{order.user.name}</p>
                    <p className="text-sm text-gray-600">{order.user.email}</p>
                    <p className="text-sm text-gray-600">{order.user.phone}</p>
                  </div>

                  {/* Endereço */}
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-700">📍 Endereço de Retirada</h4>
                    <p className="text-sm">
                      {order.address.street}, {order.address.number}
                      {order.address.complement && ` - ${order.address.complement}`}
                    </p>
                    <p className="text-sm">
                      {order.address.neighborhood} - {order.address.city}/{order.address.state}
                    </p>
                    <p className="text-sm">CEP: {order.address.zipCode}</p>
                  </div>
                </div>

                {/* Produtos */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-3 text-gray-700">🛍️ Produtos</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-2 px-4 text-sm">Produto</th>
                          <th className="text-left py-2 px-4 text-sm">Qtd</th>
                          <th className="text-left py-2 px-4 text-sm">Preço Un.</th>
                          <th className="text-left py-2 px-4 text-sm">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.id} className="border-t">
                            <td className="py-2 px-4">
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-xs text-gray-500">
                                {item.product.size} - {item.product.concentration}
                              </p>
                            </td>
                            <td className="py-2 px-4">{item.quantity}x</td>
                            <td className="py-2 px-4">R$ {item.price.toFixed(2)}</td>
                            <td className="py-2 px-4 font-bold">
                              R$ {(item.price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Totais */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-600">
                      Método de Pagamento: <strong>{order.paymentMethod}</strong>
                    </p>
                    {order.notes && (
                      <p className="text-sm text-gray-600 mt-1">
                        Obs: {order.notes}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Subtotal: R$ {order.subtotal.toFixed(2)}</p>
                    <p className="text-2xl font-bold">Total: R$ {order.total.toFixed(2)}</p>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex space-x-2 mt-4 pt-4 border-t">
                  <select className="input-field flex-1">
                    <option value={order.status}>Status Atual: {getStatusLabel(order.status)}</option>
                    <option value="PENDING_PAYMENT">Aguardando Pagamento</option>
                    <option value="PAID">Pago</option>
                    <option value="PROCESSING">Processando</option>
                    <option value="SHIPPED">Enviado</option>
                    <option value="DELIVERED">Entregue</option>
                    <option value="CANCELLED">Cancelado</option>
                  </select>
                  <button className="btn-primary">
                    Atualizar Status
                  </button>
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <div className="card text-center py-12">
                <p className="text-gray-500 text-lg">Nenhum pedido encontrado</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-green-100 text-green-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-200 text-green-900',
    CANCELLED: 'bg-red-100 text-red-800',
  }

  return (
    <span className={`px-3 py-1 rounded text-sm font-medium ${colors[status]}`}>
      {getStatusLabel(status)}
    </span>
  )
}

function PaymentStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-gray-100 text-gray-800',
  }

  const labels: Record<string, string> = {
    PENDING: 'Pendente',
    PAID: 'Pago',
    FAILED: 'Falhou',
    REFUNDED: 'Reembolsado',
  }

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[status]}`}>
      {labels[status]}
    </span>
  )
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING_PAYMENT: 'Aguardando Pagamento',
    PAID: 'Pago',
    PROCESSING: 'Processando',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregue',
    CANCELLED: 'Cancelado',
  }
  return labels[status] || status
}
