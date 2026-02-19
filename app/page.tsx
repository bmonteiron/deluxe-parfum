import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />

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
          {[1, 2, 3].map((i) => (
            <div key={i} className="card group hover:shadow-xl transition">
              <div className="relative h-64 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                <Image
                  src={`https://images.unsplash.com/photo-${1541643600914 + i}?w=800`}
                  alt="Perfume"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <h3 className="text-xl font-serif mb-2">Fragrância Premium</h3>
              <p className="text-gray-600 mb-4">Uma experiência olfativa única</p>
              <Link href="/produtos" className="btn-outline">
                Ver Detalhes
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">&copy; 2026 Deluxe Parfum. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
