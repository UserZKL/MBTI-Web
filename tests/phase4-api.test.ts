import { describe, it, expect } from "vitest"
import { z } from "zod"

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

describe("POST /api/result/save — Zod schema validation", () => {
  it("rejects empty body", () => {
    const result = saveResultSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it("rejects invalid typeCode (too short)", () => {
    const result = saveResultSchema.safeParse({
      typeCode: "IN",
      scores: { E: 10, I: 0, S: 5, N: 10, T: 8, F: 2, J: 7, P: 3 },
      answers: Array.from({ length: 72 }, (_, i) => ({
        questionId: i + 1,
        answer: "agree" as const,
      })),
    })
    expect(result.success).toBe(false)
  })

  it("rejects missing answers", () => {
    const result = saveResultSchema.safeParse({
      typeCode: "INTJ",
      scores: { E: 10, I: 0, S: 5, N: 10, T: 8, F: 2, J: 7, P: 3 },
    })
    expect(result.success).toBe(false)
  })

  it("rejects invalid answer value", () => {
    const result = saveResultSchema.safeParse({
      typeCode: "INTJ",
      scores: { E: 10, I: 0, S: 5, N: 10, T: 8, F: 2, J: 7, P: 3 },
      answers: [{ questionId: 1, answer: "maybe" }],
    })
    expect(result.success).toBe(false)
  })

  it("accepts valid data", () => {
    const result = saveResultSchema.safeParse({
      typeCode: "INTJ",
      scores: { E: 10, I: 0, S: 5, N: 10, T: 8, F: 2, J: 7, P: 3 },
      answers: Array.from({ length: 72 }, (_, i) => ({
        questionId: i + 1,
        answer: "agree" as const,
      })),
    })
    expect(result.success).toBe(true)
  })
})
