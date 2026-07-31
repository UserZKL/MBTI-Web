import { SharePageClient } from "@/components/pages/share-page"
import { getPersonalityTypeData, getAllPersonalityTypes } from "@/lib/mbti-utils"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const code = slug.toUpperCase()
  const t = getAllPersonalityTypes().find((x) => x.code === code)
  return {
    title: `${t?.name ?? code} — MBTI 人格测试`,
    description: t?.description ?? "MBTI 人格类型分享",
    robots: { index: false, follow: false },
  }
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const code = slug.toUpperCase()
  const typeData = getPersonalityTypeData(code)
  const t = getAllPersonalityTypes().find((x) => x.code === code)

  return (
    <SharePageClient
      typeCode={code}
      typeName={t?.name ?? code}
      description={typeData?.description ?? "MBTI 人格类型"}
      strengths={typeData?.strengths ?? []}
    />
  )
}
