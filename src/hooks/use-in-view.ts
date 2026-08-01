"use client"

import { useEffect, useRef, useState } from "react"

interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

interface ObserverEntry {
  onIntersect: (entry: IntersectionObserverEntry) => void
}

const observers = new Map<string, IntersectionObserver>()
const entryMap = new Map<Element, Set<ObserverEntry>>()

function getObserver(options: UseInViewOptions): IntersectionObserver {
  const key = `${options.threshold ?? 0.15}|${options.rootMargin ?? "0px 0px -40px 0px"}`
  let observer = observers.get(key)
  if (!observer) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const callbacks = entryMap.get(entry.target)
        if (!callbacks) return
        callbacks.forEach((cb) => cb.onIntersect(entry))
      })
    }, options)
    observers.set(key, observer)
  }
  return observer
}

export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = "0px 0px -40px 0px",
  once = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined") {
      const t = setTimeout(() => setInView(true), 0)
      return () => clearTimeout(t)
    }

    const observer = getObserver({ threshold, rootMargin })
    const entry: ObserverEntry = {
      onIntersect: (entry) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.unobserve(entry.target)
        } else if (!once) {
          setInView(false)
        }
      },
    }

    const set = entryMap.get(el) ?? new Set<ObserverEntry>()
    set.add(entry)
    entryMap.set(el, set)
    observer.observe(el)

    return () => {
      set.delete(entry)
      if (set.size === 0) entryMap.delete(el)
      observer.unobserve(el)
    }
  }, [threshold, rootMargin, once])

  return { ref, inView }
}
