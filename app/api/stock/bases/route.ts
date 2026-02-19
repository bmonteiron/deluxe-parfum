import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const bases = await prisma.baseFragrance.findMany()
    return NextResponse.json(bases)
  } catch (error) {
    return NextResponse.json([])
  }
}
