import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminProducaoPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || !(session.user as any).isAdmin) {
    redirect('/login')
  }

  const productions = await prisma.production.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: {
      essences: {
        include: { essence: true }
      },
      alcoholUsed: {
        include: { alcohol: true }
      },
      bottles: {
        include: { bottle: true }
      },
      outputs: {
        include: { product: true }
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
            <Link href="/admin/pedidos" className="block px-4 py-2 rounded hover:bg-gray-100">
              📦 Pedidos
            </Link>
            <Link href="/admin/clientes" className="block px-4 py-2 rounded hover:bg-gray-100">
              👥 Clientes
            </Link>
            <Link href="/admin/estoque" className="block px-4 py-2 rounded hover:bg-gray-100">
              📋 Estoque de Produção
            </Link>
            <Link href="/admin/producao" className="block px-4 py-2 rounded bg-black text-white">
              🏭 Produção
            </Link>
            <Link href="/admin/financeiro" className="block px-4 py-2 rounded hover:bg-gray-100">
              💰 Financeiro
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Controle de Produção</h1>
            <Link href="/admin/producao/nova" className="btn-primary">
              + Nova Produção
            </Link>
          </div>

          <div className="card mb-6 bg-blue-50 border-blue-200">
            <h3 className="font-bold text-blue-900 mb-2">💡 Como funciona?</h3>
            <p className="text-sm text-blue-800">
              Registre cada lote de produção informando os materiais consumidos (essências, álcool, frascos). 
              O sistema dará baixa automática no estoque de materiais e adicionará os perfumes prontos ao estoque de produtos.
            </p>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">Histórico de Produção</h2>
            
            {productions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-2">Nenhuma produção registrada ainda</p>
                <p className="text-sm">Clique em "Nova Produção" para começar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {productions.map((production) => (
                  <div key={production.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{production.productName}</h3>
                        <p className="text-sm text-gray-600">
                          Produzido em: {new Date(production.createdAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          {production.quantityProduced} unidades
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {/* Essências Usadas */}
                      {production.essences.length > 0 && (
                        <div>
                          <p className="font-medium text-gray-700 mb-1">💧 Essências:</p>
                          <ul className="space-y-1">
                            {production.essences.map((pe) => (
                              <li key={pe.id} className="text-gray-600">
                                • {pe.essence.name}: {pe.quantityUsed} mL
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Álcool Usado */}
                      {production.alcoholUsed.length > 0 && (
                        <div>
                          <p className="font-medium text-gray-700 mb-1">🧪 Álcool:</p>
                          <ul className="space-y-1">
                            {production.alcoholUsed.map((pa) => (
                              <li key={pa.id} className="text-gray-600">
                                • {pa.alcohol.name}: {pa.quantityUsed} L
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Frascos Usados */}
                      {production.bottles.length > 0 && (
                        <div>
                          <p className="font-medium text-gray-700 mb-1">🫙 Frascos:</p>
                          <ul className="space-y-1">
                            {production.bottles.map((pb) => (
                              <li key={pb.id} className="text-gray-600">
                                • {pb.bottle.model}: {pb.quantityUsed} un.
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Produtos Gerados */}
                    {production.outputs.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="font-medium text-gray-700 mb-1">✅ Produtos Adicionados ao Estoque:</p>
                        <ul className="space-y-1 text-sm">
                          {production.outputs.map((output) => (
                            <li key={output.id} className="text-green-700">
                              • {output.product.name}: +{output.quantity} unidades
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {production.notes && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-gray-600">
                          <strong>Obs:</strong> {production.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
