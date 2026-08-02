import { avatarSrc, poseAnimation } from "@/lib/person-svg"

/* eslint-disable @next/next/no-img-element -- static svg assets, no optimization needed */

export function PersonAvatar({
  type,
  size = 128,
  className,
}: {
  type: string
  size?: number
  className?: string
}) {
  const animation = poseAnimation(type)
  return (
    <span className={className}>
      <img
        src={avatarSrc(type)}
        width={size}
        height={size}
        role="img"
        alt={`${type} 人格形象`}
        aria-label={`${type} 人格形象`}
        className="person-avatar"
        style={animation ? { animation, transformOrigin: "50% 90%" } : undefined}
      />
    </span>
  )
}
