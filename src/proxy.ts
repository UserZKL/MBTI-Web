export { auth as proxy } from "@/lib/auth"

export const config = {
  matcher: ["/profile/:path*", "/api/profile/:path*"],
}
