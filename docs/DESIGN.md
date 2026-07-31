# DESIGN.md — MBTI Personality Test Design System

> OpenCode + DeepSeek V4-Pro · Phase 2 · 2026-07-31

## 1. 品牌调性

**Dark Luxury · 渐变 · 玻璃质感 · 金色点缀**

- 底色深沉（近乎黑的深蓝灰），营造沉浸、专注的氛围
- 渐变作为品牌识别核心（紫→蓝→青 primary 渐变，琥珀→玫红 accent 渐变）
- 毛玻璃卡片叠加微光，建立层次和信息层级
- 金色细节点缀（分隔线、图标描边、类型徽章）
- 大量留白与精确间距，体现「精致」而非「拥挤」

## 2. 色彩系统

### 2.1 底色 (Paper)

| Token | OKLCH / RGB | 用途 |
|-------|-------------|------|
| `--color-paper` | `#050508` | 最深背景（Hero区域） |
| `--color-paper-2` | `#0a0a12` | 页面默认背景 |
| `--color-paper-3` | `#0f0f1a` | 略微抬升的背景 |

### 2.2 表面 (Surface)

| Token | 值 | 用途 |
|-------|-----|------|
| `--color-surface` | `rgba(255,255,255,0.03)` | 卡片/容器默认背景 |
| `--color-surface-2` | `rgba(255,255,255,0.06)` | 悬浮态、选中态 |
| `--color-surface-3` | `rgba(255,255,255,0.10)` | 激活态、按下态 |

### 2.3 边框 (Border)

| Token | 值 | 用途 |
|-------|-----|------|
| `--color-border` | `rgba(255,255,255,0.06)` | 默认分隔线、卡片边框 |
| `--color-border-2` | `rgba(255,255,255,0.10)` | 悬浮态边框、活跃边框 |
| `--color-border-3` | `rgba(255,255,255,0.15)` | 高亮边框 |

### 2.4 文字 (Text)

| Token | 值 | 用途 |
|-------|-----|------|
| `--color-text-primary` | `#f0f0f5` | 主文字、标题 |
| `--color-text-secondary` | `#9090a5` | 副文字、描述、标签 |
| `--color-text-tertiary` | `#58586a` | 禁用态、辅助信息 |

### 2.5 品牌色 (Brand)

| Token | 值 | 用途 |
|-------|-----|------|
| `--color-brand-purple` | `#7c3aed` | Primary 渐变起点 |
| `--color-brand-blue` | `#3b82f6` | Primary 渐变中点 |
| `--color-brand-cyan` | `#06b6d4` | Primary 渐变终点 |
| `--color-brand-amber` | `#f59e0b` | Accent 渐变起点 |
| `--color-brand-rose` | `#e11d48` | Accent 渐变终点 |
| `--color-brand-gold` | `#d4a853` | Luxury 点缀色 |

### 2.6 语义色 (Semantic)

| Token | 值 | 用途 |
|-------|-----|------|
| `--color-success` | `#22c55e` | 成功状态 |
| `--color-warning` | `#f59e0b` | 警告状态 |
| `--color-error` | `#ef4444` | 错误状态 |
| `--color-info` | `#3b82f6` | 信息提示 |

### 2.7 渐变预设

```css
--gradient-primary: linear-gradient(135deg, #7c3aed, #3b82f6, #06b6d4);
--gradient-primary-horizontal: linear-gradient(90deg, #7c3aed, #3b82f6, #06b6d4);
--gradient-accent: linear-gradient(135deg, #f59e0b, #e11d48);
--gradient-accent-horizontal: linear-gradient(90deg, #f59e0b, #e11d48);
```

### 2.8 辉光 (Glow)

```css
--glow-purple: 0 0 40px rgba(124, 58, 237, 0.15);
--glow-purple-strong: 0 0 80px rgba(124, 58, 237, 0.25);
--glow-gold: 0 0 20px rgba(212, 168, 83, 0.10);
--glow-cyan: 0 0 30px rgba(6, 182, 212, 0.12);
```

## 3. 字体系统

| 角色 | 字体 | 备选 | 字重 | 来源 |
|------|------|------|------|------|
| Display | Noto Serif SC | serif | 400, 700 | Google Fonts |
| Body | Noto Sans SC | sans-serif | 400, 500, 700 | Google Fonts |
| UI | Geist | Noto Sans SC, sans-serif | 400, 500, 600, 700 | next/font |
| Mono | Geist Mono | monospace | 400 | next/font |

### 字体层级 (Type Scale)

| 级别 | Class | 大小 / 行高 | 字重 | 字体 | 用途 |
|------|-------|------------|------|------|------|
| Display 1 | `.text-display-1` | 4.5rem / 1.05 | 700 | Display | Hero 标题 |
| Display 2 | `.text-display-2` | 3rem / 1.1 | 700 | Display | 页面主标题 |
| Heading 1 | `.text-h1` | 2.25rem / 1.2 | 700 | Body | 区块标题 |
| Heading 2 | `.text-h2` | 1.75rem / 1.3 | 600 | Body | 子标题 |
| Heading 3 | `.text-h3` | 1.25rem / 1.4 | 600 | Body | 小组标题 |
| Body LG | `.text-body-lg` | 1.125rem / 1.6 | 400 | Body | 导语/摘要 |
| Body | `.text-body` | 1rem / 1.6 | 400 | Body | 正文 |
| Body SM | `.text-body-sm` | 0.875rem / 1.5 | 400 | Body | 辅助文字 |
| Caption | `.text-caption` | 0.75rem / 1.4 | 500 | Body | 标签/注释 |
| Mono | `.text-mono` | 0.875rem / 1.5 | 400 | Mono | 得分/数字 |

## 4. 间距系统

基于 4px 基准：

| Token | 值 | 用途 |
|-------|-----|------|
| `--space-1` | 4px | 元素内间距 |
| `--space-2` | 8px | 紧密间距 |
| `--space-3` | 12px | 默认组件间距 |
| `--space-4` | 16px | 默认组件内间距 |
| `--space-5` | 20px | 中等间距 |
| `--space-6` | 24px | 区块内间距 |
| `--space-8` | 32px | 组件间间距 |
| `--space-12` | 48px | 区块间间距 |
| `--space-16` | 64px | 大区块间距 |
| `--space-24` | 96px | 超大间距 |
| `--space-section` | 128px | Section 间距 |

## 5. 圆角

| Token | 值 | Tailwind | 用途 |
|-------|-----|----------|------|
| `--radius-sm` | 4px | `rounded-sm` | 小元素（badge/tag） |
| `--radius-md` | 8px | `rounded-md` | 默认（button/card） |
| `--radius-lg` | 12px | `rounded-lg` | 大卡片 |
| `--radius-xl` | 16px | `rounded-xl` | 模态框 |
| `--radius-full` | 9999px | `rounded-full` | 按钮/pill/头像 |

## 6. 玻璃效果 (Glass)

定义为一组可组合的 Tailwind 类：

| 等级 | 背景 | 模糊 | 边框 |
|------|------|------|------|
| Glass 1 (subtle) | `bg-surface` | `backdrop-blur-md` | `border border-border` |
| Glass 2 (default) | `bg-surface/60` | `backdrop-blur-xl` | `border border-border-2` |
| Glass 3 (prominent) | `bg-surface/80` | `backdrop-blur-2xl` | `border border-border-3` |

## 7. 动效预设

供 Phase 3 实现，此处定义规范：

| 动效 | 时长 | 缓动 | 用途 |
|------|------|------|------|
| fade-in | 300ms | ease-out | 页面元素淡入 |
| slide-up | 400ms | cubic-bezier(0.16,1,0.3,1) | 内容上滑出现 |
| scale-in | 200ms | ease-out | 卡片/弹窗缩放 |
| pulse-glow | 2s | ease-in-out (loop) | 辉光呼吸动画 |
| stagger | 50ms/child | ease-out | 列表项依次出现 |

## 8. 组件规范

### 8.1 渐变色文字

```
class: gradient-text bg-gradient-to-r from-brand-purple via-brand-blue to-brand-cyan bg-clip-text text-transparent
```

### 8.2 CTA 渐变按钮

```
class: bg-gradient-primary text-white rounded-full px-8 py-4 
       hover:shadow-[var(--glow-purple)] transition-shadow duration-300
```

### 8.3 金线分隔

```
element: 2px 高，100% 宽，background: gradient-primary-horizontal
```

## 9. 响应式断点

| 断点 | 宽度 | 列数 | 用途 |
|------|------|------|------|
| `sm` | 640px | 1 | 移动端 |
| `md` | 768px | 1-2 | 平板竖屏 |
| `lg` | 1024px | 2-3 | 平板横屏 / 小桌面 |
| `xl` | 1280px | 4 | 桌面 |
| `2xl` | 1536px | 4（最大宽度约束） | 大桌面 |

最大内容宽度：`max-w-7xl` (1280px)，Hero 区域可突破至 `max-w-[1440px]`

## 10. 文件名与导入规范

- 共享组件：`components/ui/<name>.tsx`
- 页面组件：`components/<page>/<name>.tsx`
- 导入路径：`@/components/ui/<name>` / `@/components/<page>/<name>`
- 工具函数：`@/lib/<name>.ts`
- 数据文件：`@/data/<name>.json`

## 11. 可访问性规范

- 所有交互元素 `focus-visible:ring-2 focus-visible:ring-brand-purple`
- 色彩对比度 ≥ 4.5:1（正文）、≥ 3:1（大文字 18px+）
- `prefers-reduced-motion` 时禁用所有动画
- 图片始终带 `alt` 属性
- 表单元素始终带 `<label>` 关联
