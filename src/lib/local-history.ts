export interface LocalHistoryItem {
  typeCode: string
  typeName: string
  createdAt: string
  data: string
  report?: string
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
    const list = readLocalHistory()
    const existing = list.find((h) => h.data === item.data)
    const filtered = list.filter((h) => h.data !== item.data)
    filtered.unshift({ ...item, createdAt: new Date().toISOString(), report: existing?.report })
    localStorage.setItem(KEY, JSON.stringify(filtered.slice(0, MAX_ITEMS)))
  } catch {
    // localStorage unavailable
  }
}

export function updateLocalHistoryReport(data: string, report: string): void {
  try {
    const list = readLocalHistory()
    const target = list.find((h) => h.data === data)
    if (!target) return
    target.report = report
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    // localStorage unavailable
  }
}
