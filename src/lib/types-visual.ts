export type Gender = "male" | "female"

export type HairStyle =
  | "straight"
  | "messy"
  | "slick"
  | "spiky"
  | "long"
  | "fluffy"
  | "wavy"
  | "buns"
  | "flat"
  | "pony-low"
  | "sleek"
  | "pony-high"
  | "swept"
  | "curls"
  | "crop"
  | "big-wavy"

export type EyeStyle = "dot" | "happy"
export type MouthStyle = "none"
export type GlassesStyle = "round" | "square" | "sunglasses"
export type BeardStyle = "none" | "short" | "long"

export type Pose =
  | "stand"
  | "hold-l"
  | "hold-r"
  | "hold-both"
  | "point-r"
  | "point-f"
  | "wave-r"
  | "cross"
  | "open-hands"
  | "dance"
  | "hip"

export type OutfitStyle =
  | "suit"
  | "jacket"
  | "tshirt"
  | "labcoat"
  | "nurse"
  | "robe"
  | "dress"
  | "overall"
  | "workshirt"

export type PropStyle =
  | "flag"
  | "flask"
  | "pointer"
  | "podium"
  | "wand"
  | "pinwheel"
  | "sword"
  | "backpack"
  | "notebook"
  | "ruler"
  | "cake"
  | "wrench"
  | "palette"
  | "sportbag"
  | "maracas"
  | "none"

export interface TypeVisual {
  color: string
  secondary: string
  hair: HairStyle
  hairColor?: string
  eyes: EyeStyle
  mouth: MouthStyle
  glasses?: GlassesStyle
  beard?: BeardStyle
  pose: Pose
  prop: PropStyle
  gender: Gender
  outfit: OutfitStyle
  identity: string
}

const VISUALS: Record<string, TypeVisual> = {
  INTJ: { color: "#7c3aed", secondary: "#3b82f6", hair: "straight", eyes: "dot", mouth: "none", beard: "short", pose: "hold-r", prop: "flag", gender: "male", outfit: "suit", identity: "架构师" },
  INTP: { color: "#6366f1", secondary: "#8b5cf6", hair: "messy", eyes: "dot", mouth: "none", glasses: "round", pose: "hold-r", prop: "flask", gender: "female", outfit: "labcoat", identity: "逻辑学家" },
  ENTJ: { color: "#3b82f6", secondary: "#06b6d4", hair: "slick", eyes: "dot", mouth: "none", pose: "point-r", prop: "pointer", gender: "female", outfit: "suit", identity: "指挥官" },
  ENTP: { color: "#06b6d4", secondary: "#3b82f6", hair: "spiky", eyes: "dot", mouth: "none", pose: "open-hands", prop: "podium", gender: "male", outfit: "tshirt", identity: "辩论家" },
  INFJ: { color: "#10b981", secondary: "#14b8a6", hair: "long", hairColor: "#e6e6e6", eyes: "dot", mouth: "none", beard: "long", pose: "hold-r", prop: "wand", gender: "male", outfit: "robe", identity: "提倡者" },
  INFP: { color: "#14b8a6", secondary: "#10b981", hair: "fluffy", eyes: "dot", mouth: "none", pose: "dance", prop: "pinwheel", gender: "female", outfit: "dress", identity: "调停者" },
  ENFJ: { color: "#84cc16", secondary: "#10b981", hair: "wavy", eyes: "happy", mouth: "none", beard: "short", pose: "hold-r", prop: "sword", gender: "male", outfit: "tshirt", identity: "主人公" },
  ENFP: { color: "#a3e635", secondary: "#84cc16", hair: "buns", hairColor: "#5a4636", eyes: "happy", mouth: "none", pose: "wave-r", prop: "backpack", gender: "female", outfit: "tshirt", identity: "活动家" },
  ISTJ: { color: "#64748b", secondary: "#475569", hair: "flat", eyes: "dot", mouth: "none", glasses: "square", pose: "hold-both", prop: "notebook", gender: "male", outfit: "jacket", identity: "物流师" },
  ISFJ: { color: "#0ea5e9", secondary: "#64748b", hair: "pony-low", hairColor: "#5a4636", eyes: "dot", mouth: "none", pose: "cross", prop: "none", gender: "female", outfit: "nurse", identity: "守护者" },
  ESTJ: { color: "#475569", secondary: "#334155", hair: "sleek", eyes: "dot", mouth: "none", glasses: "square", pose: "hold-r", prop: "ruler", gender: "female", outfit: "suit", identity: "管理者" },
  ESFJ: { color: "#38bdf8", secondary: "#0ea5e9", hair: "wavy", eyes: "happy", mouth: "none", pose: "hold-both", prop: "cake", gender: "male", outfit: "tshirt", identity: "执政官" },
  ISTP: { color: "#f59e0b", secondary: "#d97706", hair: "swept", eyes: "dot", mouth: "none", pose: "hold-r", prop: "wrench", gender: "male", outfit: "workshirt", identity: "鉴赏家" },
  ISFP: { color: "#f97316", secondary: "#f59e0b", hair: "curls", hairColor: "#d9a441", eyes: "dot", mouth: "none", pose: "hold-both", prop: "palette", gender: "female", outfit: "overall", identity: "冒险家" },
  ESTP: { color: "#e11d48", secondary: "#f43f5e", hair: "crop", eyes: "dot", mouth: "none", glasses: "sunglasses", pose: "point-f", prop: "sportbag", gender: "male", outfit: "tshirt", identity: "企业家" },
  ESFP: { color: "#f43f5e", secondary: "#e11d48", hair: "big-wavy", hairColor: "#2b2b2b", eyes: "happy", mouth: "none", pose: "dance", prop: "maracas", gender: "female", outfit: "dress", identity: "表演者" },
}

export function getTypeVisual(typeCode: string): TypeVisual {
  return (
    VISUALS[typeCode] ?? {
      color: "#7c3aed",
      secondary: "#3b82f6",
      hair: "straight",
      eyes: "dot",
      mouth: "none",
      pose: "stand",
      prop: "none",
      gender: "female",
      outfit: "tshirt",
      identity: "未知",
    }
  )
}
