/* eslint-disable react/no-unescaped-entities */
import type { BlogPost } from "./types"
import Link from "next/link"

const post: BlogPost = {
  slug: "sj-guardians",
  title: "SJ 守护者：秩序与传承的践行者",
  description: "了解 ISTJ、ISFJ、ESTJ、ESFJ 四种 SJ 型人格——社会稳定的基石。",
  date: "2026-07-15",
  category: "types",
  readTimeMinutes: 5,
  tags: ["SJ", "守护者", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "传统"],
  content: (
    <>
      <p>SJ 型（守护者）共享 S（感觉）和 J（判断）的组合，使得他们天生以<strong>责任、稳定和传承</strong>作为核心价值观。他们是社会的脊梁——没有 SJ，再美好的愿景也无法落地。</p>
      <h2>SJ 的核心特质</h2>
      <ul>
        <li>将责任和义务放在个人欲望之上</li>
        <li>尊重传统、规则和经过验证的方法</li>
        <li>注重细节和精确执行，对马虎零容忍</li>
        <li>在团队中提供可靠的、持续不断的输出</li>
      </ul>
      <h2>四种 SJ 类型</h2>
      <h3>ISTJ（物流师）— 严谨自律的执行者</h3>
      <p>ISTJ 以一丝不苟的执行力和极强的自律著称。他们说得出就做得到——承诺就是承诺。ISTJ 在需要精确度、耐心和绝对可靠性的领域（如审计、工程、档案管理）中是不可替代的基石。他们不是"顽固不化"，而是用事实证明可靠的价值。<Link href="/types/ISTJ" className="ml-1 text-[var(--color-brand-cyan)] hover:underline">查看 ISTJ 完整分析 →</Link></p>
      <h3>ISFJ（守卫者）— 默默付出的奉献者</h3>
      <p>ISFJ 有一种不张扬但无比坚定的关怀和保护欲。他们关注身边每一个具体的人的需求，并用实实在在的行动——而非言语——来表达自己的爱与忠诚。ISFJ 在护理、儿童教育、行政支持等需要持久温暖和细心照护的领域中，构成社会最温柔的保护层。<Link href="/types/ISFJ" className="ml-1 text-[var(--color-brand-cyan)] hover:underline">查看 ISFJ 完整分析 →</Link></p>
      <h3>ESTJ（总经理）— 高效务实的组织者</h3>
      <p>ESTJ 是天然的组织者和管理者。他们有一种让任何系统——从一家公司到一次家庭聚会——都运行得更顺畅的能力。ESTJ 的直率有时可能显得"严厉"，但那是因为他们真心相信明确的标准和规则能保护每个人。他们是你能在关键任务上绝对信赖的人。<Link href="/types/ESTJ" className="ml-1 text-[var(--color-brand-cyan)] hover:underline">查看 ESTJ 完整分析 →</Link></p>
      <h3>ESFJ（执政官）— 温暖而体贴的联结者</h3>
      <p>ESFJ 有一种让身边每个人都感到"被看见、被重视"的天赋。他们记得每个人的生日、喜好和最近遇到的烦恼。ESFJ 在医疗、酒店、社区活动和所有需要对人真诚关怀的场合中，创造出温暖的社交引力场——让分散的个体变成一个彼此关怀的群体。<Link href="/types/ESFJ" className="ml-1 text-[var(--color-brand-cyan)] hover:underline">查看 ESFJ 完整分析 →</Link></p>
    </>
  ),
}

export default post
