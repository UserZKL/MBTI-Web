import { describe, it, expect } from "vitest"
import { getCacheKey, getCachedReport, setCachedReport, checkRateLimit } from "@/lib/deepseek"

const mockAnswer1 = { questionId: 1, answer: "agree" as const }
const mockAnswer2 = { questionId: 2, answer: "disagree" as const }

describe("DeepSeek Cache", () => {
  it("generates consistent cache key for same answers", () => {
    const key1 = getCacheKey("INTJ", [mockAnswer1, mockAnswer2])
    const key2 = getCacheKey("INTJ", [mockAnswer1, mockAnswer2])
    expect(key1).toBe(key2)
  })

  it("generates different cache key for different typeCode", () => {
    const key1 = getCacheKey("INTJ", [mockAnswer1])
    const key2 = getCacheKey("INTP", [mockAnswer1])
    expect(key1).not.toBe(key2)
  })

  it("generates different cache key for different answers", () => {
    const key1 = getCacheKey("INTJ", [mockAnswer1])
    const key2 = getCacheKey("INTJ", [mockAnswer2])
    expect(key1).not.toBe(key2)
  })

  it("returns null when cache miss", () => {
    const result = getCachedReport("nonexistent-key")
    expect(result).toBeNull()
  })

  it("returns cached report after set", () => {
    setCachedReport("test-key", "test report content")
    const result = getCachedReport("test-key")
    expect(result).toBe("test report content")
  })
})

describe("DeepSeek Rate Limiter", () => {
  it("allows first request", () => {
    expect(checkRateLimit("192.168.1.1")).toBe(true)
  })

  it("allows up to 10 requests from same IP", () => {
    for (let i = 0; i < 10; i++) {
      const allowed = checkRateLimit("192.168.1.2")
      if (i < 10) {
        expect(allowed).toBe(true)
      }
    }
  })

  it("blocks 11th request from same IP", () => {
    for (let i = 0; i < 10; i++) {
      checkRateLimit("192.168.1.3")
    }
    expect(checkRateLimit("192.168.1.3")).toBe(false)
  })

  it("allows requests from different IPs independently", () => {
    for (let i = 0; i < 10; i++) {
      checkRateLimit("192.168.1.4")
    }
    expect(checkRateLimit("192.168.1.4")).toBe(false)
    expect(checkRateLimit("192.168.1.5")).toBe(true)
  })
})
