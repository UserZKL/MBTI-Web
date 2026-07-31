import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"
import { authConfig } from "./auth.config"
import { lazyPrismaAdapter } from "./prisma-adapter"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.RESEND_FROM ?? "MBTI 人格测试 <onboarding@resend.dev>",
      maxAge: 10 * 60,
      generateVerificationToken: () =>
        String(Math.floor(100000 + Math.random() * 900000)),
      async sendVerificationRequest({ identifier, provider, token }) {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${provider.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: provider.from,
            to: identifier,
            subject: "【MBTI 人格测试】登录验证码",
            text: `你的登录验证码是：${token}，10 分钟内有效。如果不是你本人操作，请忽略此邮件。`,
            html: `
              <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
                <h2 style="color:#7c3aed;margin-bottom:16px">MBTI 人格测试</h2>
                <p style="color:#333">你的登录验证码是：</p>
                <p style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#7c3aed;margin:16px 0">${token}</p>
                <p style="color:#888;font-size:14px">验证码 10 分钟内有效，请勿转发给他人。</p>
              </div>
            `,
          }),
        })
        if (!res.ok) {
          throw new Error("邮件发送失败: " + JSON.stringify(await res.json()))
        }
      },
    }),
  ],
  adapter: lazyPrismaAdapter(),
})
