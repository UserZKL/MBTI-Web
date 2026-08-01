/* eslint-disable @typescript-eslint/no-explicit-any */
let clientPromise: Promise<any> | null = null

async function createPrismaClient() {
  const prismaModule: any = await import(/* webpackIgnore: true */ "@prisma/client")
  const adapterModule: any = await import(/* webpackIgnore: true */ "@prisma/adapter-libsql")

  const url = process.env.DATABASE_URL || "file:./dev.db"

  const adapter = new adapterModule.PrismaLibSql({ url })
  return new prismaModule.PrismaClient({ adapter })
}

export function prisma() {
  if (!clientPromise) {
    clientPromise = createPrismaClient()
  }
  return clientPromise
}
