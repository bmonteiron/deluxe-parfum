import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const bottles = await prisma.bottle.findMany()
    return NextResponse.json(bottles)
  } catch (error) {
    return NextResponse.json([])
  }
}
