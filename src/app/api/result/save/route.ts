import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getAllPersonalityTypes, validateAnswers } from "@/lib/mbti-utils"

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
  report: z.string().optional(),
})

const VALID_TYPE_CODES = new Set(getAllPersonalityTypes().map((t) => t.code))

const saveRateLimitMap = new Map<string, { count: number; reset: number }>()
const SAVE_RATE_LIMIT_WINDOW = 60_000
const SAVE_RATE_LIMIT_MAX = 30

function checkSaveRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = saveRateLimitMap.get(ip)
  if (!entry || now > entry.reset) {
    saveRateLimitMap.set(ip, { count: 1, reset: now + SAVE_RATE_LIMIT_WINDOW })
    return true
  }
  if (entry.count >= SAVE_RATE_LIMIT_MAX) return false
  entry.count++
  return true
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown"
  return request.headers.get("x-real-ip") ?? "unknown"
}

export async function POST(request: NextRequest) {
  try {
    if (!checkSaveRateLimit(getClientIp(request))) {
      return NextResponse.json({ error: "请求过于频繁，请稍后再试" }, { status: 429 })
    }

    const body = await request.json()
    const parsed = saveResultSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { typeCode, scores, answers, isPublic, report } = parsed.data

    if (!VALID_TYPE_CODES.has(typeCode)) {
      return NextResponse.json({ error: "无效的人格类型代码" }, { status: 400 })
    }

    const validation = validateAnswers(answers)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error ?? "答题数据不完整" },
        { status: 400 }
      )
    }

    const session = await auth()
    let userId = session?.user?.id

    const db = (await prisma()) as {
      user: {
        upsert: (args: {
          where: { id: string }
          update: Record<string, never>
          create: { id: string }
        }) => Promise<{ id: string }>
      }
      result: { create: (args: { data: Record<string, unknown> }) => Promise<{ id: string; createdAt: Date }> }
    }

    if (!userId) {
      const anon = await db.user.upsert({
        where: { id: "anonymous" },
        update: {},
        create: { id: "anonymous" },
      })
      userId = anon.id
    }

    const data: Record<string, unknown> = {
      userId,
      typeCode,
      scores: JSON.parse(JSON.stringify(scores)),
      answers: JSON.parse(JSON.stringify(answers)),
      isPublic,
    }
    if (report) {
      data.report = report
    }

    const result = await db.result.create({ data })

    return NextResponse.json({ id: result.id, createdAt: result.createdAt }, { status: 201 })
  } catch (error) {
    console.error("Failed to save result:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
