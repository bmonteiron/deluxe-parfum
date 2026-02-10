import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminClientesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || !(session.user as any).isAdmin) {
    redirect('/login')
  }

  const clientes = await prisma.user.findMany({
    where: { isAdmin: false },
    orderBy: { createdAt: 'desc' },
    include: {
      orders: {
        include: {
          items: true
        }
      },
      addresses: true
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
            <Link href="/admin/pedidos" className="block px-4 py-2 rounded hover:bg-gray-100">
              📦 Pedidos
            </Link>
            <Link href="/admin/clientes" className="block px-4 py-2 rounded bg-black text-white">
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
          <h1 className="text-3xl font-bold mb-8">Clientes</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <p className="text-gray-600 text-sm mb-2">Total de Clientes</p>
              <p className="text-3xl font-bold">{clientes.length}</p>
            </div>
            <div className="card">
              <p className="text-gray-600 text-sm mb-2">Clientes com Pedidos</p>
              <p className="text-3xl font-bold">
                {clientes.filter(c => c.orders.length > 0).length}
              </p>
            </div>
            <div className="card">
              <p className="text-gray-600 text-sm mb-2">Novos Este Mês</p>
              <p className="text-3xl font-bold">
                {clientes.filter(c => {
                  const mesAtual = new Date().getMonth()
                  const mesCliente = new Date(c.createdAt).getMonth()
                  return mesCliente === mesAtual
                }).length}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {clientes.map((cliente) => {
              const totalGasto = cliente.orders
                .filter(o => o.paymentStatus === 'PAID')
                .reduce((sum, o) => sum + o.total, 0)
              
              const pedidosPendentes = cliente.orders.filter(
                o => o.paymentStatus === 'PENDING'
              ).length

              return (
                <div key={cliente.id} className="card">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{cliente.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        📧 {cliente.email}
                        {cliente.phone && ` • 📱 ${cliente.phone}`}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">
                            📊 Estatísticas
                          </h4>
                          <ul className="text-sm space-y-1">
                            <li>
                              <strong>Total de pedidos:</strong> {cliente.orders.length}
                            </li>
                            <li>
                              <strong>Total gasto:</strong>{' '}
                              <span className="text-green-600 font-bold">
                                R$ {totalGasto.toFixed(2)}
                              </span>
                            </li>
                            <li>
                              <strong>Pendentes:</strong>{' '}
                              <span className={pedidosPendentes > 0 ? 'text-orange-600' : 'text-gray-600'}>
                                {pedidosPendentes}
                              </span>
                            </li>
                            <li className="text-gray-500">
                              Cliente desde: {new Date(cliente.createdAt).toLocaleDateString('pt-BR')}
                            </li>
                          </ul>
                        </div>

                        {cliente.addresses.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">
                              📍 Endereços
                            </h4>
                            <div className="space-y-2">
                              {cliente.addresses.map((endereco) => (
                                <div key={endereco.id} className="text-sm">
                                  <p>
                                    {endereco.street}, {endereco.number}
                                    {endereco.complement && ` - ${endereco.complement}`}
                                  </p>
                                  <p className="text-gray-600">
                                    {endereco.neighborhood} - {endereco.city}/{endereco.state}
                                  </p>
                                  {endereco.isDefault && (
                                    <span className="text-xs bg-gold-100 text-gold-800 px-2 py-0.5 rounded">
                                      Principal
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {cliente.orders.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">
                            🛍️ Últimos Pedidos
                          </h4>
                          <div className="space-y-1">
                            {cliente.orders.slice(0, 3).map((pedido) => (
                              <div key={pedido.id} className="text-sm flex justify-between">
                                <span>
                                  Pedido #{pedido.id.slice(0, 8)} •{' '}
                                  {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}
                                </span>
                                <span className="font-bold">R$ {pedido.total.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      <Link
                        href={`/admin/clientes/${cliente.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Ver detalhes →
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}

            {clientes.length === 0 && (
              <div className="card text-center py-12">
                <p className="text-gray-500 text-lg">Nenhum cliente cadastrado ainda</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
