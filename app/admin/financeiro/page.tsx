import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminFinanceiroPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || !(session.user as any).isAdmin) {
    redirect('/login')
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      payment: true,
      items: {
        include: {
          product: true
        }
      }
    }
  })

  const totalPago = orders
    .filter(o => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + o.total, 0)

  const totalPendente = orders
    .filter(o => o.paymentStatus === 'PENDING')
    .reduce((sum, o) => sum + o.total, 0)

  const totalMes = orders
    .filter(o => {
      const mesAtual = new Date().getMonth()
      const mesOrder = new Date(o.createdAt).getMonth()
      return mesOrder === mesAtual && o.paymentStatus === 'PAID'
    })
    .reduce((sum, o) => sum + o.total, 0)

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
            <Link href="/admin/pedidos" className="block px-4 py-2 rounded hover:bg-gray-100">
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
            <Link href="/admin/financeiro" className="block px-4 py-2 rounded bg-black text-white">
              💰 Financeiro
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">Controle Financeiro</h1>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <p className="text-gray-600 text-sm mb-2">💰 Total Recebido</p>
              <p className="text-3xl font-bold text-green-600">
                R$ {totalPago.toFixed(2)}
              </p>
            </div>

            <div className="card">
              <p className="text-gray-600 text-sm mb-2">⏳ Pendente</p>
              <p className="text-3xl font-bold text-orange-600">
                R$ {totalPendente.toFixed(2)}
              </p>
            </div>

            <div className="card">
              <p className="text-gray-600 text-sm mb-2">📅 Recebido Este Mês</p>
              <p className="text-3xl font-bold text-blue-600">
                R$ {totalMes.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Tabela de Pedidos */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Pagamentos e Pedidos</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Pedido</th>
                    <th className="text-left py-3 px-4">Cliente</th>
                    <th className="text-left py-3 px-4">Data</th>
                    <th className="text-left py-3 px-4">Método</th>
                    <th className="text-left py-3 px-4">Valor</th>
                    <th className="text-left py-3 px-4">Status Pgto</th>
                    <th className="text-left py-3 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{order.user.name}</p>
                          <p className="text-xs text-gray-500">{order.user.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm px-2 py-1 bg-gray-100 rounded">
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold">R$ {order.total.toFixed(2)}</p>
                      </td>
                      <td className="py-3 px-4">
                        <PaymentStatusBadge status={order.paymentStatus} />
                      </td>
                      <td className="py-3 px-4">
                        {order.paymentStatus === 'PENDING' ? (
                          <button className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                            Marcar Pago
                          </button>
                        ) : order.paidAt ? (
                          <p className="text-xs text-gray-500">
                            Pago em: {new Date(order.paidAt).toLocaleDateString('pt-BR')}
                          </p>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resumo por Método */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="card">
              <h3 className="font-bold mb-3">📱 PIX</h3>
              <p className="text-2xl font-bold text-purple-600">
                R$ {orders
                  .filter(o => o.paymentMethod === 'PIX' && o.paymentStatus === 'PAID')
                  .reduce((sum, o) => sum + o.total, 0)
                  .toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {orders.filter(o => o.paymentMethod === 'PIX' && o.paymentStatus === 'PAID').length} transações
              </p>
            </div>

            <div className="card">
              <h3 className="font-bold mb-3">💳 Cartão</h3>
              <p className="text-2xl font-bold text-blue-600">
                R$ {orders
                  .filter(o => o.paymentMethod === 'Cartão' && o.paymentStatus === 'PAID')
                  .reduce((sum, o) => sum + o.total, 0)
                  .toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {orders.filter(o => o.paymentMethod === 'Cartão' && o.paymentStatus === 'PAID').length} transações
              </p>
            </div>

            <div className="card">
              <h3 className="font-bold mb-3">💵 Dinheiro</h3>
              <p className="text-2xl font-bold text-green-600">
                R$ {orders
                  .filter(o => o.paymentMethod === 'Dinheiro' && o.paymentStatus === 'PAID')
                  .reduce((sum, o) => sum + o.total, 0)
                  .toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {orders.filter(o => o.paymentMethod === 'Dinheiro' && o.paymentStatus === 'PAID').length} transações
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function PaymentStatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; label: string }> = {
    PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendente' },
    PAID: { color: 'bg-green-100 text-green-800', label: 'Pago' },
    FAILED: { color: 'bg-red-100 text-red-800', label: 'Falhou' },
    REFUNDED: { color: 'bg-gray-100 text-gray-800', label: 'Reembolsado' },
  }

  const { color, label } = config[status] || config.PENDING

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
      {label}
    </span>
  )
}
