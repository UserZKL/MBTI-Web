"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"

interface TestNavContextValue {
  backHandler: (() => void) | null
  backLabel: string
  registerBackHandler: (handler: (() => void) | null, label?: string) => void
}

const TestNavContext = createContext<TestNavContextValue>({
  backHandler: null,
  backLabel: "",
  registerBackHandler: () => {},
})

export function TestNavProvider({ children }: { children: ReactNode }) {
  const [backHandler, setBackHandler] = useState<(() => void) | null>(null)
  const [backLabel, setBackLabel] = useState("")

  const registerBackHandler = useCallback((handler: (() => void) | null, label?: string) => {
    setBackHandler(() => handler)
    setBackLabel(label ?? "")
  }, [])

  const value = useMemo(
    () => ({ backHandler, backLabel, registerBackHandler }),
    [backHandler, backLabel, registerBackHandler]
  )

  return <TestNavContext.Provider value={value}>{children}</TestNavContext.Provider>
}

export function useTestNav() {
  return useContext(TestNavContext)
}
