import type { BlogPost } from "./types"
import Link from "next/link"

const post: BlogPost = {
  slug: "nt-analysis",
  title: "NT 分析家：理性的战略思考者",
  description: "探索 INTJ、INTP、ENTJ、ENTP 四种 NT 型人格的共性特征与独特魅力。",
  date: "2026-07-11",
  category: "types",
  readTimeMinutes: 5,
  tags: ["NT", "分析家", "理性", "INTJ", "INTP", "ENTJ", "ENTP"],
  content: (
    <>
      <p>NT 型（理性主义者）是 MBTI 中一个以<strong>逻辑、能力和战略思维</strong>为核心气质的人格群体。他们共享 T（思考）和 N（直觉）的组合，使得他们天生善于系统化思考、追求知识和效率。</p>
      <h2>NT 的核心特质</h2>
      <ul>
        <li>对知识的渴求持续终生，享受理解复杂系统</li>
        <li>追求能力和自主性，讨厌被无能或低效率浪费精力</li>
        <li>喜欢挑战并解决难题，在智力竞争中获得满足</li>
        <li>沟通风格直接、逻辑清晰，重视效率胜过形式</li>
      </ul>
      <h2>四种 NT 类型</h2>
      <h3>INTJ（建筑师）— 战略型独立思想家</h3>
      <p>以长远的战略规划和对系统优化的执念闻名。INTJ 是天生的系统架构师，擅长在复杂问题中发现核心模式并设计最优解。他们的冷静和独立让他在需要超然判断力的领域（战略、科技、投资）中如鱼得水。<Link href="/types/INTJ" className="ml-1 text-[var(--color-brand-cyan)] hover:underline">查看 INTJ 完整分析 →</Link></p>
      <h3>INTP（逻辑学家）— 真理的探索者</h3>
      <p>以纯粹的对真理和逻辑一致性的追求为驱动力。INTP 是知识的解构者，享受推翻假设并构建更精确的理论。他们在需要深度分析和概念创新的领域（理论物理、哲学、算法设计）中保持持久的专注力。<Link href="/types/INTP" className="ml-1 text-[var(--color-brand-cyan)] hover:underline">查看 INTP 完整分析 →</Link></p>
      <h3>ENTJ（指挥官）— 愿景驱动的领袖</h3>
      <p>以强大的领导力、决断力和执行抱负的能力著称。ENTJ 是天生的组织者，看到系统的低效率就想优化，看到人才就想培养。他们在需要果断决策和大规模协调的领域（企业管理、政治、军事）中引领变革。<Link href="/types/ENTJ" className="ml-1 text-[var(--color-brand-cyan)] hover:underline">查看 ENTJ 完整分析 →</Link></p>
      <h3>ENTP（辩论家）— 创新的思想激荡者</h3>
      <p>以敏捷的思维、对争论的热爱和几乎永不停歇的创意输出为特征。ENTP 是观点的催化剂，善于从不可能的角度找到可能。他们在需要头脑风暴和突破性创新的领域（创业、创意写作、产品设计）中带来革命性的想法。<Link href="/types/ENTP" className="ml-1 text-[var(--color-brand-cyan)] hover:underline">查看 ENTP 完整分析 →</Link></p>
    </>
  ),
}

export default post
