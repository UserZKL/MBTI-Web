/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "./prisma"

let adapterPromise: Promise<any> | null = null

async function getAdapter() {
  if (!adapterPromise) {
    adapterPromise = (async () => {
      const { PrismaAdapter } = await import(
        /* webpackIgnore: true */ "@auth/prisma-adapter"
      )
      const client = await prisma()
      return PrismaAdapter(client)
    })()
  }
  return adapterPromise
}

export function lazyPrismaAdapter() {
  return new Proxy({} as any, {
    get(_, prop) {
      if (prop === "then") return undefined
      return (...args: unknown[]) =>
        getAdapter().then((adapter) => {
          const method = adapter[prop as string]
          if (typeof method !== "function") return undefined
          return method(...args)
        })
    },
  })
}
