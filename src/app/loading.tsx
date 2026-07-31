export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="size-8 animate-pulse rounded-full bg-[var(--color-brand-purple)] opacity-50" />
        <p className="text-sm text-[var(--color-text-tertiary)]">加载中...</p>
      </div>
    </div>
  )
}
