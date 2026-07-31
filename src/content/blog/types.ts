import type { ReactNode } from "react"

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  category: "basics" | "dimensions" | "types" | "growth" | "relationships"
  readTimeMinutes: number
  tags: string[]
  content: ReactNode
}
