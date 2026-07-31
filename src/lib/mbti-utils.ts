import questionBank from '@/data/question-bank.json'
import personalityTypes from '@/data/personality-types.json'

export type Dimension = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'

export type DimensionPair = 'EI' | 'SN' | 'TF' | 'JP'

export interface DimensionScores {
  E: number
  I: number
  S: number
  N: number
  T: number
  F: number
  J: number
  P: number
}

export interface Question {
  id: number
  text: string
  dimension: Dimension
  direction: 'forward' | 'reverse'
  weight: number
  category: string
}

export interface Answer {
  questionId: number
  answer: 'agree' | 'disagree'
}

export interface MbtiResult {
  type: string
  typeName: string
  scores: DimensionScores
  percentages: Record<Dimension, number>
  confidence: number
  dimensions: {
    code: DimensionPair
    left: { dimension: Dimension; score: number; percentage: number }
    right: { dimension: Dimension; score: number; percentage: number }
    dominant: Dimension
  }[]
}

interface PersonalityTypeData {
  code: string
  name: string
  nickname: string
  description: string
  traits: Record<string, unknown>
  strengths: string[]
  weaknesses: string[]
  careers: string[]
  relationships: Record<string, string>
  growth: string[]
}

const DIMENSION_PAIRS: [Dimension, Dimension][] = [
  ['E', 'I'],
  ['S', 'N'],
  ['T', 'F'],
  ['J', 'P'],
]

const OPPOSITES: Record<Dimension, Dimension> = {
  E: 'I', I: 'E',
  S: 'N', N: 'S',
  T: 'F', F: 'T',
  J: 'P', P: 'J',
}

function getOpposite(dim: Dimension): Dimension {
  return OPPOSITES[dim]
}

export function getQuestionById(id: number): Question | undefined {
  return (questionBank.questions as Question[]).find((q) => q.id === id)
}

export function getQuestions(): Question[] {
  return questionBank.questions as Question[]
}

export function getQuestionCount(): number {
  return questionBank.totalQuestions
}

export function calculateScores(answers: Answer[]): DimensionScores {
  const scores: DimensionScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }

  for (const a of answers) {
    const q = getQuestionById(a.questionId)
    if (!q) continue

    const score = q.weight || 1
    const isAgree = a.answer === 'agree'

    if (q.direction === 'forward') {
      if (isAgree) {
        scores[q.dimension] += score
      } else {
        scores[getOpposite(q.dimension)] += score
      }
    } else {
      if (isAgree) {
        scores[getOpposite(q.dimension)] += score
      } else {
        scores[q.dimension] += score
      }
    }
  }

  return scores
}

export function determineType(scores: DimensionScores): string {
  const result: string[] = []

  for (const [left, right] of DIMENSION_PAIRS) {
    result.push(scores[left] >= scores[right] ? left : right)
  }

  return result.join('')
}

export function calculatePercentages(scores: DimensionScores): Record<Dimension, number> {
  const percentages = {} as Record<Dimension, number>

  for (const [left, right] of DIMENSION_PAIRS) {
    const total = scores[left] + scores[right]
    if (total > 0) {
      percentages[left] = Math.round((scores[left] / total) * 100)
      percentages[right] = Math.round((scores[right] / total) * 100)
    } else {
      percentages[left] = 50
      percentages[right] = 50
    }
  }

  return percentages
}

export function calculateConfidence(scores: DimensionScores): number {
  const ratios: number[] = []

  for (const [left, right] of DIMENSION_PAIRS) {
    const total = scores[left] + scores[right]
    if (total === 0) {
      ratios.push(0)
    } else {
      ratios.push(Math.abs(scores[left] - scores[right]) / total)
    }
  }

  return Math.round(Math.min(...ratios) * 100)
}

export function getPersonalityTypeData(typeCode: string): PersonalityTypeData | undefined {
  return (personalityTypes as PersonalityTypeData[]).find((t) => t.code === typeCode)
}

export function getAllPersonalityTypes(): PersonalityTypeData[] {
  return personalityTypes as PersonalityTypeData[]
}

export function calculateResult(answers: Answer[]): MbtiResult | null {
  if (answers.length === 0) return null

  const scores = calculateScores(answers)
  const type = determineType(scores)
  const percentages = calculatePercentages(scores)
  const confidence = calculateConfidence(scores)

  const typeData = getPersonalityTypeData(type)
  const typeName = typeData?.name ?? type

  const dimensions = DIMENSION_PAIRS.map(([left, right]) => {
    const pairCode: DimensionPair = `${left}${right}` as DimensionPair
    return {
      code: pairCode,
      left: {
        dimension: left,
        score: scores[left],
        percentage: percentages[left],
      },
      right: {
        dimension: right,
        score: scores[right],
        percentage: percentages[right],
      },
      dominant: scores[left] >= scores[right] ? left : right,
    }
  })

  return {
    type,
    typeName,
    scores,
    percentages,
    confidence,
    dimensions,
  }
}

export function validateAnswers(answers: Answer[]): { valid: boolean; error?: string } {
  if (answers.length !== questionBank.totalQuestions) {
    return { valid: false, error: `需要回答全部 ${questionBank.totalQuestions} 题，当前已回答 ${answers.length} 题` }
  }

  const questionIds = new Set(questionBank.questions.map((q) => q.id))
  const answeredIds = new Set(answers.map((a) => a.questionId))

  for (const id of questionIds) {
    if (!answeredIds.has(id)) {
      return { valid: false, error: `题目 ${id} 未作答` }
    }
  }

  for (const a of answers) {
    if (a.answer !== 'agree' && a.answer !== 'disagree') {
      return { valid: false, error: `题目 ${a.questionId} 的答案无效: ${a.answer}` }
    }
  }

  return { valid: true }
}
