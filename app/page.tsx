import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
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
            <Link href="/carrinho" className="hover:text-gold-400 transition">
              🛒 Carrinho
            </Link>
            <Link href="/login" className="btn-secondary text-sm">
              Entrar
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Banner */}
      <section className="relative h-[600px] bg-gradient-to-r from-black via-gray-900 to-black flex items-center justify-center text-white">
        <div className="text-center z-10">
          <h1 className="text-6xl font-serif mb-4">
            Essência de <span className="text-gold-400">Luxo</span>
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Descubra fragrâncias exclusivas que definem sua personalidade
          </p>
          <Link href="/produtos" className="btn-secondary">
            Explorar Coleção
          </Link>
        </div>
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </section>

      {/* Lançamentos */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-serif text-center mb-12">
          Lançamentos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Produto de Exemplo */}
          <ProductCard 
            name="Noir Élégance"
            price={299.90}
            image="https://images.unsplash.com/photo-1541643600914-78b084683601?w=400"
            concentration="EDP"
          />
          <ProductCard 
            name="Ambre Royale"
            price={349.90}
            image="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400"
            concentration="Parfum"
          />
          <ProductCard 
            name="Velvet Rose"
            price={279.90}
            image="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400"
            concentration="EDP"
          />
        </div>
      </section>

      {/* Mais Vendidos */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif text-center mb-12">
            Mais Vendidos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <ProductCard 
              name="Oud Mystique"
              price={399.90}
              image="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400"
              concentration="Parfum"
            />
            <ProductCard 
              name="Citrus Fresh"
              price={249.90}
              image="https://images.unsplash.com/photo-1585120040359-4df1cd89c559?w=400"
              concentration="EDT"
            />
            <ProductCard 
              name="Leather & Wood"
              price={329.90}
              image="https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400"
              concentration="EDP"
            />
            <ProductCard 
              name="Ocean Breeze"
              price={269.90}
              image="https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400"
              concentration="EDT"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-serif mb-4 text-gold-400">Deluxe Parfum</h3>
              <p className="text-gray-400">Fragrâncias premium que contam histórias</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/produtos" className="hover:text-gold-400">Produtos</Link></li>
                <li><Link href="/sobre" className="hover:text-gold-400">Sobre</Link></li>
                <li><Link href="/contato" className="hover:text-gold-400">Contato</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Políticas</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/politica-privacidade" className="hover:text-gold-400">Privacidade</Link></li>
                <li><Link href="/termos" className="hover:text-gold-400">Termos de Uso</Link></li>
                <li><Link href="/trocas" className="hover:text-gold-400">Trocas e Devoluções</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📧 contato@deluxeparfum.com</li>
                <li>📱 (11) 99999-9999</li>
                <li>📍 São Paulo, SP</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Deluxe Parfum. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ProductCard({ name, price, image, concentration }: { 
  name: string
  price: number
  image: string
  concentration: string
}) {
  return (
    <div className="card group cursor-pointer hover:shadow-xl transition-shadow">
      <div className="relative h-64 mb-4 overflow-hidden rounded-lg bg-gray-100">
        <Image 
          src={image} 
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-serif text-lg">{name}</h3>
          <span className="text-xs bg-black text-white px-2 py-1 rounded">{concentration}</span>
        </div>
        <p className="text-2xl font-bold">R$ {price.toFixed(2)}</p>
        <button className="btn-primary w-full mt-4">
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  )
}
