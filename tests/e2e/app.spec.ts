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

async function completeTest(page: import("@playwright/test").Page, answer: "符合" | "不符合" = "符合") {
  for (let pageNum = 0; pageNum < 6; pageNum++) {
    for (let i = 0; i < 10; i++) {
      const qId = pageNum * 10 + i + 1
      const btn = page.getByRole("button", { name: `第 ${qId} 题 ${answer}` })
      await btn.waitFor({ state: "visible", timeout: 10000 })
      await btn.click({ force: true })
    }
    if (pageNum < 5) {
      await page.getByRole("button", { name: "下一页" }).click({ force: true })
      await expect(page.getByRole("button", { name: `第 ${(pageNum + 1) * 10 + 1} 题 ${answer}` })).toBeVisible()
    } else {
      await page.getByRole("button", { name: "查看结果" }).click({ force: true })
    }
  }
}

test.describe("Flow 1: Complete Test Journey", () => {
  test("should complete full test flow and see result", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("h1")).toContainText("人格")

    const startBtn = page.getByRole("link", { name: /开始测试|免费/ })
    await startBtn.first().click()
    await page.waitForURL("/test")
    await expect(page.locator("h2").first()).toBeVisible()

    await completeTest(page)

    await page.waitForURL("/result?data=*", { timeout: 30000 })
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
  test("should render login page with email form", async ({ page }) => {
    await page.goto("/login")
    await expect(page.locator("h1")).toContainText("登录")
    await expect(page.getByLabel("邮箱地址")).toBeVisible()
    await expect(page.getByRole("button", { name: /发送验证码/ })).toBeVisible()
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
    await expect(page.getByRole("link", { name: "首页" }).first()).toBeVisible()
  })
})

test.describe("Flow 6: Incomplete Test Guard", () => {
  test("should block page navigation when questions are unanswered", async ({ page }) => {
    await page.goto("/test")

    await expect(page.getByRole("button", { name: "第 1 题 符合" })).toBeVisible()

    // 只答 1 题后点击下一页 → 被拦截并标红
    await page.getByRole("button", { name: "第 1 题 符合" }).click({ force: true })
    await page.getByRole("button", { name: "下一页" }).click({ force: true })

    await expect(page).toHaveURL(/\/test/)
    await expect(page.getByRole("alert").first()).toBeVisible()
    await expect(page.getByText(/未作答/)).toBeVisible()
    await expect(page.getByRole("button", { name: "第 11 题 符合" })).toBeHidden()

    // 补答本页剩余 9 题后翻页成功
    for (let i = 2; i <= 10; i++) {
      await page.getByRole("button", { name: `第 ${i} 题 不符合` }).click({ force: true })
    }
    await page.getByRole("button", { name: "下一页" }).click({ force: true })
    await expect(page.getByRole("button", { name: "第 11 题 符合" })).toBeVisible({ timeout: 10000 })
  })
})

test.describe("Flow 7: Result Save & Share", () => {
  test("should auto-save result after full test", async ({ page }) => {
    await page.goto("/test")

    await completeTest(page)

    await page.waitForURL("/result?data=*", { timeout: 30000 })
    await expect(page.getByText(/已保存/)).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole("button", { name: /生成 AI 报告/ })).toBeVisible()
  })

  test("should open share card dialog from share page", async ({ page }) => {
    await page.goto("/share/INTJ")
    await expect(page.locator("h1")).toContainText("建筑师")
    await expect(page.getByRole("button", { name: /生成分享卡片/ })).toBeVisible()

    await page.getByRole("button", { name: /生成分享卡片/ }).click()
    await expect(page.getByText("分享卡片已生成")).toBeVisible({ timeout: 15000 })
  })
})

test.describe("Flow 8: Legal Pages & 404", () => {
  test("should render terms and privacy pages", async ({ page }) => {
    await page.goto("/terms")
    await expect(page.locator("h1")).toContainText("服务条款")
    await page.goto("/privacy")
    await expect(page.locator("h1")).toContainText("隐私政策")
  })

  test("should return 404 for invalid type code", async ({ page }) => {
    const response = await page.goto("/types/XXXX")
    expect(response?.status()).toBe(404)
  })

  test("should return 404 for invalid share slug", async ({ page }) => {
    const response = await page.goto("/share/INVALID")
    expect(response?.status()).toBe(404)
  })
})

test.describe("Flow 9: V2 Homepage & Navigation", () => {
  test("should show explore cards linking to blog/compare/stats", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("link", { name: /MBTI 博客/ }).first()).toBeVisible()
    await expect(page.getByRole("link", { name: /对比类型/ }).first()).toBeVisible()
    await expect(page.getByRole("link", { name: /统计数据/ }).first()).toBeVisible()

    await page.getByRole("link", { name: /MBTI 博客/ }).first().click()
    await page.waitForURL("/blog")
    await expect(page.locator("h1")).toContainText("博客")

    await page.goto("/")
    await page.getByRole("link", { name: /对比类型/ }).first().click()
    await page.waitForURL("/compare")
    await expect(page.locator("h1")).toContainText("对比")

    await page.goto("/")
    await page.getByRole("link", { name: /统计数据/ }).first().click()
    await page.waitForURL("/stats")
    await expect(page.locator("h1")).toContainText("统计")
  })

  test("should show floating back/home buttons on subpages", async ({ page }) => {
    await page.goto("/types")
    await expect(page.getByRole("link", { name: "返回首页" })).toBeVisible()
    await expect(page.getByRole("button", { name: "返回上一页" })).toBeVisible()
  })

  test("should show last result entry from localStorage on homepage", async ({ page }) => {
    const data = Buffer.from(
      JSON.stringify(Array.from({ length: 60 }, (_, i) => ({ questionId: i + 1, answer: "agree" })))
    ).toString("base64")
    await page.addInitScript(
      (d) => {
        localStorage.setItem(
          "mbti-history",
          JSON.stringify([{ typeCode: "INTJ", typeName: "建筑师", createdAt: new Date().toISOString(), data: d }])
        )
      },
      data
    )
    await page.goto("/")
    await expect(page.getByRole("link", { name: /查看上次结果/ })).toBeVisible()
    await page.getByRole("link", { name: /查看上次结果/ }).click()
    await page.waitForURL("/result?data=*")
    await expect(page.locator("h1")).toBeVisible()
  })

  test("should show local history on profile when not logged in", async ({ page }) => {
    const data = Buffer.from(
      JSON.stringify(Array.from({ length: 60 }, (_, i) => ({ questionId: i + 1, answer: "disagree" })))
    ).toString("base64")
    await page.addInitScript(
      (d) => {
        localStorage.setItem(
          "mbti-history",
          JSON.stringify([{ typeCode: "ESFP", typeName: "表演者", createdAt: new Date().toISOString(), data: d }])
        )
      },
      data
    )

    await page.goto("/profile")
    await expect(page.locator("h1")).toContainText("未登录用户")
    await expect(page.getByText("本地测试记录")).toBeVisible()
    await expect(page.getByRole("link", { name: /查看 表演者 测试结果/ })).toBeVisible()
  })

  test("should show PersonAvatar on result page", async ({ page }) => {
    const data = Buffer.from(
      JSON.stringify(Array.from({ length: 60 }, (_, i) => ({ questionId: i + 1, answer: "agree" })))
    ).toString("base64")
    await page.goto(`/result?data=${data}`)
    await expect(page.getByRole("img", { name: /人格形象/ })).toBeVisible()
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
