import { auth } from "@/lib/auth"
import { ProfileClient } from "./profile-client"

export default async function ProfileRoute() {
  const session = await auth()

  return (
    <ProfileClient
      user={session?.user ?? null}
    />
  )
}
