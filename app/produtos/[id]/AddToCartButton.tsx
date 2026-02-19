'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  price: number
  image: string
  stock: number
}

export default function AddToCartButton({ product }: { product: Product }) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)

  const addToCart = () => {
    if (product.stock < 1) {
      alert('Produto fora de estoque')
      return
    }

    setAdding(true)

    // Get current cart from localStorage
    const cartStr = localStorage.getItem('cart')
    const cart = cartStr ? JSON.parse(cartStr) : []

    // Check if product already in cart
    const existingIndex = cart.findIndex((item: any) => item.id === product.id)

    if (existingIndex >= 0) {
      // Update quantity
      cart[existingIndex].quantity += quantity
    } else {
      // Add new item
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      })
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart))

    setTimeout(() => {
      setAdding(false)
      alert('Produto adicionado ao carrinho!')
      
      // Ask if wants to go to cart
      if (confirm('Ir para o carrinho?')) {
        router.push('/carrinho')
      }
    }, 300)
  }

  if (product.stock < 1) {
    return (
      <button className="btn-primary w-full opacity-50 cursor-not-allowed" disabled>
        Fora de Estoque
      </button>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label className="font-medium">Quantidade:</label>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            −
          </button>
          <span className="px-4">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={addToCart}
        disabled={adding}
        className="btn-primary w-full disabled:opacity-50"
      >
        {adding ? 'Adicionando...' : '🛒 Adicionar ao Carrinho'}
      </button>
    </div>
  )
}
