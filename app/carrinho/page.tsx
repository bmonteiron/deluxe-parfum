import Link from 'next/link'

export default function CarrinhoPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-black text-white">
        <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-serif font-bold">
            DELUXE <span className="text-gold-400">PARFUM</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/produtos" className="hover:text-gold-400 transition">Produtos</Link>
            <Link href="/sobre" className="hover:text-gold-400 transition">Sobre</Link>
            <Link href="/contato" className="hover:text-gold-400 transition">Contato</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/carrinho" className="text-gold-400">
              🛒 Carrinho
            </Link>
            <Link href="/login" className="btn-secondary text-sm">
              Entrar
            </Link>
          </div>
        </nav>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-serif mb-12">Carrinho de Compras</h1>
        
        <div className="max-w-4xl mx-auto">
          {/* Empty Cart */}
          <div className="card text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-serif mb-4">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-8">
              Adicione produtos incríveis da nossa coleção!
            </p>
            <Link href="/produtos" className="btn-primary inline-block">
              Ver Produtos
            </Link>
          </div>
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
