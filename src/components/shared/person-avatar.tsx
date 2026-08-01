import { getTypeVisual, type TypeVisual } from "@/lib/types-visual"

function Hair({ v, uid }: { v: TypeVisual; uid: string }) {
  switch (v.hair) {
    case "long":
      return (
        <g>
          <path
            d="M64 82 A36 36 0 0 1 136 82 L136 74 Q136 40 100 40 Q64 40 64 74 Z"
            fill={`url(#${uid})`}
          />
          <path
            d="M64 80 L66 140 Q78 150 86 138 L84 92 Q70 92 64 80 Z"
            fill={`url(#${uid})`}
            opacity="0.9"
          />
          <path
            d="M136 80 L134 140 Q122 150 114 138 L116 92 Q130 92 136 80 Z"
            fill={`url(#${uid})`}
            opacity="0.9"
          />
        </g>
      )
    case "curly":
      return (
        <g fill={`url(#${uid})`}>
          <circle cx="84" cy="52" r="16" />
          <circle cx="100" cy="44" r="17" />
          <circle cx="116" cy="52" r="16" />
          <circle cx="72" cy="66" r="13" />
          <circle cx="128" cy="66" r="13" />
          <path d="M66 80 A34 34 0 0 1 134 80 L134 70 L66 70 Z" />
        </g>
      )
    case "spiky":
      return (
        <g fill={`url(#${uid})`}>
          <path d="M64 78 L58 52 L80 64 L78 42 L98 60 L100 36 L116 58 L126 42 L124 64 L142 56 L136 78 Z" />
          <path d="M64 80 A36 36 0 0 1 136 80 L136 76 L64 76 Z" />
        </g>
      )
    default:
      return (
        <path
          d="M64 84 A36 36 0 0 1 136 84 L136 72 Q136 40 100 40 Q64 40 64 72 Z"
          fill={`url(#${uid})`}
        />
      )
  }
}

function Eyes({ v }: { v: TypeVisual }) {
  if (v.eyes === "slant") {
    return (
      <g stroke="#1f1a24" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M84 78 Q89 73 94 78" />
        <path d="M106 78 Q111 73 116 78" />
      </g>
    )
  }
  return (
    <g fill="#1f1a24">
      <circle cx="89" cy="78" r="3.5" />
      <circle cx="111" cy="78" r="3.5" />
    </g>
  )
}

function Mouth({ v }: { v: TypeVisual }) {
  if (v.mouth === "open") {
    return <circle cx="100" cy="96" r="4.5" fill="#7c2d3e" />
  }
  if (v.mouth === "flat") {
    return <path d="M91 96 L109 96" stroke="#1f1a24" strokeWidth="2.5" strokeLinecap="round" />
  }
  return <path d="M90 93 Q100 101 110 93" stroke="#1f1a24" strokeWidth="2.5" strokeLinecap="round" fill="none" />
}

function Accessory({ v, uid }: { v: TypeVisual; uid: string }) {
  switch (v.accessory) {
    case "book":
      return (
        <g>
          <rect x="78" y="136" width="44" height="26" rx="3" fill={`url(#${uid})`} opacity="0.85" />
          <path d="M100 138 L100 160" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
        </g>
      )
    case "laptop":
      return (
        <g>
          <rect x="74" y="132" width="52" height="24" rx="3" fill="#2a2a3a" />
          <rect x="80" y="136" width="40" height="14" rx="2" fill={`url(#${uid})`} opacity="0.85" />
          <rect x="88" y="156" width="24" height="5" rx="2" fill="#2a2a3a" />
        </g>
      )
    case "paint":
      return (
        <g>
          <path d="M112 132 L134 110" stroke={`url(#${uid})`} strokeWidth="5" strokeLinecap="round" />
          <circle cx="136" cy="108" r="6" fill={`url(#${uid})`} />
        </g>
      )
    case "star":
      return (
        <path
          d="M100 24 L104 36 L116 36 L106 44 L110 56 L100 49 L90 56 L94 44 L84 36 L96 36 Z"
          fill={`url(#${uid})`}
        />
      )
    default:
      return null
  }
}

export function PersonAvatar({
  type,
  size = 128,
  className,
}: {
  type: string
  size?: number
  className?: string
}) {
  const v = getTypeVisual(type)
  const uid = `pa-${type}`
  const uidBg = `pa-bg-${type}`

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`${type} 人格形象`}
    >
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={v.color} />
          <stop offset="100%" stopColor={v.secondary} />
        </linearGradient>
        <radialGradient id={uidBg} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={v.color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={v.color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="100" cy="100" r="86" fill={`url(#${uidBg})`} />

      <g style={{ transformOrigin: "100px 168px", animation: "person-breathe 3.2s ease-in-out infinite" }}>
        <path
          d="M72 148 Q100 118 128 148 L140 190 Q100 202 60 190 Z"
          fill={`url(#${uid})`}
        />
        <path d="M86 142 L86 186 Q100 192 114 186 L114 142 Q100 152 86 142 Z" fill="#f5d7b8" />

        <circle cx="100" cy="78" r="36" fill="#f5d7b8" />

        {v.glasses && (
          <g stroke="#1f1a24" strokeWidth="2" fill="none" opacity="0.7">
            <circle cx="89" cy="78" r="9" />
            <circle cx="111" cy="78" r="9" />
            <path d="M98 78 L102 78" />
          </g>
        )}

        <Hair v={v} uid={uid} />
        <Eyes v={v} />
        <Mouth v={v} />
        <Accessory v={v} uid={uid} />
      </g>
    </svg>
  )
}
