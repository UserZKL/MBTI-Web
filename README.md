# MBTI-Web — 在线人格测试网站

一个开源免费的 MBTI 人格测试网站：72 道生活化题目，测出 16 种人格类型之一，并提供详细的类型解读、AI 深度分析报告、类型对比与全站统计。全中文界面，移动端优先，暗色玻璃拟态设计。

![技术栈](https://img.shields.io/badge/Next.js-16-black) ![License](https://img.shields.io/badge/License-MIT-green)

## 功能特性

- **72 题人格测试** — 6 页 × 12 题分页作答，题目覆盖生活场景，含反向计分题避免惯性作答；每页全部作答后才能进入下一页
- **16 种人格类型** — 每种类型配有完整解读：描述、认知功能、优势、待成长、职业方向、人际关系、成长建议
- **结果可视化** — 8 轴雷达图 + 4 维度百分比柱条，边缘维度自动提示
- **AI 深度分析报告** — 基于测试结果调用 DeepSeek 生成个性化报告（需自行配置 API Key，见下文）
- **分享卡片** — 一键生成人格卡片图片（纯前端 Canvas 绘制，可长按保存分享）
- **邮箱验证码登录** — Resend 发送 6 位验证码，登录后云端保存测试历史
- **匿名历史** — 不登录也能在本地保存测试记录（localStorage，最多 20 条），随时回看
- **类型对比 / 全站统计** — 任意两种人格并排对比；测试分布、维度占比统计
- **MBTI 知识博客** — 12 篇中文深度文章

## 技术栈与实现方式

| 层 | 技术 | 说明 |
|---|---|---|
| 框架 | Next.js 16（App Router）+ React 19 + TypeScript | 全站服务端渲染（SSR/SSG），动态路由 + generateStaticParams 预生成 16 型详情页与博客页 |
| 样式 | Tailwind CSS 4 + 自定义设计系统 | 暗色玻璃拟态，全局 CSS 变量（--color-brand-*、--gradient-*），滚动浮现动画（IntersectionObserver 单例） |
| 数据库 | Prisma 7 + SQLite（libsql adapter） | 本地开发零配置；存储用户、会话与测试结果（`prisma/migrations/` 已含建表迁移） |
| 认证 | NextAuth v5 + Resend | 邮箱 6 位验证码登录（magic-link 机制改造），JWT 会话，`src/proxy.ts` 保护个人中心 API |
| AI 报告 | DeepSeek API（服务端调用） | `POST /api/report/generate` 在服务器端请求 DeepSeek，结果缓存 24 小时、IP 限流 10 次/分 |
| 校验 | Zod 4 | 所有 API 入参服务端校验 |
| 测试 | Vitest 86 项单测 + Playwright 55 项 E2E | 覆盖评分算法、API、AI 缓存限流、完整用户流程 |

**核心算法**（`src/lib/mbti-utils.ts`）：72 题按 E/I、S/N、T/F、J/P 四维度加权计分（权重 1-3），支持反向题计分；百分比 = 维度对得分占比；置信度 = 四维度最小支配比；边缘维度（占比 < 55%）在结果页提示。

## 环境准备

- **Node.js 20 或更高版本**（推荐 LTS，开发时使用 24.x 验证）
- **Git**
- **npm**（随 Node.js 安装）

Windows 用户注意：本项目的构建脚本使用 `--webpack` 标志（Turbopack 的原生绑定在部分 Windows 环境下不可用），命令已内置在 `package.json` 中，无需手动处理。

## 从 GitHub 拉取并运行（完整流程）

按顺序执行下面的每一步即可在本地把网站跑起来。

### 方式一：手动执行

以下为传统的手动操作流程，适合希望逐步了解项目结构的情况。

#### 第 1 步：下载代码

打开终端（macOS/Linux 用 Terminal，Windows 用 PowerShell 或 CMD），执行：

```bash
git clone https://github.com/UserZKL/MBTI-Web.git
```

这会在当前目录创建一个 `MBTI-Web` 文件夹，里面就是全部源码。

### 第 2 步：进入项目目录

```bash
cd MBTI-Web
```

### 第 3 步：安装依赖

```bash
npm install
```

这一步会下载项目需要的所有第三方库，可能需要几分钟。安装完成时若自动执行了 `prisma generate`（生成数据库客户端），属于正常现象。看到类似 `added xxx packages` 的输出即为成功。

### 第 4 步：创建环境变量文件

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# macOS / Linux
cp .env.example .env
```

`.env` 是本地配置文件的入口，里面每一项都有中文注释。**当前阶段只有 `AUTH_SECRET` 是必需的**，其余都可以先留空：

- `DATABASE_URL`：默认 `file:./dev.db`（SQLite 文件），无需修改
- `AUTH_SECRET`：会话加密密钥。执行下面命令生成一个随机值填进去：
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```
- `RESEND_API_KEY` / `DEEPSEEK_API_KEY`：可后补（见下文对应章节）

### 第 5 步：初始化数据库

```bash
npm run db:migrate
```

这会创建本地 SQLite 数据库文件（`dev.db`）并建立全部数据表。看到 `Generated migration` 或 `Database now in sync` 即为成功。

### 第 6 步：启动开发服务器

```bash
npm run dev
```

看到 `✓ Ready in xxx ms` 后，用浏览器打开 **http://localhost:3000** 即可开始测试。

> 端口被占用时：先停止占用 3000 端口的程序，或修改启动命令端口（临时验证可执行 `npm run dev -- -p 3001`）。

### 第 7 步（可选）：跑一遍测试确认环境正常

```bash
npm run typecheck   # 类型检查
npm test            # 单元测试（86 项）
npm run build       # 生产构建
```

### 方式二：使用 AI Agent 一键运行（Claude Code / Codex / OpenCode）

如果你安装了任一 AI 编程助手 CLI，可以让它替你完成「下载 → 装依赖 → 配环境 → 启动」的整个流程。AI 会读取本 README 中的手动步骤并逐条执行，效果与手动操作一致。

前提：本机已安装对应 CLI 工具，且已登录账号（未安装时先执行下面的安装命令，任意一种即可）。

#### 使用 Claude Code

```bash
# 安装（如未安装）：npm install -g @anthropic-ai/claude-code
git clone https://github.com/UserZKL/MBTI-Web.git
cd MBTI-Web
claude
```

在 Claude Code 对话中输入：

> 请阅读项目 README 中「从 GitHub 拉取并运行」章节，按步骤完成初始化并启动：安装依赖（npm install）、复制 .env.example 为 .env 并生成随机 AUTH_SECRET、执行数据库迁移（npm run db:migrate），最后启动开发服务器（npm run dev）。

#### 使用 Codex CLI

```bash
# 安装（如未安装）：npm install -g @openai/codex
git clone https://github.com/UserZKL/MBTI-Web.git
cd MBTI-Web
codex
```

在 Codex 对话中输入：

> 按 README 的「从 GitHub 拉取并运行」章节初始化项目：npm install、生成 .env（AUTH_SECRET 用随机值）、npm run db:migrate、npm run dev，然后告诉我访问地址。

#### 使用 OpenCode CLI

```bash
# 安装（如未安装）：npm install -g opencode-ai
git clone https://github.com/UserZKL/MBTI-Web.git
cd MBTI-Web
opencode
```

在 OpenCode 对话中输入：

> 请初始化并运行此项目：依据 README 手动流程依次执行 npm install、创建 .env 并生成随机 AUTH_SECRET、npm run db:migrate、npm run dev。

#### 注意事项

- **端口与终端**：启动成功后终端会停留在运行状态，属正常现象；保持终端开启，浏览器访问 http://localhost:3000 即可
- **API Key 后补**：`DEEPSEEK_API_KEY`、`RESEND_API_KEY` 可稍后手动填入 `.env` 并重启服务器（见下文对应章节）
- **AI 无法联网时**：若 AI 工具无法访问 GitHub，请先手动执行 `git clone` 再进入目录启动 CLI
- **安全**：`.env` 在 `.gitignore` 中，AI 修改它不会影响仓库内容

## 配置「AI 深度分析」报告（DeepSeek API Key）

结果页的 **生成 AI 报告** 按钮会调用 DeepSeek 大模型，根据你的测试数据生成个性化深度报告。要让这个功能可用，需要完成以下配置：

### 1. 注册 DeepSeek 开放平台

打开 https://platform.deepseek.com ，注册账号并登录。新账户通常自带少量免费额度，足够体验；若提示余额不足，在「充值」页面按需充值（一次几分钱即可跑几十次报告）。

### 2. 创建 API Key

进入「API Keys」页面 → 点击「创建 API Key」→ 随意填写名称（如 `mbti-web`）→ 复制生成的密钥。密钥形如 `sk-` 开头的一长串字符，**只显示这一次，请立即保存**。

### 3. 把 Key 写入 .env

用任意文本编辑器打开项目根目录的 `.env` 文件（就是第 4 步复制的那个文件），找到这一行：

```
DEEPSEEK_API_KEY=""
```

把引号里的内容替换为你的密钥：

```
DEEPSEEK_API_KEY="sk-你的密钥粘贴到这里"
```

保存文件。**不要把密钥提交到 GitHub** —— `.env` 已在 `.gitignore` 中，不会被提交。

### 4. 重启开发服务器

在运行 `npm run dev` 的终端里按 `Ctrl + C` 停止，然后重新执行：

```bash
npm run dev
```

（环境变量只在启动时读取，改完 `.env` 必须重启才生效。）

### 5. 验证

打开 http://localhost:3000 ，完成一次 72 题测试 → 在结果页点击 **生成 AI 报告** → 等待约 10-20 秒，即可看到生成的深度报告（包含整体分析、性格优势、潜在盲区、成长方向等章节）。

**没有配置 Key 时的表现**：点击按钮会提示「AI 服务未配置」或「报告生成失败」。检查 `.env` 中 `DEEPSEEK_API_KEY` 是否填写正确、是否重启了服务器即可。

**关于安全**：API Key 只存在于服务器端，浏览器和前端代码永远拿不到它。你的 Key 不会因网站公开而泄露。

## 配置邮箱验证码登录（Resend，可选）

登录功能使用 Resend 发送验证码邮件。不配置则登录按钮不可用，测试与匿名历史不受影响。

1. 打开 https://resend.com 注册账号
2. 进入「API Keys」创建 Key（形如 `re_` 开头），填入 `.env` 的 `RESEND_API_KEY`
3. 默认发件人 `onboarding@resend.dev` 可直接使用；绑定自有域名后可在 `RESEND_FROM` 填你的地址
4. 重启 `npm run dev`，登录页输入邮箱 → 收到 6 位验证码 → 完成登录

## 项目结构

```
MBTI-Web/
├── src/
│   ├── app/            # 路由（页面 + API 路由）
│   │   ├── api/        # result/save、report/generate、stats、profile/history 等
│   │   ├── blog/       # 博客列表与详情（12 篇，SSG）
│   │   ├── test/       # 做题页
│   │   ├── result/     # 结果页
│   │   └── types/      # 16 型详情页
│   ├── components/     # 页面组件与共享组件（玻璃卡片、渐变按钮、雷达图、人格形象等）
│   ├── content/blog/   # 博客文章数据（TSX）
│   ├── data/           # 题库（72 题）与 16 型数据
│   ├── hooks/          # 滚动检测等自定义 Hook
│   └── lib/            # 评分算法、AI 客户端、认证、导出卡片等
├── prisma/             # 数据模型与迁移
├── tests/              # 单元测试 + E2E 测试
└── public/             # 静态资源
```

## 常用命令

| 命令 | 说明 |
|---|---|
| `npm run dev` | 启动开发服务器（http://localhost:3000） |
| `npm run build` | 生产构建（Windows 自动使用 webpack） |
| `npm start` | 运行生产构建产物 |
| `npm test` | 单元测试（Vitest） |
| `npm run e2e` | 端到端测试（Playwright，首次需 `npx playwright install chromium`） |
| `npm run typecheck` | TypeScript 类型检查 |
| `npm run lint` | ESLint 检查 |
| `npm run db:migrate` | 执行数据库迁移 |
| `npm run db:studio` | 打开数据库可视化工具 |

## 常见问题

**为什么 `npm audit` 报告 3 个高危？**
均为 Next.js 构建期传递依赖（sharp 图像库等），属于构建工具链问题，不影响网站运行。`npm audit fix --force` 会破坏依赖版本（强制降级 Next.js），因此维持跟踪不强制修复，待上游发布修复版后升级。

**改了 `.env` 为什么不生效？**
环境变量在启动时读取，修改后需要重启 `npm run dev`。

**登录后看不到之前的测试记录？**
匿名测试记录保存在本地浏览器（localStorage）；登录后保存的是云端记录，两者不互通。登录前的记录会保留在浏览器本地，可在未登录状态下查看。

**题目可以修改吗？**
可以。题库在 `src/data/question-bank.json`，改后建议运行 `npm test` 确认评分算法测试通过（题数、维度均衡有自动化校验）。

## License

[MIT](LICENSE) © UserZKL
