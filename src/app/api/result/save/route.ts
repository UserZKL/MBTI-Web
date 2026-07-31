import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

const saveResultSchema = z.object({
  typeCode: z.string().length(4),
  scores: z.record(z.string(), z.number()),
  answers: z.array(
    z.object({
      questionId: z.number(),
      answer: z.enum(["agree", "disagree"]),
    })
  ),
  isPublic: z.boolean().optional().default(false),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = saveResultSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.issues },
        { status: 400 }
      )
    }

    const session = await auth()
    const userId = session?.user?.id ?? "anonymous"

    const { typeCode, scores, answers, isPublic } = parsed.data
    const db = (await prisma()) as { result: { create: (args: { data: Record<string, unknown> }) => Promise<{ id: string; createdAt: Date }> } }

    const result = await db.result.create({
      data: {
        userId,
        typeCode,
        scores: JSON.parse(JSON.stringify(scores)),
        answers: JSON.parse(JSON.stringify(answers)),
        isPublic,
      },
    })

    return NextResponse.json({ id: result.id, createdAt: result.createdAt }, { status: 201 })
  } catch (error) {
    console.error("Failed to save result:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
