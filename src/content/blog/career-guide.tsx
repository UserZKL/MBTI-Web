/* eslint-disable react/no-unescaped-entities */
import type { BlogPost } from "./types"
import Link from "next/link"

const post: BlogPost = {
  slug: "career-guide",
  title: "MBTI 职业指南：找到最适合你的方向",
  description: "基于你的 MBTI 人格类型，探索最符合你天然优势的职业路径和工作方式。",
  date: "2026-07-21",
  category: "growth",
  readTimeMinutes: 5,
  tags: ["职业", "工作", "优势", "发展", "求职"],
  content: (
    <>
      <p>职业选择不是寻找一个"正确的答案"，而是寻找一条能最大程度发挥你<strong>天然优势</strong>同时不会过度消耗你弱势维度的道路。MBTI 为你理解自己能做什么、喜欢做什么提供了一个非常实用的框架。</p>
      <h2>NT 分析家的工作模式</h2>
      <p>NT 型（INTJ, INTP, ENTJ, ENTP）在需要<strong>战略思维、体系构建和复杂问题解决</strong>的环境中发挥最大价值。他们需要工作的智力挑战和被赋予自主权来设计解决方案。典型的 NT 友好领域包括科技、金融、科研、战略咨询。</p>
      <ul><li>适合：独立项目、远程工作、扁平组织</li><li>避免：高度重复的、需要不断处理情绪化人际冲突的职位</li></ul>
      <h2>NF 理想主义者的工作模式</h2>
      <p>NF 型（INFJ, INFP, ENFJ, ENFP）需要工作有<strong>超越功利的意义感</strong>。他们不只关心"做什么"，更关心"为什么做"。当他们感觉自己的工作正在帮助具体的人或推动善的事情发生时，他们会释放出不可阻挡的激情和创造力。典型的 NF 友好领域包括教育、心理咨询、创意写作、非营利组织。</p>
      <ul><li>适合：使命驱动的组织、创造性表达的空间、与人深度互动的角色</li><li>避免：纯粹追求利润最大化的、高度官僚的环境</li></ul>
      <h2>SJ 守护者的工作模式</h2>
      <p>SJ 型（ISTJ, ISFJ, ESTJ, ESFJ）在需要<strong>责任心、精确度和可靠性</strong>的环境中发挥核心作用。他们是任何组织的稳定力量——把事情做好、做完整、做对。典型的 SJ 友好领域包括医疗、财务、政府管理、运营。</p>
      <ul><li>适合：有明确晋升路径的、结构清晰的、传统稳定的组织</li><li>避免：过度混乱、规则频繁变动的创业早期阶段</li></ul>
      <h2>SP 探险家的工作模式</h2>
      <p>SP 型（ISTP, ISFP, ESTP, ESFP）在需要<strong>实操技能、灵活应变和实时解决问题</strong>的环境中大放异彩。他们讨厌被束缚在办公桌前，需要能动手、能移动、能立即看到成果的工作。典型的 SP 友好领域包括医疗急救、工艺制作、销售、表演艺术。</p>
      <ul><li>适合：需要亲自动手的、结果即时可见的、允许独立判断的工作</li><li>避免：需要预先做大量书面计划的、长周期才见成果的职位</li></ul>
      <p>找出自己的类型，探索最适合你的职业方向：<Link href="/test" className="text-[var(--color-brand-cyan)] hover:underline">开始免费 MBTI 测试 →</Link></p>
    </>
  ),
}

export default post
