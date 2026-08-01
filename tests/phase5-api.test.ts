import { describe, it, expect } from "vitest"
import { z } from "zod"

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

const validBody = {
  typeCode: "INTJ",
  typeData: {
    name: "建筑师",
    nickname: "战略家",
    description: "测试描述",
    traits: {
      keywords: ["战略", "独立"],
      cognitiveFunctions: ["Ni", "Te"],
      communicationStyle: "直接",
      stressResponse: "过度分析",
      learningStyle: "系统性自学",
    },
    strengths: ["规划能力强"],
    weaknesses: ["社交冷漠"],
    careers: ["软件架构师"],
    relationships: {
      romantic: "理性而忠诚",
      friendship: "朋友不多但深厚",
      workplace: "喜欢独立工作",
    },
    growth: ["练习表达"],
  },
  answers: Array.from({ length: 72 }, (_, i) => ({
    questionId: i + 1,
    answer: "agree" as const,
  })),
  percentages: { E: 30, I: 70, S: 45, N: 55, T: 80, F: 20, J: 60, P: 40 },
  confidence: 75,
}

describe("POST /api/report/generate — Zod Validation", () => {
  it("accepts valid body", () => {
    const result = generateReportSchema.safeParse(validBody)
    expect(result.success).toBe(true)
  })

  it("rejects empty body", () => {
    const result = generateReportSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it("rejects short typeCode", () => {
    const body = { ...validBody, typeCode: "INT" }
    const result = generateReportSchema.safeParse(body)
    expect(result.success).toBe(false)
  })

  it("rejects long typeCode", () => {
    const body = { ...validBody, typeCode: "INTJJ" }
    const result = generateReportSchema.safeParse(body)
    expect(result.success).toBe(false)
  })

  it("rejects empty answers array", () => {
    const body = { ...validBody, answers: [] }
    const result = generateReportSchema.safeParse(body)
    expect(result.success).toBe(false)
  })

  it("rejects invalid answer value", () => {
    const body = {
      ...validBody,
      answers: [{ questionId: 1, answer: "maybe" }],
    }
    const result = generateReportSchema.safeParse(body)
    expect(result.success).toBe(false)
  })

  it("rejects missing typeData", () => {
    const rest = Object.fromEntries(
      Object.entries(validBody).filter(([k]) => k !== "typeData")
    )
    const result = generateReportSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  it("rejects missing percentages", () => {
    const rest = Object.fromEntries(
      Object.entries(validBody).filter(([k]) => k !== "percentages")
    )
    const result = generateReportSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  it("rejects confidence out of range", () => {
    const body = { ...validBody, confidence: 150 }
    const result = generateReportSchema.safeParse(body)
    expect(result.success).toBe(false)
  })

  it("rejects negative confidence", () => {
    const body = { ...validBody, confidence: -10 }
    const result = generateReportSchema.safeParse(body)
    expect(result.success).toBe(false)
  })

  it("accepts typeData with minimal traits", () => {
    const body = {
      ...validBody,
      typeData: {
        ...validBody.typeData,
        traits: {},
      },
    }
    const result = generateReportSchema.safeParse(body)
    expect(result.success).toBe(true)
  })
})
