/* eslint-disable react/no-unescaped-entities */
import type { BlogPost } from "./types"
import Link from "next/link"

const post: BlogPost = {
  slug: "extrovert-introvert",
  title: "E 型与 I 型：你的能量从哪里来？",
  description: "深入解析外向与内向人格的核心差异，理解不同能量来源如何影响社交、工作和生活选择。",
  date: "2026-07-03",
  category: "dimensions",
  readTimeMinutes: 4,
  tags: ["外向", "内向", "E/I", "社交", "能量管理"],
  content: (
    <>
      <p>在 MBTI 四个维度中，外向（E）与内向（I）可能是最常被误解的一对。大多数人对"外向"和"内向"的理解停留在"话多 vs 话少"或"喜欢社交 vs 不喜欢社交"的表层，但真相要深刻得多。</p>
      <h2>本质区别：能量的流向</h2>
      <p>外向者和内向者最根本的区别在于<strong>能量的来源和消耗方式</strong>：</p>
      <ul>
        <li><strong>E 型（外向）</strong>：从外部世界获取能量。在社交场合、团队讨论、热闹的环境中感到充实。独自一人太久会感到疲惫和无聊。他们倾向于"边说边想"，通过与他人交流来整理思路。</li>
        <li><strong>I 型（内向）</strong>：从内心世界获取能量。在独处、深度思考、安静的环境中最能恢复精力。长时间的社交聚会会消耗他们的能量。他们倾向于"先想后说"，在内心处理完信息后才表达。</li>
      </ul>
      <h2>职场中的 E 与 I</h2>
      <p>E 型的人在开放式办公室、头脑风暴会议、频繁的团队互动中如鱼得水。他们喜欢即时反馈，在快节奏、多人协作的环境中表现出色。</p>
      <p>I 型的人在独立思考、深度专注、写文档或一对一交流中发挥最大价值。他们需要安静的时间来产生高质量的洞见，在需要深思熟虑的领域（如科研、写作、编程）有天然优势。</p>
      <h2>关系中的 E 与 I</h2>
      <p>E 型和 I 型之间的友谊和婚姻可以非常互补——E 型帮助 I 型走出舒适圈接触新朋友，I 型帮助 E 型慢下来享受深度的亲密感。关键在于相互理解而非试图改变对方。</p>
      <p>想了解自己的 E/I 维度得分？<Link href="/test" className="text-[var(--color-brand-cyan)] hover:underline">点击这里开始测试</Link></p>
    </>
  ),
}

export default post
