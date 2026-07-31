/* eslint-disable react/no-unescaped-entities */
import type { BlogPost } from "./types"
import Link from "next/link"

const post: BlogPost = {
  slug: "sp-explorers",
  title: "SP 探险家：活在当下的行动派",
  description: "了解 ISTP、ISFP、ESTP、ESFP 四种 SP 型人格——那些用身体和感官与世界对话的人。",
  date: "2026-07-17",
  category: "types",
  readTimeMinutes: 5,
  tags: ["SP", "探险家", "ISTP", "ISFP", "ESTP", "ESFP", "行动力"],
  content: (
    <>
      <p>SP 型（探险家）共享 S（感觉）和 P（感知）的组合，使得他们天生拥有<strong>对当下时刻的高度敏感和灵活应变的能力</strong>。他们要的不是思考世界，而是体验世界。</p>
      <h2>SP 的核心特质</h2>
      <ul>
        <li>活在当下，对感官体验有强烈的享受能力</li>
        <li>适应力极强，在快节奏、不确定的环境中发挥出色</li>
        <li>实践经验导向——"做起来看看"胜过"理论分析"</li>
        <li>在需要即时观察和快速反应的领域中游刃有余</li>
      </ul>
      <h2>四种 SP 类型</h2>
      <h3>ISTP（鉴赏家）— 冷静的实战专家</h3>
      <p>ISTP 是天生的问题解决者——无论是修车、调试代码还是危机救援，他们都展现出一种冷静、高效、活在当下的"匠人精神"。ISTP 不言多言，但一出手就能在关键时刻扭转局面。他们是世界上的"现实版蝙蝠侠"。<Link href="/types/ISTP" className="ml-1 text-[var(--color-brand-cyan)] hover:underline">查看 ISTP 完整分析 →</Link></p>
      <h3>ISFP（冒险家）— 安静而敏感的生活艺术家</h3>
      <p>ISFP 拥有一种对美的天然感知和对感官细节的深度沉浸。他们不擅长长篇大论地表达，但可以用一幅画、一首曲子或一个精心布置的空间来传达无法言说的情感。ISFP 在视觉艺术、音乐、花艺和所有需要"感觉"而非"分析"的领域中，创造了世界的美好。<Link href="/types/ISFP" className="ml-1 text-[var(--color-brand-cyan)] hover:underline">查看 ISFP 完整分析 →</Link></p>
      <h3>ESTP（企业家）— 无所畏惧的行动派</h3>
      <p>ESTP 是MBTI中最擅长在高压和不确定性中快速行动的人。他们拥有一种让人想跟随的原始魅力和对风险判断的奇妙直觉。ESTP 在销售、急救、运动竞技和创业等需要"当下拍板、立刻行动"的场合中，释放出不可阻挡的能量和影响力。<Link href="/types/ESTP" className="ml-1 text-[var(--color-brand-cyan)] hover:underline">查看 ESTP 完整分析 →</Link></p>
      <h3>ESFP（表演者）— 活力四射的快乐传播者</h3>
      <p>ESFP 拥有一种"让派对开始"的感染力和对生活乐趣的纯粹热爱。他们用当下的快乐、真诚的关注和不做作的热情，来点亮身边的每一个人。ESFP 在表演艺术、活动策划和所有需要真实人际互动与即兴智慧的领域中，展现了什么叫"生命力"。<Link href="/types/ESFP" className="ml-1 text-[var(--color-brand-cyan)] hover:underline">查看 ESFP 完整分析 →</Link></p>
    </>
  ),
}

export default post
