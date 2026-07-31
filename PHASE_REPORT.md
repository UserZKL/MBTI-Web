# UX 优化批次报告 — 用户体验改造

**Date:** 2026-07-31  
**Status:** COMPLETE  
**Continue Permission:** YES

## 完成内容

### 1. 全局字号放大
- `globals.css`：Tailwind v4 token 调整 — `text-xs` 12→14px、`text-sm` 14→16px、`text-base` 16→17px（全站生效）
- 硬编码 `text-[10px]`/`text-[11px]` 全部替换为 `text-xs`（10 个文件）

### 2. 做题页重构（test-page.tsx）
- 题框放大：`max-w-2xl` + `p-8 sm:p-14`，题目文字 `text-2xl sm:text-3xl`，答题按钮 `py-8 text-lg`
- 新增「上一题 / 下一题」大按钮（未答可跳过，末题禁用）
- 新增 **60 题网格导航**：未答=描边灰、已答=紫色渐变底、当前题=金色描边；点击跳转，跳回已答题自动截断后续答案
- 顶部显示已答 X/60 计数 + 返回首页图标

### 3. 分享卡片图 + 微信分享（export-card.ts）
- 纯 canvas 零依赖绘制 800×1000 PNG 结果卡片（渐变背景、类型徽章、描述、4 维度条、优势、footer），含 CJK 字体加载等待
- 分享页「分享到微信」→ 生成卡片 → Dialog 预览 → 长按保存/转发（微信内长按图片可分享）
- 结果页「下载 JSON」→ **「下载图片」**（PNG，真实维度数据）

### 4. 全局返回首页按钮（home-button.tsx）
- 固定左下角悬浮 Home 按钮，所有非首页页面自动显示（usePathname 判断）

### 5. 登录改邮箱验证码（Resend）
- `src/lib/auth.config.ts`：Edge-safe 共享配置（Google + callbacks），供 proxy.ts 使用
- `src/lib/auth.ts`：新增 Resend 验证码 provider（6 位码、10 分钟有效、自定义 HTML 邮件，REST API 直调无 nodemailer 依赖）
- `src/lib/prisma-adapter.ts`：lazy PrismaAdapter（Proxy 延迟构造，规避 webpack 原生模块问题）
- `src/proxy.ts`：改用 auth.config（Edge 兼容）
- `login-page.tsx`：两步交互 — 邮箱 → 发送验证码（60s 重发冷却）→ 6 位码登录
- 依赖新增：`@auth/prisma-adapter`
- `.env.example` 新增：`RESEND_API_KEY`、`RESEND_FROM`
- E2E 测试同步更新（Google 按钮 → 邮箱表单）

## 验证

| Check | Result |
|-------|--------|
| typecheck | ✅ |
| lint | ✅ 0 errors 0 warnings |
| test | ✅ 82/82（5 files） |
| build | ✅ 41 routes + Proxy(Middleware) |

## 说明

- Resend 需注册 resend.com 获取 API Key（免费额度 100 封/天），未配置时登录会提示"登录服务未配置完成"
- Google OAuth 保留在配置中（备用），登录页不再展示
