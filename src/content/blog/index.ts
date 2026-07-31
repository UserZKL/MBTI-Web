import type { BlogPost } from "./types"
import mbtiGuide from "./mbti-guide"
import extrovertIntrovert from "./extrovert-introvert"
import sensingIntuition from "./sensing-intuition"
import thinkingFeeling from "./thinking-feeling"
import judgingPerceiving from "./judging-perceiving"
import ntAnalysis from "./nt-analysis"
import nfIdealists from "./nf-idealists"
import sjGuardians from "./sj-guardians"
import spExplorers from "./sp-explorers"
import relationshipTypes from "./relationship-types"
import careerGuide from "./career-guide"
import growthTips from "./growth-tips"

const posts: BlogPost[] = [
  mbtiGuide,
  extrovertIntrovert,
  sensingIntuition,
  thinkingFeeling,
  judgingPerceiving,
  ntAnalysis,
  nfIdealists,
  sjGuardians,
  spExplorers,
  relationshipTypes,
  careerGuide,
  growthTips,
]

export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) => (a.date > b.date ? -1 : 1))
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  const current = getPostBySlug(currentSlug)
  if (!current) return []
  return posts
    .filter((p) => p.slug !== currentSlug)
    .sort((a, b) => {
      const aMatch = a.tags.some((t) => current.tags.includes(t)) ? 1 : 0
      const bMatch = b.tags.some((t) => current.tags.includes(t)) ? 1 : 0
      return bMatch - aMatch
    })
    .slice(0, limit)
}
