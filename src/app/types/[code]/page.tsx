import { TypeDetailPage } from "@/components/pages/type-detail-page"

export default async function TypeDetailRoute({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  return <TypeDetailPage code={code.toUpperCase()} />
}
