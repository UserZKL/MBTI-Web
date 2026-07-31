/* eslint-disable @typescript-eslint/no-explicit-any */
let clientPromise: Promise<any> | null = null

async function createPrismaClient() {
  const prismaModule: any = await import(/* webpackIgnore: true */ "@prisma/client")
  const adapterModule: any = await import(/* webpackIgnore: true */ "@prisma/adapter-libsql")
  const libsqlModule: any = await import(/* webpackIgnore: true */ "@libsql/client")

  const url = process.env.DATABASE_URL || "file:./dev.db"

  const libsql = libsqlModule.createClient({ url })
  const adapter = new adapterModule.PrismaLibSql(libsql)
  return new prismaModule.PrismaClient({ adapter })
}

export function prisma() {
  if (!clientPromise) {
    clientPromise = createPrismaClient()
  }
  return clientPromise
}
