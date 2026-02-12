import Link from 'next/link'

export default function SobrePage() {
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
            <Link href="/sobre" className="text-gold-400">Sobre</Link>
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

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-serif text-center mb-8">Sobre a Deluxe Parfum</h1>
        
        <div className="max-w-3xl mx-auto space-y-6 text-lg leading-relaxed">
          <p>
            A <strong>Deluxe Parfum</strong> nasceu da paixão por fragrâncias exclusivas e da busca 
            incessante pela excelência na arte da perfumaria.
          </p>
          
          <p>
            Cada perfume da nossa coleção é cuidadosamente elaborado com ingredientes selecionados, 
            criando composições únicas que contam histórias e despertam emoções.
          </p>
          
          <p>
            Nossa missão é proporcionar experiências olfativas memoráveis, transformando momentos 
            comuns em lembranças inesquecíveis através do poder das fragrâncias.
          </p>

          <div className="bg-gray-50 p-8 rounded-lg mt-12">
            <h2 className="text-2xl font-serif mb-4">Nossos Valores</h2>
            <ul className="space-y-3">
              <li>✨ <strong>Qualidade Premium:</strong> Apenas os melhores ingredientes</li>
              <li>🎨 <strong>Exclusividade:</strong> Fragrâncias únicas e marcantes</li>
              <li>💎 <strong>Sofisticação:</strong> Elegância em cada detalhe</li>
              <li>🤝 <strong>Confiança:</strong> Transparência e compromisso com você</li>
            </ul>
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
