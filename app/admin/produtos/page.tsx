'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  image: string
  size: string
  concentration: string
  price: number
  stock: number
  isActive: boolean
}

export default function ProdutosAdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string[]>([])
  
  // Filters
  const [filterActive, setFilterActive] = useState('all')
  const [filterStock, setFilterStock] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [products, filterActive, filterStock, searchTerm])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      alert('Erro ao carregar produtos')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Filter by active status
    if (filterActive === 'active') {
      filtered = filtered.filter(p => p.isActive)
    } else if (filterActive === 'inactive') {
      filtered = filtered.filter(p => !p.isActive)
    }

    // Filter by stock
    if (filterStock === 'low') {
      filtered = filtered.filter(p => p.stock > 0 && p.stock <= 10)
    } else if (filterStock === 'out') {
      filtered = filtered.filter(p => p.stock === 0)
    }

    // Search
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }

  const toggleSelect = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    setSelected(selected.length === filteredProducts.length ? [] : filteredProducts.map(p => p.id))
  }

  const handleBulkActivate = async () => {
    if (selected.length === 0) return
    if (!confirm(`Ativar ${selected.length} produto(s)?`)) return

    for (const id of selected) {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...products.find(p => p.id === id), isActive: true })
      })
    }
    
    setSelected([])
    fetchProducts()
  }

  const handleBulkDeactivate = async () => {
    if (selected.length === 0) return
    if (!confirm(`Desativar ${selected.length} produto(s)?`)) return

    for (const id of selected) {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...products.find(p => p.id === id), isActive: false })
      })
    }
    
    setSelected([])
    fetchProducts()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deletar este produto?')) return

    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' })
      fetchProducts()
    } catch (error) {
      alert('Erro ao deletar')
    }
  }

  if (loading) return <div className="p-8">Carregando...</div>

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <Link href="/admin/produtos/novo" className="btn-primary">
          + Novo Produto
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Buscar</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nome do produto..."
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="input-field"
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Estoque</label>
            <select
              value={filterStock}
              onChange={(e) => setFilterStock(e.target.value)}
              className="input-field"
            >
              <option value="all">Todos</option>
              <option value="low">Estoque Baixo (≤10)</option>
              <option value="out">Sem Estoque</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterActive('all')
                setFilterStock('all')
                setSearchTerm('')
              }}
              className="btn-outline w-full"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className="card mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <span className="font-medium">{selected.length} selecionado(s)</span>
            <div className="space-x-2">
              <button onClick={handleBulkActivate} className="btn-outline text-sm">
                Ativar Selecionados
              </button>
              <button onClick={handleBulkDeactivate} className="btn-outline text-sm">
                Desativar Selecionados
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="border-b">
            <tr className="text-left">
              <th className="p-4">
                <input
                  type="checkbox"
                  checked={selected.length === filteredProducts.length && filteredProducts.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="p-4">Imagem</th>
              <th className="p-4">Nome</th>
              <th className="p-4">Concentração</th>
              <th className="p-4">Tamanho</th>
              <th className="p-4">Preço</th>
              <th className="p-4">Estoque</th>
              <th className="p-4">Status</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selected.includes(product.id)}
                    onChange={() => toggleSelect(product.id)}
                  />
                </td>
                <td className="p-4">
                  <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden">
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                  </div>
                </td>
                <td className="p-4 font-medium">{product.name}</td>
                <td className="p-4">
                  <span className="bg-black text-white px-2 py-1 rounded text-xs">
                    {product.concentration}
                  </span>
                </td>
                <td className="p-4">{product.size}</td>
                <td className="p-4">R$ {product.price.toFixed(2)}</td>
                <td className="p-4">
                  <span className={product.stock <= 10 ? 'text-red-600 font-bold' : ''}>
                    {product.stock}
                  </span>
                </td>
                <td className="p-4">
                  {product.isActive ? (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Ativo</span>
                  ) : (
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Inativo</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <Link href={`/admin/produtos/${product.id}/editar`} className="text-blue-600 hover:underline">
                      ✏️
                    </Link>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Nenhum produto encontrado
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Mostrando {filteredProducts.length} de {products.length} produtos
      </div>
    </div>
  )
}
