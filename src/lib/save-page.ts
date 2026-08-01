export async function buildPageHtml(): Promise<string> {
  const clone = document.documentElement.cloneNode(true) as HTMLElement

  const links = Array.from(clone.querySelectorAll('link[rel="stylesheet"]'))
  for (const link of links) {
    const href = link.getAttribute("href")
    if (!href) {
      link.remove()
      continue
    }
    try {
      const res = await fetch(href)
      if (!res.ok) throw new Error("CSS fetch failed")
      let css = await res.text()
      css = css.replace(
        /url\((['"]?)\/(?!\/)([^'")\s]+)\1\)/g,
        (_m, q: string, p: string) => `url(${q}${window.location.origin}/${p}${q})`
      )
      const style = document.createElement("style")
      style.textContent = css
      link.replaceWith(style)
    } catch {
      link.remove()
    }
  }

  clone.querySelectorAll("script").forEach((s) => s.remove())

  return `<!DOCTYPE html>\n${clone.outerHTML}`
}

export function downloadPageHtml(html: string, filename: string): void {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
