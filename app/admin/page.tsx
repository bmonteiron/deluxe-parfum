import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session || !(session.user as any).isAdmin) {
    redirect('/login')
  }

  // Buscar estatísticas
  const [
    totalPedidos,
    pedidosPendentes,
    totalProdutos,
    estoqueBaixo,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING_PAYMENT' } }),
    prisma.product.count(),
    prisma.product.count({ where: { stock: { lte: 5 } } }),
  ])

  const pedidosRecentes = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        }
      }
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Sidebar + Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white min-h-screen shadow-md">
          <nav className="p-6 space-y-2">
            <Link href="/admin" className="block px-4 py-2 rounded bg-black text-white">
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
            <Link href="/admin/financeiro" className="block px-4 py-2 rounded hover:bg-gray-100">
              💰 Financeiro
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total de Pedidos</p>
                  <p className="text-3xl font-bold">{totalPedidos}</p>
                </div>
                <div className="text-4xl">📦</div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pendentes</p>
                  <p className="text-3xl font-bold text-orange-600">{pedidosPendentes}</p>
                </div>
                <div className="text-4xl">⏳</div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Produtos</p>
                  <p className="text-3xl font-bold">{totalProdutos}</p>
                </div>
                <div className="text-4xl">🛍️</div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Estoque Baixo</p>
                  <p className="text-3xl font-bold text-red-600">{estoqueBaixo}</p>
                </div>
                <div className="text-4xl">⚠️</div>
              </div>
            </div>
          </div>

          {/* Pedidos Recentes */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Pedidos Recentes</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">ID</th>
                    <th className="text-left py-3 px-4">Cliente</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Total</th>
                    <th className="text-left py-3 px-4">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosRecentes.map((pedido) => (
                    <tr key={pedido.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm">
                        {pedido.id.slice(0, 8)}...
                      </td>
                      <td className="py-3 px-4">{pedido.user.name}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={pedido.status} />
                      </td>
                      <td className="py-3 px-4 font-bold">
                        R$ {pedido.total.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-green-100 text-green-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-200 text-green-900',
    CANCELLED: 'bg-red-100 text-red-800',
  }

  const labels: Record<string, string> = {
    PENDING_PAYMENT: 'Pendente',
    PAID: 'Pago',
    PROCESSING: 'Processando',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregue',
    CANCELLED: 'Cancelado',
  }

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status]}`}>
      {labels[status]}
    </span>
  )
}
