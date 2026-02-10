import './globals.css'
import { Montserrat, Playfair_Display } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata = {
  title: 'Deluxe Parfum - Perfumes Premium',
  description: 'Perfumaria de luxo com fragrâncias exclusivas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${playfair.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
