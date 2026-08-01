export interface TypeVisual {
  color: string
  secondary: string
  hair: "short" | "long" | "curly" | "spiky"
  eyes: "round" | "slant"
  mouth: "smile" | "flat" | "open"
  glasses?: boolean
  accessory: "none" | "book" | "laptop" | "paint" | "star"
}

const VISUALS: Record<string, TypeVisual> = {
  INTJ: { color: "#7c3aed", secondary: "#3b82f6", hair: "short", eyes: "slant", mouth: "flat", glasses: true, accessory: "book" },
  INTP: { color: "#6366f1", secondary: "#8b5cf6", hair: "curly", eyes: "slant", mouth: "flat", accessory: "laptop" },
  ENTJ: { color: "#3b82f6", secondary: "#06b6d4", hair: "short", eyes: "round", mouth: "flat", accessory: "book" },
  ENTP: { color: "#06b6d4", secondary: "#3b82f6", hair: "spiky", eyes: "round", mouth: "open", accessory: "laptop" },
  INFJ: { color: "#10b981", secondary: "#14b8a6", hair: "long", eyes: "slant", mouth: "smile", accessory: "star" },
  INFP: { color: "#14b8a6", secondary: "#10b981", hair: "long", eyes: "round", mouth: "smile", accessory: "paint" },
  ENFJ: { color: "#84cc16", secondary: "#10b981", hair: "short", eyes: "round", mouth: "smile", accessory: "star" },
  ENFP: { color: "#a3e635", secondary: "#84cc16", hair: "curly", eyes: "round", mouth: "open", accessory: "paint" },
  ISTJ: { color: "#64748b", secondary: "#475569", hair: "short", eyes: "round", mouth: "flat", glasses: true, accessory: "book" },
  ISFJ: { color: "#0ea5e9", secondary: "#64748b", hair: "long", eyes: "round", mouth: "smile", accessory: "star" },
  ESTJ: { color: "#475569", secondary: "#334155", hair: "short", eyes: "slant", mouth: "flat", accessory: "book" },
  ESFJ: { color: "#38bdf8", secondary: "#0ea5e9", hair: "long", eyes: "round", mouth: "smile", accessory: "star" },
  ISTP: { color: "#f59e0b", secondary: "#d97706", hair: "spiky", eyes: "slant", mouth: "flat", accessory: "laptop" },
  ISFP: { color: "#f97316", secondary: "#f59e0b", hair: "curly", eyes: "round", mouth: "smile", accessory: "paint" },
  ESTP: { color: "#e11d48", secondary: "#f43f5e", hair: "spiky", eyes: "round", mouth: "open", accessory: "laptop" },
  ESFP: { color: "#f43f5e", secondary: "#e11d48", hair: "curly", eyes: "round", mouth: "open", accessory: "paint" },
}

export function getTypeVisual(typeCode: string): TypeVisual {
  return (
    VISUALS[typeCode] ?? {
      color: "#7c3aed",
      secondary: "#3b82f6",
      hair: "short",
      eyes: "round",
      mouth: "smile",
      accessory: "none",
    }
  )
}
