import { createHash } from "crypto"
import type { Answer } from "./mbti-utils"

interface ReportInput {
  typeCode: string
  typeData: {
    name: string
    nickname: string
    description: string
    traits: {
      keywords?: string[]
      cognitiveFunctions?: string[]
      communicationStyle?: string
      stressResponse?: string
      learningStyle?: string
    }
    strengths: string[]
    weaknesses: string[]
    careers: string[]
    relationships: {
      romantic: string
      friendship: string
      workplace: string
    }
    growth: string[]
  }
  answers: Answer[]
  percentages: Record<string, number>
  confidence: number
}

interface ReportOutput {
  report: string
  cached: boolean
  usage?: {
    promptTokens: number
    completionTokens: number
  }
}

const cache = new Map<string, { data: string; expires: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000

const rateLimitMap = new Map<string, { count: number; reset: number }>()
const RATE_LIMIT_WINDOW = 60_000
const RATE_LIMIT_MAX = 10

function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex")
}

export function getCacheKey(typeCode: string, answers: Answer[]): string {
  const answersHash = sha256(JSON.stringify(answers))
  return `${typeCode}:${answersHash}`
}

export function getCachedReport(key: string): string | null {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expires) {
    cache.delete(key)
    return null
  }
  return entry.data
}

export function setCachedReport(key: string, report: string): void {
  cache.set(key, { data: report, expires: Date.now() + CACHE_TTL })
}

export function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + RATE_LIMIT_WINDOW })
    return true
  }
  if (entry.count >= RATE_LIMIT_MAX) return false
  entry.count++
  return true
}

function buildPrompt(input: ReportInput): string {
  const { typeCode, typeData, answers, percentages, confidence } = input

  const answerSummary = answers
    .map((a) => `${a.questionId}:${a.answer === "agree" ? "✓" : "✗"}`)
    .join(",")

  const dimensionLines = Object.entries(percentages)
    .map(([dim, pct]) => `${dim}: ${pct}%`)
    .join(" · ")

  return `你是一位资深的MBTI人格分析专家，具有心理学背景。请基于以下测试数据，为用户生成一份个性化、有温度的人格分析报告。

【用户测试结果】
- MBTI类型: ${typeCode}（${typeData.name}，${typeData.nickname}）
- 置信度: ${confidence}%
- 维度得分: ${dimensionLines}
- 答题模式: [${answerSummary}]

【该类型的标准画像】
描述: ${typeData.description}
优势: ${typeData.strengths.join("、")}
待成长: ${typeData.weaknesses.join("、")}
适合职业: ${typeData.careers.join("、")}
认知功能: ${(typeData.traits.cognitiveFunctions || []).join("、")}
沟通风格: ${typeData.traits.communicationStyle || "未提供"}
学习风格: ${typeData.traits.learningStyle || "未提供"}
压力应对: ${typeData.traits.stressResponse || "未提供"}
亲密关系: ${typeData.relationships.romantic}
朋友关系: ${typeData.relationships.friendship}
职场关系: ${typeData.relationships.workplace}
成长建议: ${typeData.growth.join("、")}

【输出要求】
请用中文书写，风格温暖、平实、像朋友聊天。包含以下四个部分（每部分用"## "标题）：

## 你的性格画像
根据维度得分和答题模式，描述用户的性格特点。不要照搬标准描述，要结合得分特点做个性化分析。如果某个维度得分接近50%，说明用户在该维度上较为灵活。

## 优势与潜能
基于用户的优势维度，分析ta在生活和工作中的潜力方向。

## 关系中的你
分析用户在亲密关系、朋友关系、职场关系中的表现特点和需要注意的方向。

## 成长之路
给用户3-5条具体、可操作的成长建议，语气积极鼓励。

全文控制在800-1200字。不要使用Markdown代码块包裹输出。`
}

export async function callDeepSeek(input: ReportInput): Promise<ReportOutput> {
  const cacheKey = getCacheKey(input.typeCode, input.answers)
  const cached = getCachedReport(cacheKey)
  if (cached) {
    return { report: cached, cached: true }
  }

  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY not configured")
  }

  const prompt = buildPrompt(input)

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "你是一位温暖、专业的MBTI人格分析专家，擅长将心理学理论转化为平实的生活化建议。",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    }),
    signal: AbortSignal.timeout(60_000),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`DeepSeek API error ${response.status}: ${errorBody}`)
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>
    usage: { prompt_tokens: number; completion_tokens: number }
  }

  const report = data.choices[0]?.message?.content || ""

  setCachedReport(cacheKey, report)

  return {
    report,
    cached: false,
    usage: {
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
    },
  }
}
