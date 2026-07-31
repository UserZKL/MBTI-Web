import { describe, it, expect } from "vitest"
import { POST } from "@/app/api/result/save/route"
import { NextRequest } from "next/server"

function buildRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/result/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

describe("POST /api/result/save", () => {
  it("rejects empty body", async () => {
    const req = buildRequest({})
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe("Invalid request body")
  })

  it("rejects invalid typeCode (too short)", async () => {
    const req = buildRequest({
      typeCode: "IN",
      scores: { E: 10, I: 0, S: 5, N: 10, T: 8, F: 2, J: 7, P: 3 },
      answers: Array.from({ length: 60 }, (_, i) => ({
        questionId: i + 1,
        answer: "agree" as const,
      })),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it("rejects missing answers", async () => {
    const req = buildRequest({
      typeCode: "INTJ",
      scores: { E: 10, I: 0, S: 5, N: 10, T: 8, F: 2, J: 7, P: 3 },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it("rejects invalid answer value", async () => {
    const req = buildRequest({
      typeCode: "INTJ",
      scores: { E: 10, I: 0, S: 5, N: 10, T: 8, F: 2, J: 7, P: 3 },
      answers: [{ questionId: 1, answer: "maybe" }],
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
