import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

const patchSchema = z.object({
  report: z.string().min(1).max(20000),
})

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const body = await request.json()
    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const db = (await prisma()) as {
      result: {
        findFirst: (args: Record<string, unknown>) => Promise<Record<string, unknown> | null>
        update: (args: Record<string, unknown>) => Promise<Record<string, unknown>>
      }
    }

    const existing = await db.result.findFirst({
      where: { id, userId },
    })

    if (!existing) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 })
    }

    await db.result.update({
      where: { id },
      data: { report: parsed.data.report },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to update result:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
