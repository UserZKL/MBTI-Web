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

---

# V1.1 质量审计与修复报告

**Date:** 2026-08-01
**Status:** COMPLETE
**Continue Permission:** YES

## 背景

基于 23 项质量问题清单（H1-H4 高危 / M1-M11 中危 / L1-L11 低危），分 4 个批次修复并补充 E2E 覆盖。过程中额外定位并修复 4 个此前未被发现的严重 bug。

## 批次0：环境清理（commit 5cfaf35）

- 真实 RESEND_API_KEY 从 .env.example 移入 .env（.env.example 清空，防泄露；此前真实 key 已在模板文件且 .env 缺失导致登录不可用）
- 删除全部 Google OAuth 残留（.env 变量 + auth.config.ts provider）
- 生成真实 AUTH_SECRET；DATABASE_URL 示例改为 SQLite 格式

## 批次1：核心功能修复（7 项）

- **H1** AI 报告 400：result-page 补传 nickname + traits 字段（zod 必填）
- **H2** 匿名保存外键失败：save 接口自动 upsert id="anonymous" 的 User 记录
- **H3** 未答完 60 题可提交：最后一题提交前校验全部作答，未答完弹提示并跳转最近未答题（incompleteNotice 琥珀提示条）
- **M6** 网格跳转误删答案：改按 questionId 过滤（不再按下标 slice 截断）
- **M7** 60 题网格 320px 触控过小：grid-cols-5 sm:grid-cols-10
- **M11** 验证码错误无提示：login-page 读 ?error=Verification 渲染中文错误
- **M3** 保存失败无 UI：saveState==="error" 显示红色提示 + 登录引导

## 批次2：健壮性与安全（commit e3e2d54，6 项）

- **M1** save 接口：16 类型白名单 + validateAnswers 60 题校验 + IP 限流 30 次/分
- **M2** history 路由：无 session 返回 401（不再回退 anonymous）
- **M10** DeepSeek fetch 60s 超时 + 504 中文提示
- **M9** next.config.ts 恢复严格 TS 构建（删除 ignoreBuildErrors）
- **M4** stats 维度占比从全量 typeDistribution 聚合（原只统计 10 条 isPublic 恒为空）
- **M5** 新增 GET /api/result/[id] 详情 API + profile 历史条目可点击 + 详情 Dialog（维度得分 + AI 报告）

## 批次3：清理与细节（8 项）

- **L1** types/[code] 与 share/[slug] 无效码 notFound() 404
- **L2** 删除 4 个死组件（card/separator/avatar/badge）+ 卸载 html2canvas
- **L3** 删除 Prisma 未使用的 Question/PersonalityType 模型 + 迁移
- **L4** dialog 关闭按钮中文化
- **L5** 新建 /terms /privacy 页面 + 登录页条款链接
- **L6** 「分享到微信」→「生成分享卡片」
- **L7** sitemap 补 /compare /stats + 固定 lastModified
- **L8/L11** ⚠ 字符换图标、--font-body 引用修复、landing 省略号修复、test 页重复按钮删除

## 新发现并修复的 4 个严重 bug（本批次核心收获）

1. **auth MissingAdapterMethods（登录链路损坏）**：lazyPrismaAdapter Proxy 缺 has trap，@auth/core 方法存在性检查 m in adapter 恒为 false → 验证码登录实际不可用。修复：Proxy 加 has() { return true }。
2. **404 返回 200（Next.js 已知 bug #93253）**：根 loading.tsx 存在时 notFound() 在 streaming 下吞掉 404 状态码。修复：删除根 loading.tsx（dev + production 均验证 404 生效）。
3. **结果保存从未工作（Prisma adapter 构造签名错误）**：
ew PrismaLibSql(client实例) 传错参数，正确签名是 
ew PrismaLibSql({ url })（adapter 内部自建 client）→ 所有保存请求 500（URL_INVALID）。修复 1 行，实测 save 201 ✅。此前所有"保存成功"均为假象，属本批最大发现。
4. **/login 构建失败**：M11 引入 useSearchParams 后未包 Suspense → build 报 prerender 错误。修复：login/page.tsx 包 Suspense。

## E2E 测试补充（tests/e2e/app.spec.ts，44 → 50 个）

- Flow 6：未答完提交拦截（答 1 题跳 60 题提交 → 仍停留 /test + 提示）
- Flow 7：完整答题 → 自动保存「已保存」→ AI 报告按钮；分享卡片 Dialog 生成
- Flow 8：/terms /privacy 渲染；/types/XXXX 与 /share/INVALID 期望 404
- 测试稳定性修复：按钮 exact:true（「符合」与「不符合」子串冲突）、force 点击绕过 hover 动画、题面 h2 变化等待（防止点击过渡动画中的旧题按钮）

## 验证

| Check | Result |
|-------|--------|
| typecheck | ✅ |
| lint | ✅ 0 errors 0 warnings |
| test | ✅ 82/82（5 files） |
| build | ✅ 41+ routes（严格 TS）+ Proxy(Middleware) |
| E2E | ✅ 50/50（8 流程 50 场景） |

## 遗留说明

- 此前报告中「邮箱验证码登录可用」的结论不准确：实际因 adapter 缺失方法而 500，本批次已修复（/api/auth/session 200 + providers 正常）
- npm audit 12 项高危仍为构建期传递依赖，无法无破坏修复，按既定策略跟踪不阻塞
- 部署时需在 Vercel 配置：DATABASE_URL / AUTH_SECRET / RESEND_API_KEY / RESEND_FROM / NEXT_PUBLIC_APP_URL
