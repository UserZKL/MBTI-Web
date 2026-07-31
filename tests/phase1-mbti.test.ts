import { describe, it, expect } from 'vitest'
import {
  calculateScores,
  calculateResult,
  determineType,
  getQuestions,
  getQuestionCount,
  validateAnswers,
  getAllPersonalityTypes,
  type Dimension,
  type Answer,
} from '@/lib/mbti-utils'

describe('question bank', () => {
  it('should have exactly 60 questions', () => {
    expect(getQuestionCount()).toBe(60)
    expect(getQuestions().length).toBe(60)
  })

  it('should have no duplicate question IDs', () => {
    const ids = getQuestions().map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('should have all question IDs from 1 to 60', () => {
    const ids = getQuestions().map((q) => q.id).sort((a, b) => a - b)
    for (let i = 0; i < 60; i++) {
      expect(ids[i]).toBe(i + 1)
    }
  })

  it('should have balanced dimension counts', () => {
    const counts: Record<string, number> = {}
    for (const q of getQuestions()) {
      counts[q.dimension] = (counts[q.dimension] || 0) + 1
    }

    // Each pair should have ~15 questions
    expect(counts['E'] + counts['I']).toBe(15)
    expect(counts['S'] + counts['N']).toBe(15)
    expect(counts['T'] + counts['F']).toBe(15)
    expect(counts['J'] + counts['P']).toBe(15)
  })

  it('should have all forward direction', () => {
    for (const q of getQuestions()) {
      expect(q.direction).toBe('forward')
    }
  })

  it('should have valid weights (1-3)', () => {
    for (const q of getQuestions()) {
      expect(q.weight).toBeGreaterThanOrEqual(1)
      expect(q.weight).toBeLessThanOrEqual(3)
    }
  })

  it('should have diverse categories per dimension pair (≥3 categories each)', () => {
    const pairCategories: Record<string, Set<string>> = {
      EI: new Set(),
      SN: new Set(),
      TF: new Set(),
      JP: new Set(),
    }

    for (const q of getQuestions()) {
      const pair = ['E', 'I'].includes(q.dimension) ? 'EI'
        : ['S', 'N'].includes(q.dimension) ? 'SN'
        : ['T', 'F'].includes(q.dimension) ? 'TF'
        : 'JP'
      pairCategories[pair].add(q.category)
    }

    for (const [pair, cats] of Object.entries(pairCategories)) {
      expect(cats.size, `${pair} pair should have ≥3 categories`).toBeGreaterThanOrEqual(3)
    }
  })
})

describe('scoring algorithm', () => {
  it('should score forward E question correctly', () => {
    const answers: Answer[] = [{ questionId: 1, answer: 'agree' }]
    const scores = calculateScores(answers)
    expect(scores.E).toBe(2) // weight 2
    expect(scores.I).toBe(0)
  })

  it('should score disagreement on forward E question as I', () => {
    const answers: Answer[] = [{ questionId: 1, answer: 'disagree' }]
    const scores = calculateScores(answers)
    expect(scores.E).toBe(0)
    expect(scores.I).toBe(2)
  })

  it('should score forward I question correctly', () => {
    const answers: Answer[] = [{ questionId: 9, answer: 'agree' }]
    const scores = calculateScores(answers)
    expect(scores.I).toBe(3) // weight 3
    expect(scores.E).toBe(0)
  })
})

describe('type determination', () => {
  it('should determine INTJ from all I+N+T+J answers', () => {
    const answers = createAnswersForType('I', 'N', 'T', 'J')
    const scores = calculateScores(answers)
    expect(determineType(scores)).toBe('INTJ')
  })

  it('should determine ESFP from all E+S+F+P answers', () => {
    const answers = createAnswersForType('E', 'S', 'F', 'P')
    const scores = calculateScores(answers)
    expect(determineType(scores)).toBe('ESFP')
  })

  it('should determine all 16 types correctly', () => {
    const dims: [Dimension, Dimension][] = [
      ['E', 'I'],
      ['S', 'N'],
      ['T', 'F'],
      ['J', 'P'],
    ]

    const allTypes: string[] = []

    for (const d1 of dims[0]) {
      for (const d2 of dims[1]) {
        for (const d3 of dims[2]) {
          for (const d4 of dims[3]) {
            const type = d1 + d2 + d3 + d4
            allTypes.push(type)
          }
        }
      }
    }

    expect(allTypes.length).toBe(16)

    for (const type of allTypes) {
      const [d1, d2, d3, d4] = type.split('') as Dimension[]
      const answers = createAnswersForType(d1, d2, d3, d4)
      const scores = calculateScores(answers)
      expect(determineType(scores)).toBe(type)
    }
  })
})

describe('percentages and confidence', () => {
  it('should calculate balanced percentages correctly', () => {
    const answers = createAnswersForType('E', 'S', 'T', 'J')
    const result = calculateResult(answers)
    expect(result).not.toBeNull()

    if (result) {
      for (const dim of result.dimensions) {
        expect(dim.left.percentage + dim.right.percentage).toBe(100)
      }
    }
  })

  it('should have high confidence for extreme answers', () => {
    const answers = createAnswersForType('E', 'S', 'T', 'J')
    const result = calculateResult(answers)
    expect(result).not.toBeNull()
    if (result) {
      expect(result.confidence).toBe(100)
    }
  })
})

describe('answer validation', () => {
  it('should reject incomplete answers', () => {
    const result = validateAnswers([{ questionId: 1, answer: 'agree' }])
    expect(result.valid).toBe(false)
  })

  it('should accept complete 60 answers', () => {
    const answers = createAnswersForType('E', 'S', 'T', 'J')
    const result = validateAnswers(answers)
    expect(result.valid).toBe(true)
  })
})

describe('personality types data', () => {
  it('should have all 16 types', () => {
    const types = getAllPersonalityTypes()
    expect(types.length).toBe(16)
  })

  const expectedCodes = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP',
  ]

  for (const code of expectedCodes) {
    it(`should have ${code} type data with all fields`, () => {
      const t = getAllPersonalityTypes().find((t) => t.code === code)
      expect(t).toBeDefined()
      expect(t!.name).toBeTruthy()
      expect(t!.description).toBeTruthy()
      expect(t!.strengths.length).toBeGreaterThan(0)
      expect(t!.weaknesses.length).toBeGreaterThan(0)
      expect(t!.careers.length).toBeGreaterThan(0)
      expect(t!.growth.length).toBeGreaterThan(0)
    })
  }

  it('should have no duplicate type codes', () => {
    const types = getAllPersonalityTypes()
    const codes = types.map((t) => t.code)
    expect(new Set(codes).size).toBe(codes.length)
  })
})

function createAnswersForType(
  dim1: Dimension,
  dim2: Dimension,
  dim3: Dimension,
  dim4: Dimension,
): Answer[] {
  const target = new Set([dim1, dim2, dim3, dim4])

  return getQuestions().map((q) => ({
    questionId: q.id,
    answer: target.has(q.dimension) ? 'agree' : ('disagree' as const),
  }))
}
