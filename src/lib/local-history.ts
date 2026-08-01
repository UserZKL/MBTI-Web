export interface LocalHistoryItem {
  typeCode: string
  typeName: string
  createdAt: string
  data: string
}

const KEY = "mbti-history"
const MAX_ITEMS = 20

export function readLocalHistory(): LocalHistoryItem[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const list = JSON.parse(raw) as LocalHistoryItem[]
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export function writeLocalHistory(item: Omit<LocalHistoryItem, "createdAt">): void {
  try {
    const list = readLocalHistory().filter((h) => h.data !== item.data)
    list.unshift({ ...item, createdAt: new Date().toISOString() })
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX_ITEMS)))
  } catch {
    // localStorage unavailable
  }
}
