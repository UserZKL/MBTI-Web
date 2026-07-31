/* eslint-disable react/no-unescaped-entities */
import type { BlogPost } from "./types"
import Link from "next/link"

const post: BlogPost = {
  slug: "nf-idealists",
  title: "NF 理想主义者：心灵的深度探索者",
  description: "了解 INFJ、INFP、ENFJ、ENFP 四种 NF 型人格——那些用灵魂感受世界的人。",
  date: "2026-07-13",
  category: "types",
  readTimeMinutes: 5,
  tags: ["NF", "理想主义", "INFJ", "INFP", "ENFJ", "ENFP", "同理心"],
  content: (
    <>
      <p>NF 型（理想主义者）共享 N（直觉）和 F（情感）的组合，使得他们天生关注<strong>人的内在世界、意义和可能性</strong>。他们不只是看见"是什么"，更关心"可以成为什么"。</p>
      <h2>NF 的核心特质</h2>
      <ul>
        <li>对自我成长和帮助他人成长有强烈的驱动力</li>
        <li>需要感受到所做之事有超越功利的意义</li>
        <li>善于洞察他人的情感和需求，有天然的同理心</li>
        <li>在关系中追求深度和真实，而非表面客套</li>
      </ul>
      <h2>四种 NF 类型</h2>
      <h3>INFJ（提倡者）— 神秘而有远见的理想家</h3>
      <p>INFJ 是 MBTI 中最稀有的类型之一。他们有一种近乎神秘的洞察力，能看透复杂的人际关系和社会趋势。INFJ 在帮助他人实现潜能和推动社会向善的事业中燃烧自己的热情。他们需要独处来消化和整合深邃的直觉感受。<Link href="/types/INFJ" className="ml-1 text-[var(--color-brand-cyan)] hover:underline">查看 INFJ 完整分析 →</Link></p>
      <h3>INFP（调停者）— 追求内心和谐的灵魂诗人</h3>
      <p>INFP 拥有丰富多彩的内心世界，像一座隐秘的花园。他们有一套坚固的个人价值观体系，对真实和"做自己"怀有近乎宗教般的信仰。INFP 在创意写作、艺术和可以自由表达内心感受的领域中，创造出触动灵魂的作品。<Link href="/types/INFP" className="ml-1 text-[var(--color-brand-cyan)] hover:underline">查看 INFP 完整分析 →</Link></p>
      <h3>ENFJ（主人公）— 温暖而有力的引导者</h3>
      <p>ENFJ 天生拥有凝聚人、激励人的魅力。他们有一种独特的才能——看见每个人最好的那一面并呼唤它出来。ENFJ 在教育、辅导和领导团队走向共同愿景的场合中，散发出他人难以抗拒的正能量和感染力。<Link href="/types/ENFJ" className="ml-1 text-[var(--color-brand-cyan)] hover:underline">查看 ENFJ 完整分析 →</Link></p>
      <h3>ENFP（竞选者）— 热情洋溢的可能性探索家</h3>
      <p>ENFP 的生命是一场持续的探索——新的想法、新的人、新的体验让他们兴奋不已。他们善于在看似无关的事物之间建立惊人的联结，并用这股创造力激发周围的人。ENFP 在创业、创意营销和任何需要点燃他人热情的领域中闪闪发光。<Link href="/types/ENFP" className="ml-1 text-[var(--color-brand-cyan)] hover:underline">查看 ENFP 完整分析 →</Link></p>
    </>
  ),
}

export default post
