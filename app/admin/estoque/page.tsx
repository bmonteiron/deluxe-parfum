import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminEstoquePage() {
  const session = await getServerSession(authOptions)
  
  if (!session || !(session.user as any).isAdmin) {
    redirect('/login')
  }

  const [essences, alcohols, bottles, bases] = await Promise.all([
    prisma.essence.findMany({ orderBy: { name: 'asc' } }),
    prisma.alcohol.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.bottle.findMany({ orderBy: { model: 'asc' } }),
    prisma.baseFragrance.findMany({ orderBy: { name: 'asc' } }),
  ])

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
            <Link href="/admin/estoque" className="block px-4 py-2 rounded bg-black text-white">
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
          <h1 className="text-3xl font-bold mb-8">Estoque de Produção</h1>

          {/* Essências */}
          <div className="card mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">💧 Essências</h2>
              <button className="btn-primary text-sm">+ Adicionar Essência</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Nome</th>
                    <th className="text-left py-3 px-4">Quantidade (mL)</th>
                    <th className="text-left py-3 px-4">Custo/mL</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {essences.map((essence) => (
                    <tr key={essence.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{essence.name}</td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${essence.quantityMl <= 100 ? 'text-red-600' : 'text-green-600'}`}>
                          {essence.quantityMl} mL
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {essence.cost ? `R$ ${essence.cost.toFixed(2)}` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        {essence.quantityMl <= 100 ? (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                            Estoque Baixo
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            OK
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-800 mr-2">✏️</button>
                        <button className="text-green-600 hover:text-green-800">+ Adicionar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Álcool */}
          <div className="card mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">🧪 Álcool</h2>
              <button className="btn-primary text-sm">+ Adicionar Álcool</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Tipo</th>
                    <th className="text-left py-3 px-4">Quantidade (L)</th>
                    <th className="text-left py-3 px-4">Custo/L</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {alcohols.map((alcohol) => (
                    <tr key={alcohol.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{alcohol.name}</td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${alcohol.quantityLiters <= 2 ? 'text-red-600' : 'text-green-600'}`}>
                          {alcohol.quantityLiters} L
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {alcohol.cost ? `R$ ${alcohol.cost.toFixed(2)}` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        {alcohol.quantityLiters <= 2 ? (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                            Estoque Baixo
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            OK
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-800 mr-2">✏️</button>
                        <button className="text-green-600 hover:text-green-800">+ Adicionar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Frascos */}
          <div className="card mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">🫙 Frascos</h2>
              <button className="btn-primary text-sm">+ Adicionar Frasco</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Modelo</th>
                    <th className="text-left py-3 px-4">Tamanho</th>
                    <th className="text-left py-3 px-4">Quantidade</th>
                    <th className="text-left py-3 px-4">Custo Un.</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {bottles.map((bottle) => (
                    <tr key={bottle.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{bottle.model}</td>
                      <td className="py-3 px-4">{bottle.size}</td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${bottle.quantity <= 10 ? 'text-red-600' : 'text-green-600'}`}>
                          {bottle.quantity} un.
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {bottle.cost ? `R$ ${bottle.cost.toFixed(2)}` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        {bottle.quantity <= 10 ? (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                            Estoque Baixo
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            OK
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-800 mr-2">✏️</button>
                        <button className="text-green-600 hover:text-green-800">+ Adicionar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bases Prontas */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">🧴 Bases Prontas (Sem Fracionar)</h2>
              <button className="btn-primary text-sm">+ Adicionar Base</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Nome</th>
                    <th className="text-left py-3 px-4">Quantidade</th>
                    <th className="text-left py-3 px-4">Custo Un.</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {bases.map((base) => (
                    <tr key={base.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{base.name}</td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${base.quantity <= 5 ? 'text-red-600' : 'text-green-600'}`}>
                          {base.quantity} un.
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {base.cost ? `R$ ${base.cost.toFixed(2)}` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        {base.quantity <= 5 ? (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                            Estoque Baixo
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            OK
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-800 mr-2">✏️</button>
                        <button className="text-green-600 hover:text-green-800">+ Adicionar</button>
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
