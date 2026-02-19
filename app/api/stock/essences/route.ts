import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const essences = await prisma.essence.findMany()
    return NextResponse.json(essences)
  } catch (error) {
    return NextResponse.json([])
  }
}
