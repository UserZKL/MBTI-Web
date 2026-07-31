import type { MetadataRoute } from "next"
import { getAllPersonalityTypes } from "@/lib/mbti-utils"

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://mbti-test.example.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const types = getAllPersonalityTypes()
  const typePages: MetadataRoute.Sitemap = types.map((t) => ({
    url: `${BASE}/types/${t.code}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE}/test`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/types`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...typePages,
  ]
}
