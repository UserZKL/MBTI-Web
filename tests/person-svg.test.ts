import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { TYPE_SVG, POSE_ANIM, avatarSrc, poseAnimation } from '@/lib/person-svg'
import { getTypeVisual, type Pose } from '@/lib/types-visual'

const TYPE_CODES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
]

const IDENTITIES: Record<string, string> = {
  INTJ: '架构师',
  INTP: '逻辑学家',
  ENTJ: '指挥官',
  ENTP: '辩论家',
  INFJ: '提倡者',
  INFP: '调停者',
  ENFJ: '主人公',
  ENFP: '活动家',
  ISTJ: '物流师',
  ISFJ: '守护者',
  ESTJ: '管理者',
  ESFJ: '执政官',
  ISTP: '鉴赏家',
  ISFP: '冒险家',
  ESTP: '企业家',
  ESFP: '表演者',
}

const GENDERS: Record<string, 'male' | 'female'> = {
  INTJ: 'male',
  INTP: 'female',
  ENTJ: 'female',
  ENTP: 'male',
  INFJ: 'male',
  INFP: 'female',
  ENFJ: 'male',
  ENFP: 'female',
  ISTJ: 'male',
  ISFJ: 'female',
  ESTJ: 'female',
  ESFJ: 'male',
  ISTP: 'male',
  ISFP: 'female',
  ESTP: 'male',
  ESFP: 'female',
}

const POSES: Pose[] = [
  'stand', 'hold-l', 'hold-r', 'hold-both',
  'point-r', 'point-f', 'wave-r', 'cross',
  'open-hands', 'dance', 'hip',
]

describe('person-svg resource mapping', () => {
  it('maps all 16 types to static svg assets', () => {
    expect(Object.keys(TYPE_SVG)).toHaveLength(16)
    for (const code of TYPE_CODES) {
      expect(TYPE_SVG[code]).toBe(`/personalities/${code}.svg`)
    }
  })

  it.each(TYPE_CODES)('%s has a valid svg asset file', (code) => {
    const file = join(process.cwd(), 'public', 'personalities', `${code}.svg`)
    expect(existsSync(file), `${file} missing`).toBe(true)
    const xml = readFileSync(file, 'utf8')
    expect(xml).toContain('viewBox="0 0 400 400"')
    expect(xml.trim().startsWith('<svg')).toBe(true)
    expect(xml.trim().endsWith('</svg>')).toBe(true)
    expect(xml).not.toContain('undefined')
  })

  it('fallback src for unknown type returns INTJ', () => {
    expect(avatarSrc('UNKNOWN')).toBe('/personalities/INTJ.svg')
    expect(avatarSrc('INTJ')).toBe('/personalities/INTJ.svg')
  })

  it.each(TYPE_CODES)('%s resolves an avatar src', (code) => {
    expect(avatarSrc(code)).toMatch(/^\/personalities\/[A-Z]{4}\.svg$/)
  })
})

describe('person-svg pose animations', () => {
  it('defines an animation for every pose', () => {
    for (const pose of POSES) {
      expect(POSE_ANIM[pose], `pose ${pose}`).toMatch(/^char-[\w-]+/)
    }
  })

  it.each(TYPE_CODES)('%s has a non-empty animation string', (code) => {
    const anim = poseAnimation(code)
    expect(anim).toContain('char-')
    expect(anim).toContain('infinite')
  })

  it('returns empty when animated is disabled', () => {
    expect(poseAnimation('INTJ', false)).toBe('')
  })

  it('falls back to stand animation for unknown type', () => {
    expect(poseAnimation('UNKNOWN')).toBe(POSE_ANIM.stand)
  })

  it('bouncy poses animate the whole avatar', () => {
    expect(poseAnimation('INFP')).toContain('char-bounce')
    expect(poseAnimation('ESFP')).toContain('char-bounce')
    expect(poseAnimation('ENTJ')).toContain('char-sway')
    expect(poseAnimation('INTJ')).toContain('char-float')
  })
})

describe('person-svg visual configuration', () => {
  it.each(TYPE_CODES)('%s has a complete visual config', (code) => {
    const v = getTypeVisual(code)
    expect(v.color).toMatch(/^#[0-9a-f]{6}$/)
    expect(v.secondary).toMatch(/^#[0-9a-f]{6}$/)
    expect(v.hair).toBeTruthy()
    expect(v.eyes).toBeTruthy()
    expect(v.mouth).toBe('none')
    expect(v.pose).toBeTruthy()
    expect(v.gender).toBeTruthy()
    expect(v.outfit).toBeTruthy()
    expect(v.identity).toBeTruthy()
  })

  it.each(TYPE_CODES)('%s matches the expected identity', (code) => {
    expect(getTypeVisual(code).identity).toBe(IDENTITIES[code])
  })

  it.each(TYPE_CODES)('%s matches the expected gender', (code) => {
    expect(getTypeVisual(code).gender).toBe(GENDERS[code])
  })

  it('INFJ is the white-bearded sage', () => {
    const v = getTypeVisual('INFJ')
    expect(v.beard).toBe('long')
    expect(v.hairColor).toBe('#e6e6e6')
    expect(v.outfit).toBe('robe')
  })

  it('ISFJ is the nurse with no prop', () => {
    const v = getTypeVisual('ISFJ')
    expect(v.outfit).toBe('nurse')
    expect(v.prop).toBe('none')
  })

  it('ESTP wears sunglasses and points forward', () => {
    const v = getTypeVisual('ESTP')
    expect(v.glasses).toBe('sunglasses')
    expect(v.pose).toBe('point-f')
    expect(v.prop).toBe('sportbag')
  })

  it('all hairstyles resolve through the visual config', () => {
    const hairStyles = new Set(Object.values(TYPE_SVG).map(() => ''))
    for (const code of TYPE_CODES) {
      hairStyles.add(getTypeVisual(code).hair)
    }
    expect(hairStyles.size).toBeGreaterThan(10)
  })
})
