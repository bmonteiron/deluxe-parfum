import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - List all orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { name: true, email: true }
        },
        items: {
          include: {
            product: {
              select: { name: true, image: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar pedidos' }, { status: 500 })
  }
}

// POST - Create new order
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, customerData, paymentMethod } = body

    // Create or find customer
    let user = await prisma.user.findUnique({
      where: { email: customerData.email }
    })

    if (!user) {
      // Create new customer
      user = await prisma.user.create({
        data: {
          email: customerData.email,
          name: customerData.name,
          phone: customerData.phone,
          password: 'pending', // Temporary password
          isAdmin: false,
        }
      })
    }

    // Calculate total
    const subtotal = items.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    )

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: 'PENDING_PAYMENT',
        paymentMethod: paymentMethod || 'PIX',
        paymentStatus: 'PENDING',
        subtotal,
        total: subtotal,
        notes: customerData.notes || '',
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    // Update product stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.id },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Erro ao criar pedido' }, { status: 500 })
  }
}
