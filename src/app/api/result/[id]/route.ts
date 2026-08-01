import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const db = (await prisma()) as {
      result: {
        findFirst: (args: Record<string, unknown>) => Promise<Record<string, unknown> | null>
      }
    }

    const result = await db.result.findFirst({
      where: { id, userId },
    })

    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Failed to fetch result:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
