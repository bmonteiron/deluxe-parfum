'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header() {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    // Load cart count on mount
    updateCartCount()

    // Listen for storage changes (when cart is updated in another tab/page)
    const handleStorageChange = () => {
      updateCartCount()
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Custom event for same-page cart updates
    window.addEventListener('cartUpdated', updateCartCount)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cartUpdated', updateCartCount)
    }
  }, [])

  const updateCartCount = () => {
    const cartStr = localStorage.getItem('cart')
    if (cartStr) {
      const cart = JSON.parse(cartStr)
      const total = cart.reduce((sum: number, item: any) => sum + item.quantity, 0)
      setCartCount(total)
    } else {
      setCartCount(0)
    }
  }

  return (
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
          <Link href="/carrinho" className="hover:text-gold-400 transition relative">
            🛒 Carrinho
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <Link href="/login" className="btn-secondary text-sm">
            Entrar
          </Link>
        </div>
      </nav>
    </header>
  )
}
