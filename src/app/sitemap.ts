import type { MetadataRoute } from "next"
import { getAllPersonalityTypes } from "@/lib/mbti-utils"
import { getAllPosts } from "@/content/blog"

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://mbti-test.example.com"
const LAST_MOD = "2026-08-01"

export default function sitemap(): MetadataRoute.Sitemap {
  const types = getAllPersonalityTypes()
  const typePages: MetadataRoute.Sitemap = types.map((t) => ({
    url: `${BASE}/types/${t.code}`,
    lastModified: LAST_MOD,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  const posts = getAllPosts()
  const blogPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: LAST_MOD,
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [
    {
      url: BASE,
      lastModified: LAST_MOD,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE}/test`,
      lastModified: LAST_MOD,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/types`,
      lastModified: LAST_MOD,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE}/compare`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE}/stats`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE}/blog`,
      lastModified: LAST_MOD,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...typePages,
    ...blogPages,
  ]
}
