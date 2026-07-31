import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 100)
    const offset = Math.max(Number(searchParams.get("offset")) || 0, 0)
    const db = (await prisma()) as {
      result: {
        findMany: (args: Record<string, unknown>) => Promise<Array<Record<string, unknown>>>
        count: (args: Record<string, unknown>) => Promise<number>
      }
    }

    const results = await db.result.findMany({
      where: { userId: "anonymous" },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      select: {
        id: true,
        typeCode: true,
        isPublic: true,
        createdAt: true,
      },
    })

    const total = await db.result.count({
      where: { userId: "anonymous" },
    })

    return NextResponse.json({ results, total, limit, offset })
  } catch (error) {
    console.error("Failed to fetch history:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
