import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { callDeepSeek, checkRateLimit } from "@/lib/deepseek"

export const dynamic = "force-dynamic"

const generateReportSchema = z.object({
  typeCode: z.string().length(4, "typeCode must be exactly 4 characters"),
  typeData: z.object({
    name: z.string(),
    nickname: z.string(),
    description: z.string(),
    traits: z.object({
      keywords: z.array(z.string()).optional(),
      cognitiveFunctions: z.array(z.string()).optional(),
      communicationStyle: z.string().optional(),
      stressResponse: z.string().optional(),
      learningStyle: z.string().optional(),
    }),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    careers: z.array(z.string()),
    relationships: z.object({
      romantic: z.string(),
      friendship: z.string(),
      workplace: z.string(),
    }),
    growth: z.array(z.string()),
  }),
  answers: z
    .array(
      z.object({
        questionId: z.number(),
        answer: z.enum(["agree", "disagree"]),
      })
    )
    .min(1, "answers must not be empty"),
  percentages: z.record(z.string(), z.number()),
  confidence: z.number().min(0).max(100),
})

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")
    || request.headers.get("x-real-ip")
    || "127.0.0.1"

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": "60" },
      }
    )
  }

  try {
    const body = await request.json()
    const parsed = generateReportSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.issues },
        { status: 400 }
      )
    }

    const result = await callDeepSeek(parsed.data)

    return NextResponse.json(
      {
        report: result.report,
        cached: result.cached,
        usage: result.usage,
      },
      { status: 200 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("Report generation failed:", message)

    if (error instanceof DOMException && error.name === "TimeoutError") {
      return NextResponse.json(
        { error: "AI 服务响应超时，请稍后重试" },
        { status: 504 }
      )
    }

    if (message.includes("API key")) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: "Report generation failed" },
      { status: 500 }
    )
  }
}
