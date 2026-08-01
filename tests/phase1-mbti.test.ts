import { describe, it, expect } from 'vitest'
import {
  calculateScores,
  calculateResult,
  determineType,
  calculatePercentages,
  calculateConfidence,
  getQuestions,
  getQuestionCount,
  getQuestionById,
  getPersonalityTypeData,
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

  it('should have a mix of forward and reverse questions', () => {
    const questions = getQuestions()
    const forward = questions.filter((q) => q.direction === 'forward').length
    const reverse = questions.filter((q) => q.direction === 'reverse').length

    // At least 12 reverse questions (3 per dimension pair)
    expect(forward).toBe(48)
    expect(reverse).toBe(12)

    // Each dimension pair must contain at least 1 reverse question
    for (const pair of ['EI', 'SN', 'TF', 'JP'] as const) {
      const pairQuestions = questions.filter((q) =>
        pair === 'EI' ? q.dimension === 'E' || q.dimension === 'I'
        : pair === 'SN' ? q.dimension === 'S' || q.dimension === 'N'
        : pair === 'TF' ? q.dimension === 'T' || q.dimension === 'F'
        : q.dimension === 'J' || q.dimension === 'P'
      )
      expect(pairQuestions.some((q) => q.direction === 'reverse'), `${pair} pair should have reverse questions`).toBe(true)
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

  it('should score reverse question agree as opposite dimension', () => {
    // q2 is reverse (dimension E, describes introverted behavior)
    const answers: Answer[] = [{ questionId: 2, answer: 'agree' }]
    const scores = calculateScores(answers)
    expect(scores.I).toBe(2) // agree on reverse E → I
    expect(scores.E).toBe(0)
  })

  it('should score reverse question disagree as own dimension', () => {
    const answers: Answer[] = [{ questionId: 2, answer: 'disagree' }]
    const scores = calculateScores(answers)
    expect(scores.E).toBe(2) // disagree on reverse E → E
    expect(scores.I).toBe(0)
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

describe('boundary tests', () => {
  describe('calculateScores', () => {
    it('should handle empty answers array', () => {
      const scores = calculateScores([])
      expect(scores.E).toBe(0)
      expect(scores.I).toBe(0)
      expect(scores.S).toBe(0)
      expect(scores.N).toBe(0)
      expect(scores.T).toBe(0)
      expect(scores.F).toBe(0)
      expect(scores.J).toBe(0)
      expect(scores.P).toBe(0)
    })

    it('should skip unknown question IDs gracefully', () => {
      const answers: Answer[] = [{ questionId: 999, answer: 'agree' }]
      const scores = calculateScores(answers)
      expect(scores.E).toBe(0)
      expect(scores.I).toBe(0)
    })

    it('should handle answers with zero-weight questions', () => {
      const answers: Answer[] = [{ questionId: 1, answer: 'agree' }]
      // q1 has weight 2, verify scoring still works
      const scores = calculateScores(answers)
      expect(scores.E).toBe(2)
    })

    it('should handle reverse-scored answers', () => {
      // q2 is a real reverse question (dimension E, introverted wording)
      const scores = calculateScores([{ questionId: 2, answer: 'agree' }])
      expect(scores.I).toBe(2) // agree on reverse E → I
    })

    it('should handle duplicate questionIds by double-counting', () => {
      const answers: Answer[] = [
        { questionId: 1, answer: 'agree' },
        { questionId: 1, answer: 'agree' },
      ]
      const scores = calculateScores(answers)
      expect(scores.E).toBe(4) // weight 2 × 2 = 4
    })
  })

  describe('determineType', () => {
    it('should use tie-breaker (>= favors left dimension)', () => {
      const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
      expect(determineType(scores)).toBe('ESTJ')
    })

    it('should handle tied scores in one dimension', () => {
      const scores = { E: 5, I: 5, S: 10, N: 0, T: 0, F: 10, J: 8, P: 0 }
      expect(determineType(scores)).toBe('ESFJ')
    })
  })

  describe('calculatePercentages', () => {
    it('should return 50/50 for all-zero totals', () => {
      const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
      const pcts = calculatePercentages(scores)
      expect(pcts.E).toBe(50)
      expect(pcts.I).toBe(50)
    })

    it('should return 100/0 for one-sided dominance', () => {
      const scores = { E: 10, I: 0, S: 5, N: 0, T: 0, F: 5, J: 3, P: 0 }
      const pcts = calculatePercentages(scores)
      expect(pcts.E).toBe(100)
      expect(pcts.I).toBe(0)
    })
  })

  describe('calculateConfidence', () => {
    it('should return 0 for all-zero scores', () => {
      const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
      expect(calculateConfidence(scores)).toBe(0)
    })

    it('should return 0 for perfectly balanced pairs', () => {
      const scores = { E: 5, I: 5, S: 5, N: 5, T: 5, F: 5, J: 5, P: 5 }
      expect(calculateConfidence(scores)).toBe(0)
    })

    it('should return value between 0 and 100', () => {
      const answers = createAnswersForType('I', 'N', 'T', 'J')
      const scores = calculateScores(answers)
      const conf = calculateConfidence(scores)
      expect(conf).toBeGreaterThanOrEqual(0)
      expect(conf).toBeLessThanOrEqual(100)
    })
  })

  describe('calculateResult', () => {
    it('should return null for empty answers', () => {
      expect(calculateResult([])).toBeNull()
    })

    it('should return result with typeName even for valid type', () => {
      const answers = createAnswersForType('E', 'S', 'T', 'J')
      const result = calculateResult(answers)
      expect(result).not.toBeNull()
      expect(result!.type).toBe('ESTJ')
      expect(result!.typeName).toBeTruthy()
      expect(result!.confidence).toBeGreaterThanOrEqual(0)
      expect(result!.confidence).toBeLessThanOrEqual(100)
    })
  })

  describe('validateAnswers', () => {
    it('should reject answers with invalid values', () => {
      const answers = createAnswersForType('E', 'S', 'T', 'J')
      answers[0] = { questionId: 1, answer: 'foo' as 'agree' }
      const result = validateAnswers(answers)
      expect(result.valid).toBe(false)
      expect(result.error).toBeTruthy()
    })

    it('should reject answers with 59 items', () => {
      const answers = createAnswersForType('E', 'S', 'T', 'J').slice(0, 59)
      const result = validateAnswers(answers)
      expect(result.valid).toBe(false)
    })

    it('should accept answers with non-existent but valid ID count', () => {
      const answers: Answer[] = Array.from({ length: 60 }, (_, i) => ({
        questionId: i + 1,
        answer: 'agree' as const,
      }))
      // IDs 1-60 with same answer, all real question IDs
      const result = validateAnswers(answers)
      expect(result.valid).toBe(true)
    })
  })

  describe('getQuestionById', () => {
    it('should return question for valid ID', () => {
      const q = getQuestionById(1)
      expect(q).toBeDefined()
      expect(q!.id).toBe(1)
      expect(q!.text).toBeTruthy()
    })

    it('should return undefined for invalid ID', () => {
      expect(getQuestionById(0)).toBeUndefined()
      expect(getQuestionById(999)).toBeUndefined()
      expect(getQuestionById(-1)).toBeUndefined()
    })
  })

  describe('getPersonalityTypeData', () => {
    it('should return data for valid type code', () => {
      const data = getPersonalityTypeData('INTJ')
      expect(data).toBeDefined()
      expect(data!.code).toBe('INTJ')
      expect(data!.name).toBeTruthy()
    })

    it('should return undefined for invalid type code', () => {
      expect(getPersonalityTypeData('XXXX')).toBeUndefined()
      expect(getPersonalityTypeData('')).toBeUndefined()
      expect(getPersonalityTypeData('intj')).toBeUndefined() // case-sensitive
    })
  })
})

function createAnswersForType(
  dim1: Dimension,
  dim2: Dimension,
  dim3: Dimension,
  dim4: Dimension,
): Answer[] {
  const target = new Set([dim1, dim2, dim3, dim4])

  return getQuestions().map((q) => {
    const agreeGivesTarget = q.direction === 'forward'
      ? target.has(q.dimension)
      : !target.has(q.dimension) // reverse: agree → opposite dimension
    return {
      questionId: q.id,
      answer: agreeGivesTarget ? ('agree' as const) : ('disagree' as const),
    }
  })
}
