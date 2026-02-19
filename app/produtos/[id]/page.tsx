import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import AddToCartButton from './AddToCartButton'
import Header from '@/components/Header'

export default async function ProdutoDetalhePage({ params }: { params: { id: string } }) {
  const produto = await prisma.product.findUnique({
    where: { id: params.id }
  })

  if (!produto) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Product Details */}
      <div className="container mx-auto px-4 py-16">
        <Link href="/produtos" className="text-blue-600 hover:underline mb-8 inline-block">
          ← Voltar para produtos
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative h-[600px] bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={produto.image}
              alt={produto.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-4xl font-serif">{produto.name}</h1>
                <span className="bg-black text-white px-3 py-1 rounded text-sm">
                  {produto.concentration}
                </span>
              </div>
              <p className="text-gray-600">{produto.size}</p>
            </div>

            <div className="border-t border-b py-6">
              <p className="text-4xl font-bold">R$ {produto.price.toFixed(2)}</p>
              {produto.stock > 0 ? (
                <p className="text-green-600 mt-2">✓ Em estoque ({produto.stock} unidades)</p>
              ) : (
                <p className="text-red-600 mt-2">✗ Fora de estoque</p>
              )}
            </div>

            <div>
              <h2 className="font-bold text-lg mb-2">Descrição</h2>
              <p className="text-gray-700 leading-relaxed">{produto.description}</p>
            </div>

            {produto.notes && (
              <div>
                <h2 className="font-bold text-lg mb-2">Notas Olfativas</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{produto.notes}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {produto.intensity && (
                <div>
                  <p className="text-sm text-gray-600">Intensidade</p>
                  <p className="font-medium">{produto.intensity}</p>
                </div>
              )}
              {produto.durability && (
                <div>
                  <p className="text-sm text-gray-600">Durabilidade</p>
                  <p className="font-medium">{produto.durability}</p>
                </div>
              )}
            </div>

            <AddToCartButton product={produto} />
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
