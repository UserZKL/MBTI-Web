"use client"

export default function Error({
  reset,
}: {
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-[var(--color-surface-2)]">
        <span className="text-2xl">?</span>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-[var(--color-text-primary)]">
        出错了
      </h1>
      <p className="mb-8 max-w-md text-sm text-[var(--color-text-secondary)]">
        页面加载时遇到问题，请重试。
      </p>
      <button
        onClick={reset}
        className="rounded-lg border border-white/8 bg-white/[0.02] px-5 py-2.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:border-white/15 hover:text-white"
      >
        重试
      </button>
    </div>
  )
}
