import type { Metadata } from "next"
import { SharePageClient, generateTypePage } from "@/components/pages/share-page"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const data = generateTypePage(slug.toUpperCase())
  return {
    title: `${data.typeCode} ${data.typeName} — 分享结果`,
    description: data.description,
    robots: { index: false, follow: false },
  }
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = generateTypePage(slug.toUpperCase())

  return (
    <SharePageClient
      typeCode={data.typeCode}
      typeName={data.typeName}
      description={data.description}
      strengths={data.strengths}
    />
  )
}
