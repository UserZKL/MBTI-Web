import { getTypeVisual, type Pose } from "@/lib/types-visual"

export const TYPE_SVG: Record<string, string> = {
  INTJ: "/personalities/INTJ.svg",
  INTP: "/personalities/INTP.svg",
  ENTJ: "/personalities/ENTJ.svg",
  ENTP: "/personalities/ENTP.svg",
  INFJ: "/personalities/INFJ.svg",
  INFP: "/personalities/INFP.svg",
  ENFJ: "/personalities/ENFJ.svg",
  ENFP: "/personalities/ENFP.svg",
  ISTJ: "/personalities/ISTJ.svg",
  ISFJ: "/personalities/ISFJ.svg",
  ESTJ: "/personalities/ESTJ.svg",
  ESFJ: "/personalities/ESFJ.svg",
  ISTP: "/personalities/ISTP.svg",
  ISFP: "/personalities/ISFP.svg",
  ESTP: "/personalities/ESTP.svg",
  ESFP: "/personalities/ESFP.svg",
}

export const POSE_ANIM: Record<Pose, string> = {
  stand: "char-float 5s ease-in-out infinite",
  "hold-l": "char-float 4.6s ease-in-out infinite",
  "hold-r": "char-float 4.6s ease-in-out infinite",
  "hold-both": "char-float 4.4s ease-in-out infinite",
  "point-r": "char-float 4.2s ease-in-out infinite,char-sway 5s ease-in-out infinite",
  "point-f": "char-float 4s ease-in-out infinite,char-sway 4.8s ease-in-out infinite",
  "wave-r": "char-float 4.2s ease-in-out infinite",
  cross: "char-float 4.4s ease-in-out infinite,char-nod 6s ease-in-out infinite",
  "open-hands": "char-float 4s ease-in-out infinite,char-wiggle 5.4s ease-in-out infinite",
  dance: "char-bounce 3.2s ease-in-out infinite",
  hip: "char-float 4s ease-in-out infinite,char-sway 5s ease-in-out infinite",
}

export function avatarSrc(type: string): string {
  return TYPE_SVG[type] ?? TYPE_SVG.INTJ
}

export function poseAnimation(type: string, animated = true): string {
  if (!animated) return ""
  const visual = getTypeVisual(type)
  return POSE_ANIM[visual.pose] ?? POSE_ANIM.stand
}
