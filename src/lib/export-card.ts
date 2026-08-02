import { avatarSrc } from "@/lib/person-svg"

export interface ExportCardData {
  typeCode: string
  typeName: string
  description: string
  dimensions?: { left: string; right: string; leftPct: number; rightPct: number }[]
  strengths?: string[]
  footer?: string
}

const CARD_WIDTH = 800
const CARD_HEIGHT = 1040

const COLORS = {
  bgTop: "#0a0a12",
  bgBottom: "#0f0f1a",
  gold: "#d4a853",
  purple: "#7c3aed",
  cyan: "#06b6d4",
  white: "#f0f0f5",
  secondary: "#9090a5",
  tertiary: "#58586a",
  chipBg: "rgba(255,255,255,0.06)",
  barBg: "rgba(255,255,255,0.08)",
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

async function ensureFonts(ctx: CanvasRenderingContext2D) {
  try {
    await Promise.all([
      document.fonts.load('700 32px "Noto Sans SC"'),
      document.fonts.load('700 64px "Noto Sans SC"'),
      document.fonts.load('400 24px "Noto Sans SC"'),
      document.fonts.load('500 24px "Noto Sans SC"'),
    ])
  } catch {
    // fonts not available, fall back to system
  }
  ctx.font = '700 64px "Noto Sans SC", sans-serif'
}

async function drawCharacter(
  ctx: CanvasRenderingContext2D,
  typeCode: string,
  x: number,
  y: number,
  size: number
) {
  const img = new Image()
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error("avatar image failed to load"))
    img.src = avatarSrc(typeCode)
  })
  ctx.drawImage(img, x, y, size, size)
}

export async function drawResultCard(data: ExportCardData): Promise<string> {
  const canvas = document.createElement("canvas")
  canvas.width = CARD_WIDTH
  canvas.height = CARD_HEIGHT
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas not supported")

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, 0, CARD_HEIGHT)
  bg.addColorStop(0, COLORS.bgTop)
  bg.addColorStop(1, COLORS.bgBottom)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

  // Decorative glow circles
  const glow = ctx.createRadialGradient(700, 150, 0, 700, 150, 260)
  glow.addColorStop(0, "rgba(124,58,237,0.35)")
  glow.addColorStop(1, "rgba(124,58,237,0)")
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

  const glow2 = ctx.createRadialGradient(120, 880, 0, 120, 880, 220)
  glow2.addColorStop(0, "rgba(212,168,83,0.20)")
  glow2.addColorStop(1, "rgba(212,168,83,0)")
  ctx.fillStyle = glow2
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

  await ensureFonts(ctx)

  // Header: site name
  ctx.fillStyle = COLORS.tertiary
  ctx.font = '500 24px "Noto Sans SC", sans-serif'
  ctx.textAlign = "center"
  ctx.fillText("MBTI 人格测试", CARD_WIDTH / 2, 90)

  // Type badge chip
  const chipText = data.typeCode
  const chipW = 200
  const chipH = 64
  const chipX = CARD_WIDTH / 2 - chipW / 2
  const chipY = 160
  ctx.fillStyle = "rgba(124,58,237,0.25)"
  ctx.strokeStyle = COLORS.purple
  ctx.lineWidth = 2
  roundRect(ctx, chipX, chipY, chipW, chipH, 32)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = COLORS.white
  ctx.font = '700 32px "Noto Sans SC", sans-serif'
  ctx.fillText(chipText, CARD_WIDTH / 2, chipY + 43)

  // Character
  await drawCharacter(ctx, data.typeCode, 275, 230, 250)

  // Type name
  ctx.fillStyle = COLORS.white
  ctx.font = '700 64px "Noto Sans SC", sans-serif'
  ctx.fillText(data.typeName, CARD_WIDTH / 2, 590)

  // Divider line
  ctx.strokeStyle = "rgba(212,168,83,0.5)"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(220, 635)
  ctx.lineTo(580, 635)
  ctx.stroke()

  // Description (wrapped)
  ctx.fillStyle = COLORS.secondary
  ctx.font = '400 26px "Noto Sans SC", sans-serif'
  const descLines = wrapText(ctx, data.description, 620)
  let descY = 680
  for (const line of descLines.slice(0, 3)) {
    ctx.fillText(line, CARD_WIDTH / 2, descY)
    descY += 38
  }

  // Dimensions bars
  if (data.dimensions && data.dimensions.length > 0) {
    let y = 790
    for (const dim of data.dimensions.slice(0, 3)) {
      ctx.font = '500 24px "Noto Sans SC", sans-serif'
      ctx.fillStyle = COLORS.secondary
      ctx.textAlign = "left"
      ctx.fillText(dim.left, 140, y)
      ctx.textAlign = "right"
      ctx.fillText(dim.right, 660, y)

      const barW = 400
      const barH = 14
      const barX = 200
      const barY = y + 14
      ctx.fillStyle = COLORS.barBg
      roundRect(ctx, barX, barY, barW, barH, 7)
      ctx.fill()

      const leftFill = Math.max(4, (dim.leftPct / 100) * barW)
      const grad = ctx.createLinearGradient(barX, 0, barX + barW, 0)
      grad.addColorStop(0, COLORS.purple)
      grad.addColorStop(1, COLORS.cyan)
      ctx.fillStyle = grad
      roundRect(ctx, barX, barY, leftFill, barH, 7)
      ctx.fill()

      // percentage text on top of bar
      ctx.fillStyle = COLORS.tertiary
      ctx.font = '500 22px "Noto Sans SC", sans-serif'
      ctx.textAlign = "center"
      ctx.fillText(`${dim.leftPct}%`, barX + 40, y + 10)
      ctx.fillText(`${dim.rightPct}%`, barX + barW - 40, y + 10)

      y += 52
    }
  }

  // Strengths chips
  if (data.strengths && data.strengths.length > 0) {
    let y = 950
    ctx.textAlign = "left"
    ctx.fillStyle = COLORS.secondary
    ctx.font = '500 24px "Noto Sans SC", sans-serif'
    ctx.fillText("优势特点", 120, y - 20)

    let x = 120
    for (const s of data.strengths.slice(0, 3)) {
      ctx.font = '400 22px "Noto Sans SC", sans-serif'
      const w = ctx.measureText(s).width + 40
      if (x + w > CARD_WIDTH - 80) {
        x = 120
        y += 56
      }
      ctx.fillStyle = COLORS.chipBg
      roundRect(ctx, x, y, w, 44, 22)
      ctx.fill()
      ctx.strokeStyle = "rgba(212,168,83,0.4)"
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.fillStyle = COLORS.gold
      ctx.fillText(s, x + 20, y + 29)
      x += w + 16
    }
  }

  // Footer
  if (data.footer) {
    ctx.fillStyle = COLORS.tertiary
    ctx.font = '400 22px "Noto Sans SC", sans-serif'
    ctx.textAlign = "center"
    ctx.fillText(data.footer, CARD_WIDTH / 2, CARD_HEIGHT - 30)
  }

  return canvas.toDataURL("image/png")
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split("")
  const lines: string[] = []
  let line = ""
  for (const ch of words) {
    const testLine = line + ch
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line)
      line = ch
    } else {
      line = testLine
    }
  }
  if (line) lines.push(line)
  return lines
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a")
  a.href = dataUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
