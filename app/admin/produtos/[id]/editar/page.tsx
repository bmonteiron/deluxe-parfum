'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function EditarProdutoPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    size: '100ml',
    concentration: 'EDP',
    price: '',
    stock: '0',
    notes: '',
    intensity: 'Moderada',
    durability: '6-8 horas',
    isActive: true,
  })

  useEffect(() => {
    fetchProduct()
  }, [])

  const fetchProduct = async () => {
    try {
      const res = await fetch('/api/products')
      const products = await res.json()
      const product = products.find((p: any) => p.id === params.id)
      
      if (product) {
        setFormData({
          name: product.name,
          description: product.description,
          image: product.image,
          size: product.size,
          concentration: product.concentration,
          price: product.price.toString(),
          stock: product.stock.toString(),
          notes: product.notes || '',
          intensity: product.intensity || 'Moderada',
          durability: product.durability || '6-8 horas',
          isActive: product.isActive,
        })
      }
    } catch (error) {
      alert('Erro ao carregar produto')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        alert('Produto atualizado com sucesso!')
        router.push('/admin/produtos')
      } else {
        alert('Erro ao atualizar produto')
      }
    } catch (error) {
      alert('Erro ao atualizar produto')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return

    try {
      const res = await fetch(`/api/products/${params.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        alert('Produto deletado!')
        router.push('/admin/produtos')
      } else {
        alert('Erro ao deletar produto')
      }
    } catch (error) {
      alert('Erro ao deletar produto')
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white">
        <nav className="container mx-auto px-4 py-6">
          <Link href="/admin" className="text-2xl font-serif font-bold">
            DELUXE <span className="text-gold-400">ADMIN</span>
          </Link>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/admin/produtos" className="text-blue-600 hover:underline">
            ← Voltar para Produtos
          </Link>
        </div>

        <div className="card max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Editar Produto</h1>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              🗑️ Deletar Produto
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Nome *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL da Imagem *</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tamanho *</label>
                <select name="size" value={formData.size} onChange={handleChange} className="input-field">
                  <option value="30ml">30ml</option>
                  <option value="50ml">50ml</option>
                  <option value="100ml">100ml</option>
                  <option value="150ml">150ml</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Concentração *</label>
                <select name="concentration" value={formData.concentration} onChange={handleChange} className="input-field">
                  <option value="EDT">EDT - Eau de Toilette</option>
                  <option value="EDP">EDP - Eau de Parfum</option>
                  <option value="Parfum">Parfum</option>
                  <option value="Cologne">Cologne</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Preço (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Estoque</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Intensidade</label>
                <select name="intensity" value={formData.intensity} onChange={handleChange} className="input-field">
                  <option value="Leve">Leve</option>
                  <option value="Moderada">Moderada</option>
                  <option value="Intensa">Intensa</option>
                  <option value="Muito Intensa">Muito Intensa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Durabilidade</label>
                <select name="durability" value={formData.durability} onChange={handleChange} className="input-field">
                  <option value="2-4 horas">2-4 horas</option>
                  <option value="4-6 horas">4-6 horas</option>
                  <option value="6-8 horas">6-8 horas</option>
                  <option value="8-10 horas">8-10 horas</option>
                  <option value="10-12 horas">10-12 horas</option>
                  <option value="12+ horas">12+ horas</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descrição *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notas Olfativas</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="input-field"
                rows={3}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm font-medium">Produto ativo (visível na loja)</label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
              <Link href="/admin/produtos" className="btn-outline">
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
