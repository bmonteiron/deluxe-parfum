import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const alcohols = await prisma.alcohol.findMany()
    return NextResponse.json(alcohols)
  } catch (error) {
    return NextResponse.json([])
  }
}
