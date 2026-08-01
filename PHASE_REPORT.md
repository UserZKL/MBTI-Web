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

## V2 用户体验优化报告

基于 USER_FEEDBACK.txt 的 7 条反馈，分 5 个批次完成。

### 批次0 全局基础
- gradient-button.tsx: 默认胶囊化（rounded-full），所有 CTA 按钮圆润
- globals.css: 新增 @keyframes fade-up + .animate-fade-up + animation-delay-100~500 + person-breathe 呼吸动画（含 prefers-reduced-motion 降级）

### 批次1 首页
- hero: h1 放大至 text-5xl~7xl，描述放大至 text-lg~xl，CTA 文案「开始测试 — 免费」→「开始测试」（px-10 py-5 text-lg），徽章 text-sm
- 底部「准备好了吗」文本框 →「探索更多」3 个大卡片块（MBTI 博客/对比类型/统计数据，图标+标题+说明，hover 放大动画）
- 新增 LastResultButton（client）：localStorage 有 mbti-history 时在 hero 区显示「查看上次结果 · 类型名」，点击直达 /result?data=
- 全页 fade-up 级联出场动画

### 批次2 做题页
- 桌面端（lg+）双栏布局 lg:grid-cols-[1fr_320px]：左侧题目+上一题/下一题，右侧 60 题网格 lg:sticky 跟随滚动
- 移动端保持单栏（题目 → 网格），网格桌面端 lg:grid-cols-4

### 批次3 结果页
- 容器 max-w-3xl → max-w-4xl lg:max-w-5xl
- 新建 src/lib/types-visual.ts：16 型视觉配置（主色/次色/发型/眼型/嘴型/眼镜/道具）
- 新建 src/components/shared/person-avatar.tsx：原创 SVG 人形角色（渐变发色/4 发型/2 眼型/3 嘴型/4 道具/呼吸动画），用于结果页头部 + /types/[code] 详情页
- 卡片 p-6 → p-8 sm:p-10，列表 text-xs → text-sm，职业方向+成长建议合并 lg 双栏
- 全页 section 级联 fade-up 出场动画，底部 4 按钮统一胶囊 + 统一 hover

### 批次4 导航与历史
- home-button → 浮动胶囊双按钮：返回上一页（router.back，history>1 时显示）+ 返回首页（左下角）
- 新增 src/lib/local-history.ts：mbti-history localStorage（<=20 条，typeCode/typeName/createdAt/data base64），result-page 挂载时自动写入
- proxy.ts matcher 移除 /profile 保护（仅保留 /api/profile），未登录可访问个人中心
- profile 未登录：显示「本地测试记录」（点击 → /result?data= 回看）+ 登录引导；统计卡改用本地数据
- test-page 顶部加「查看上次结果」入口

### 验证
| Check | Result |
|-------|--------|
| typecheck | ✅ |
| lint | ✅ 0 errors 0 warnings |
| test | ✅ 82/82（5 files） |
| build | ✅ 43 routes（严格 TS）+ Proxy(Middleware) |
| E2E | ✅ 55/55（9 流程，新增 Flow 9: 首页三块导航/浮动按钮/本地历史回看/未登录 profile 本地记录/PersonAvatar） |
---

## V3 UX 优化报告（USER_FEEDBACK2.txt · 7 条反馈）

### 批次0 — 动画基础设施
- 新建 src/hooks/use-in-view.ts：IntersectionObserver 滚动进入视口检测（threshold 0.15、once、SSR 安全）
- 新建 src/components/shared/reveal.tsx：Reveal 组件（up/left/right 方向、0-500ms 延迟、motion-reduce 降级）
- globals.css：新增 3 个 bg-drift 漂移背景动画（28s/34s/40s 循环，紫/青/金光斑）+ .container-page 全局容器类

### 批次1 — 首页（反馈 0/1/2/4/6）
- 四维度 4 块：字体整体大一号（icon size-5、h3 text-base、desc text-sm、p-6）+ 滚动进入时从左往右依次浮出（Reveal left + stagger 120ms）
- 16 人格块：h3 text-base、desc text-sm + 依次浮现（stagger 80ms）
- 动态背景：2 个静态光斑 → 3 个 CSS 漂移光斑（月之暗面风格降级方案）
- 「探索更多」3 框：容器与字号对齐 16 人格块
- footer 删除小字导航行，仅保留版权行

### 批次2 — 全站宽度统一（反馈 3/5）
- 新增 .container-page：桌面端 max-width: min(70vw, 72rem)（约 70% 视口、封顶 1152px），小屏满宽
- 应用：类型详情页（含返回按钮 → 首页 /#types 锚点 + 全字体大一号）、/types 16 人格区块、blog 列表/详情、compare、stats
- 16 人格详情页全部字号大一号（desc text-base、列表 text-sm、chips text-sm、卡片 p-6）

### 批次3 — 验证
| Check | Result |
|-------|--------|
| typecheck | ✅ |
| lint | ✅ 0 errors 0 warnings |
| test | ✅ 82/82（5 files） |
| build | ✅ 43 routes（严格 TS）+ Proxy(Middleware) |
| E2E | ✅ 55/55（playwright 改为 workers=1 串行，消除 dev 并发编译导致的页面 reload 误报） |
| Git | V3 commit |

### 备注
- E2E 在预热 dev server 上运行（Playwright 冷启动 dev server + 并发 worker 会导致 Next.js dev full reload，sessionStorage 残留触发恢复弹窗误报）
---

## V4 UX 优化报告（USER_FEEDBACK3.txt · 3 大块）

### A. 结果页
- **8 轴雷达图**：result-chart.tsx 重写（viewBox 320、正八边形网格、E/T/J/N/I/F/P/S 8 轴、轴端字母标签不再被裁剪，T/F、E/I 完整显示）；修复原 4 轴图 T/F、E/I 标签溢出问题
- **16 型内容全字段扩写**（personality-types.json）：描述 ~200 字（原 89）、优势/成长空间 8 条（原 5）、职业 8 条（带一句话说明）、成长建议 6 条（原 4）、人际关系三段 ~80-100 字（原 30-40）
- **字体放大**：优势/成长空间标题 text-lg、列表 text-base；职业 chips、成长建议、人际关系正文全部 text-base；AI 报告提示 text-base
- **底部 4 按钮统一**：px-8 py-3.5 text-base、图标 size-5、间距 gap-5；「查看所有类型」→ 跳首页 /#types 锚点

### B. 探索更多三页
- blog 列表/详情：去除 date 与 tags（保留 category 胶囊 + 阅读时长）
- 三页左上角统一「返回（上一页）+ 首页」导航（新组件 PageNav），左下角浮动 HomeButton 在 blog/compare/stats 隐藏防重复
- compare 下拉背景加深（bg-white/[0.03] → bg-white/[0.08]）
- compare/stats/type-detail 底部「开始你的测试」CTA 统一放大（px-10 py-5 text-lg）

### C. 做题页重构（6 页 × 10 题）
- 抛弃 60 题网格 + 逐题跳转 → 每页 10 题列表，题卡独立卡片
- 每页 10 题全部作答才能「下一页」；未答完点击时：未答题标红（border-error）+ 琥珀提示条（role=alert）+ 滚动定位第一个未答题
- 已答题卡片自动变为 subtle 弱化样式，答对的按钮显示 success 色
- 「上一题/下一题」→「上一页/下一页」（最后一页按钮为「查看结果」）
- 恢复弹窗兼容旧存档格式

### 验证
| Check | Result |
|-------|--------|
| typecheck | ✅ |
| lint | ✅ 0 errors 0 warnings |
| test | ✅ 82/82（5 files） |
| build | ✅ 43 routes（严格 TS）+ Proxy(Middleware) |
| E2E | ✅ 55/55（Flow 1/6/7 重写：完整答题/未答完拦截/保存+分享） |
| Git | V4 commit |

### 备注
- E2E Flow 1/6 修复 strict mode 断言（每页 10 个 h2 → .first()；Next.js route announcer 的 role=alert 干扰 → .first()）
- dev server 曾意外挂掉（PID 变化），重启后需预热路由避免首次编译超时
---

## V5 优化报告（USER_FEEDBACK4.txt · 3 条反馈）

### ① 撤回题目标红
- 删除做题页未答题标红（redIds 状态、border-error 高亮、文案「未答题已标红」）
- 保留：未答完点「下一页」拦截 + 提示条（role=alert）+ 自动滚动定位第一个未答题

### ② 性能优化（网站卡顿）
- **删除未使用的 Noto Serif SC 字体**（layout.tsx + globals.css --font-display），构建产物减少约 100 个 woff2 分片、主 CSS 272KB 大幅瘦身
- **全站 22 处大尺寸 blur 光斑 → 预模糊 radial-gradient**（14 个文件），消除每帧大区域高斯模糊重采样
- **首页 3 个 bg-drift 动画光斑去 blur** + will-change: transform（28s/34s/40s 无限动画不再触发 GPU 模糊重算）
- **Reveal 组件 IntersectionObserver 单例化**（26 个 observer → 1 个共享）+ 移除永久 will-change-transform 合成层
- **做题页每点一题不再全量序列化写 sessionStorage**（仅翻页时保存）
- **结果页解析 useMemo 化**（atob + JSON.parse + calculateResult 只在 dataParam 变化时执行）
- 效果：E2E 全量耗时 11.1m → 1.2m（约 9 倍提速）

### ③ 结果准确性（反向题 + 边缘维度）
- **题库 12 题改为反向表述**（每维度对 3 题，文本改写为反维度行为描述，direction: reverse），forward 48 + reverse 12，打破全正向答题的惯性偏差
- **算法增强**：dimensions 每项新增 isEdge 标记（dominant 百分比 < 55 判定），结果页展示琥珀色提示「你的 X/Y 维度接近中间值…建议重新测试确认」
- 全符合答题的结果类型由 ISFP → ISTJ（反向题生效验证）

### 验证
| Check | Result |
|-------|--------|
| typecheck | ✅ |
| lint | ✅ 0 errors 0 warnings |
| test | ✅ 84/84（新增 2 个反向计分测试 + 题库断言更新） |
| build | ✅ 43 routes + Proxy(Middleware) |
| E2E | ✅ 55/55（1.2m） |
| Git | V5 commit |

### 备注
- 题库备份：C:\Users\86187\AppData\Local\Temp\opencode\question-bank-backup.json
- createAnswersForType 测试辅助函数已适配反向计分（reverse 题：target 含维度 → disagree）
---

## V6 UX 优化报告（用户反馈 3 条）

### 1. 答题按钮选中态修复
- 根因：两个选项按钮选中样式只判断「该题是否答过」，未区分所选选项 → 无论选哪个，「符合」都变绿
- 修复：按实际所选答案着色 — 选中的按钮 = 品牌蓝实心白字 + 蓝色光晕，未选中 = 无色描边；加 aria-pressed 辅助语义

### 2. 题库扩至 72 题（准确度）
- 新增 12 题（id 61-72，全 forward）：线上群聊/排队闲聊/社交软件/外卖配料/认路地标/读书跳细节/策略游戏数值/纠纷摆事实/送礼在意对方/睡前规划/闹钟富余/整理房间被打断 — 场景与既有 60 题零重复
- 均衡性校验：每维度对 18 题（9:9 左右）、权重差 ≤1、forward 60 + reverse 12、ID 1-72 连续、无重复文本
- **16 型极端可达验证：16/16 全覆盖**；全「符合」与全「不符合」落在不同类型（ISTJ vs ENFP）

### 3. 分布无偏测试（新增 2 个）
- 全 agree ≠ 全 disagree 类型
- 16 种极端答题模式必须达 16 个不同类型
- 单测更新 60→72：题数/ID/每对 18/forward 60/reject 71 条/72 数组

### 4. 分页与 E2E 适配
- 做题页 PAGE_SIZE 10→12（6 页 × 12 题）
- E2E completeTest/Flow 6/localStorage 种值全部适配 72 题

### 验证
| Check | Result |
|-------|--------|
| typecheck | ✅ |
| lint | ✅ 0 errors 0 warnings |
| test | ✅ 86/86（+2 分布无偏） |
| build | ✅ 43 routes（严格 TS）+ Proxy(Middleware) |
| E2E | ✅ 55/55（59s） |
| Git | V6 commit |

---

## V7 报告（USER_FEEDBACK5）

### 需求
1. 结果页底部「分享」按钮改为「保存页面」：点击下载该页完整静态 HTML（含内联样式），格式与「下载图片」一致
2. AI 生成的分析内容持久化：测试 → AI 分析 → 回首页 → 从历史人格页面回看时，直接显示已生成的报告内容，而非「生成 AI 报告」按钮

### 实现
- **src/lib/save-page.ts（新）**：`buildPageHtml()`——clone document.documentElement → head 中 `link[rel=stylesheet]` fetch 内联为 `<style>`（CSS 内 `url()` 相对路径改写为 `window.location.origin` 绝对路径）→ 删除全部 script → 返回完整 `<!DOCTYPE html>`；`downloadPageHtml(html, filename)`——Blob `text/html;charset=utf-8` + a.download 下载
- **result-page.tsx**：「分享结果」GradientLink →「保存页面」GradientButton（gold 胶囊，FileDown 图标，loading「保存中...」，错误提示「页面保存失败，请重试」）；文件名 `mbti-result-${type}-${date}.html`
- **AI 报告持久化**：
  - `local-history.ts`：LocalHistoryItem 加 `report?`；writeLocalHistory 去重时保留旧 report；新增 `updateLocalHistoryReport(data, report)`
  - 结果页挂载时读本地历史，同 data 条目有 report → 直接显示报告（setTimeout 异步，规避 set-state-in-effect lint）
  - 生成报告成功 → 写 localStorage + `PATCH /api/result/[id]` 同步到服务器记录
- **src/app/api/result/[id]/route.ts**：新增 PATCH handler——auth 无 session→401；zod `{report: string 1-20000}`→400；仅本人记录（findFirst id+userId）→404；更新→`{ok:true}`

### E2E Flow 10（+2，共 57）
- 报告回看：addInitScript 种 localStorage（含 report）→ 打开 /result → 断言报告可见 + 「生成 AI 报告」按钮不出现 ✅
- 保存页面：点击 → 下载 → suggestedFilename 含 mbti-result- → 文件内容断言（UTF-8 解码：含类型名「物流师」/「AI 深度分析」/`<style`）✅

### 排障记录
- 下载 HTML 中文断言失败：①读取方式 `new Response(nodeStream).text()` 中文乱码 → 改 `for await` 收集 chunks + Buffer.concat + toString("utf8")；②断言「建筑师」失败——根因：全 agree → ISTJ 的中文名是「物流师」（非「建筑师」，后者是 INTJ），且文件本身严格 UTF-8 无 BOM 正常

### 验证
| 项 | 结果 |
|---|---|
| typecheck | ✅ |
| lint | ✅ 0 errors 0 warnings |
| test | ✅ 86/86 |
| build | ✅ 43 routes（严格 TS）+ Proxy(Middleware) |
| E2E | ✅ 57/57（1.4m） |
| Git | V7 commit |