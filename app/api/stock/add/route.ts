import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session || !(session.user as any).isAdmin) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { type, name, quantity, cost } = body

    let result

    switch (type) {
      case 'essence':
        result = await prisma.essence.create({
          data: { name, quantityMl: parseFloat(quantity), cost: parseFloat(cost) }
        })
        break
      
      case 'alcohol':
        result = await prisma.alcohol.create({
          data: { name, quantityLiters: parseFloat(quantity), cost: parseFloat(cost) }
        })
        break
      
      case 'bottle':
        const size = body.size || '100ml'
        result = await prisma.bottle.create({
          data: { model: name, size, quantity: parseInt(quantity), cost: parseFloat(cost) }
        })
        break
      
      case 'base':
        result = await prisma.baseFragrance.create({
          data: { name, quantity: parseInt(quantity), cost: parseFloat(cost) }
        })
        break
      
      default:
        return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error adding stock:', error)
    return NextResponse.json({ error: 'Erro ao adicionar estoque' }, { status: 500 })
  }
}
