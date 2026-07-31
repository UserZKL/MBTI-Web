import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const db = (await prisma()) as {
      result: {
        count: () => Promise<number>
        groupBy: (args: { by: string[]; _count: { _all: boolean } }) => Promise<Array<{ typeCode: string; _count: { _all: number } }>>
        findMany: (args: { where?: Record<string, unknown>; orderBy?: Record<string, string>; take: number }) => Promise<Array<{
          id: string
          typeCode: string
          scores: Record<string, number>
          createdAt: Date
          isPublic: boolean
        }>>
      }
    }

    const totalCount = await db.result.count()

    const typeDistribution = await db.result.groupBy({
      by: ["typeCode"],
      _count: { _all: true },
    })

    const recentTests = await db.result.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    })

    const dimensionCounts: Record<string, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
    for (const t of recentTests) {
      if (t.typeCode && t.typeCode.length === 4) {
        for (const ch of t.typeCode) {
          dimensionCounts[ch] = (dimensionCounts[ch] || 0) + 1
        }
      }
    }

    const totalLetters = Object.values(dimensionCounts).reduce((a, b) => a + b, 0)
    const dimensionPercentages: Record<string, number> = {}
    if (totalLetters > 0) {
      for (const [key, val] of Object.entries(dimensionCounts)) {
        dimensionPercentages[key] = Math.round((val / totalLetters) * 100)
      }
    }

    return NextResponse.json({
      totalCount,
      typeDistribution: typeDistribution.map((t) => ({
        typeCode: t.typeCode,
        count: t._count._all,
      })),
      dimensionDistribution: {
        EI: {
          E: dimensionPercentages["E"] || 0,
          I: dimensionPercentages["I"] || 0,
        },
        SN: {
          S: dimensionPercentages["S"] || 0,
          N: dimensionPercentages["N"] || 0,
        },
        TF: {
          T: dimensionPercentages["T"] || 0,
          F: dimensionPercentages["F"] || 0,
        },
        JP: {
          J: dimensionPercentages["J"] || 0,
          P: dimensionPercentages["P"] || 0,
        },
      },
      recentTests: recentTests.map((t) => ({
        id: t.id,
        typeCode: t.typeCode,
        createdAt: t.createdAt,
      })),
    })
  } catch (error) {
    console.error("Failed to fetch stats:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
