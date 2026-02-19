import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

export default async function ProdutosPage() {
  const produtos = await prisma.product.findMany({
    where: { 
      isActive: true  // SOMENTE PRODUTOS ATIVOS
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-black text-white">
        <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-serif font-bold">
            DELUXE <span className="text-gold-400">PARFUM</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/produtos" className="text-gold-400">Produtos</Link>
            <Link href="/sobre" className="hover:text-gold-400 transition">Sobre</Link>
            <Link href="/contato" className="hover:text-gold-400 transition">Contato</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/carrinho" className="hover:text-gold-400 transition">
              🛒 Carrinho
            </Link>
            <Link href="/login" className="btn-secondary text-sm">
              Entrar
            </Link>
          </div>
        </nav>
      </header>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-serif text-center mb-12">Nossa Coleção</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {produtos.map((produto) => (
            <Link key={produto.id} href={`/produtos/${produto.id}`}>
              <div className="card group cursor-pointer hover:shadow-xl transition-shadow">
                <div className="relative h-64 mb-4 overflow-hidden rounded-lg bg-gray-100">
                  <Image 
                    src={produto.image} 
                    alt={produto.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif text-lg">{produto.name}</h3>
                    <span className="text-xs bg-black text-white px-2 py-1 rounded">
                      {produto.concentration}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{produto.description}</p>
                  <p className="text-xs text-gray-500">{produto.size}</p>
                  <p className="text-2xl font-bold">R$ {produto.price.toFixed(2)}</p>
                  <div className="btn-primary w-full mt-4 text-center">
                    Ver Detalhes
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">&copy; 2026 Deluxe Parfum. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
