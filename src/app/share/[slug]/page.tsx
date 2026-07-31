import { SharePageClient, generateTypePage } from "@/components/pages/share-page"

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
