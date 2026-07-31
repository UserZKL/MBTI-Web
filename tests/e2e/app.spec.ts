import { test, expect } from "@playwright/test"

const DEVICE_SIZES = [
  { name: "small phone", width: 320, height: 568 },
  { name: "phone", width: 375, height: 667 },
  { name: "large phone", width: 414, height: 896 },
  { name: "tablet", width: 768, height: 1024 },
]

const CRITICAL_PAGES = [
  { path: "/", name: "Landing" },
  { path: "/test", name: "Test" },
  { path: "/types", name: "All Types" },
  { path: "/types/INTJ", name: "Type Detail" },
  { path: "/blog", name: "Blog List" },
  { path: "/blog/mbti-guide", name: "Blog Post" },
  { path: "/compare", name: "Compare" },
  { path: "/stats", name: "Stats" },
  { path: "/login", name: "Login" },
  { path: "/profile", name: "Profile" },
]

test.describe("Flow 1: Complete Test Journey", () => {
  test("should complete full test flow and see result", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("h1")).toContainText("人格")

    const startBtn = page.getByRole("link", { name: /开始测试|免费/ })
    await startBtn.first().click()
    await page.waitForURL("/test")
    await expect(page.locator("h2")).toBeVisible()

    for (let i = 0; i < 60; i++) {
      const agreeBtn = page.getByRole("button", { name: "符合" })
      await agreeBtn.waitFor({ state: "visible", timeout: 10000 })
      await agreeBtn.click()
      await page.waitForTimeout(350)
    }

    await page.waitForURL("/result?data=*", { timeout: 15000 })
    await expect(page.locator("h1")).toBeVisible()
    await expect(page.locator("text=查看所有类型").first()).toBeVisible()
    await expect(page.locator("text=再测一次").first()).toBeVisible()
  })
})

test.describe("Flow 2: Type Browsing", () => {
  test("should browse all types and view a detail page", async ({ page }) => {
    await page.goto("/types")
    await expect(page.locator("h1")).toContainText("十六种人格类型")

    const cards = page.locator("a[href^='/types/']")
    await expect(cards).toHaveCount(16)

    await cards.first().click()
    await page.waitForURL("/types/**")

    await expect(page.locator("h1")).toBeVisible()
    await expect(page.getByText("优势")).toBeVisible()
    await expect(page.getByText("适合职业")).toBeVisible()
    await expect(page.getByText("成长建议")).toBeVisible()
  })
})

test.describe("Flow 3: Login Page", () => {
  test("should render login page with Google button", async ({ page }) => {
    await page.goto("/login")
    await expect(page.locator("h1")).toContainText("登录")
    await expect(page.getByRole("button", { name: /Google/ })).toBeVisible()
  })
})

test.describe("Flow 4: Blog Browsing", () => {
  test("should browse blog list and read an article", async ({ page }) => {
    await page.goto("/blog")
    await expect(page.locator("h1")).toContainText("博客")

    const articleCards = page.locator("a[href^='/blog/']")
    const count = await articleCards.count()
    expect(count).toBeGreaterThanOrEqual(1)

    await articleCards.first().click()
    await page.waitForURL("/blog/**")

    await expect(page.locator("h1")).toBeVisible()
    await expect(page.getByText("返回博客").first()).toBeVisible()
  })
})

test.describe("Flow 5: Responsive Breakpoints", () => {
  for (const device of DEVICE_SIZES) {
    for (const pageInfo of CRITICAL_PAGES) {
      test(`${pageInfo.name} page at ${device.name} (${device.width}px)`, async ({ page }) => {
        await page.setViewportSize({ width: device.width, height: device.height })
        await page.goto(pageInfo.path)

        const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
        const viewportWidth = device.width
        expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1)

        const html = page.locator("html")
        const overflowX = await html.evaluate((el) =>
          getComputedStyle(el).overflowX
        )
        expect(overflowX).not.toBe("hidden")

        await expect(page.locator("body")).toBeVisible()
      })
    }
  }
})
