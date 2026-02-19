import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || !(session.user as any).isAdmin) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-black text-white">
        <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/admin" className="text-2xl font-serif font-bold">
            DELUXE <span className="text-gold-400">ADMIN</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/" target="_blank" className="text-sm hover:text-gold-400">
              Ver Site
            </Link>
            <span className="text-sm text-gray-400">{session.user?.email}</span>
          </div>
        </nav>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white min-h-screen shadow-lg">
          <nav className="p-4 space-y-2">
            <Link
              href="/admin"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              <span>📊</span>
              <span>Dashboard</span>
            </Link>
            
            <Link
              href="/admin/produtos"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              <span>🛍️</span>
              <span>Produtos</span>
            </Link>
            
            <Link
              href="/admin/pedidos"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              <span>📦</span>
              <span>Pedidos</span>
            </Link>
            
            <Link
              href="/admin/clientes"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              <span>👥</span>
              <span>Clientes</span>
            </Link>
            
            <Link
              href="/admin/estoque"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              <span>📦</span>
              <span>Estoque de Produção</span>
            </Link>
            
            <Link
              href="/admin/producao"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              <span>🏭</span>
              <span>Produção</span>
            </Link>
            
            <Link
              href="/admin/financeiro"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              <span>💰</span>
              <span>Financeiro</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
