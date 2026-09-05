import { expect, test } from "@playwright/test";

// Vite transforms this dev-only HTML entry; the production docs build uses index.html.
const fixtureUrl = "/__tests__/rendering.html";

for (const width of [1280, 768, 390, 320]) {
  test(`meter fill matches its values at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(fixtureUrl);
    const meter = page.getByRole("meter", { name: "Storage allocation", exact: true });
    const geometry = await meter.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      const styles = getComputedStyle(element);
      return {
        inner:
          bounds.width - parseFloat(styles.borderLeftWidth) - parseFloat(styles.borderRightWidth),
        segments: [...element.children].map((child) => child.getBoundingClientRect().width),
      };
    });
    expect(geometry.segments[0]).toBeCloseTo(geometry.inner * 0.2, 0);
    expect(geometry.segments[1]).toBeCloseTo(geometry.inner * 0.3, 0);
    const empty = page.getByRole("meter", { name: "Empty capacity", exact: true });
    expect(await empty.locator(".greyui-segmented-meter-segment:visible").count()).toBe(0);
    await meter.locator("..").screenshot({ path: testInfo.outputPath("meters.png") });
  });

  test(`tabs follow their orientation and contain labels at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(fixtureUrl);
    const fixture = page.locator('[data-rendering-review="tabs"]');
    const vertical = fixture.locator('.greyui-tabs[data-orientation="vertical"]');
    const general = vertical.getByRole("tab", { name: "General", exact: true });
    const appearance = vertical.getByRole("tab", { name: "Appearance", exact: true });
    const [first, second] = await vertical
      .locator(":scope > .greyui-tabs-list > .greyui-tab")
      .evaluateAll((tabs) =>
        tabs.map((tab) => {
          const { x, y, height } = tab.getBoundingClientRect();
          return { x, y, height };
        }),
      );
    if (!first || !second) throw new Error("Expected visible tabs");
    expect(second.y).toBeGreaterThanOrEqual(first.y + first.height);
    expect(second.x).toBeCloseTo(first.x, 0);
    await general.focus();
    await general.press("ArrowDown");
    await expect(appearance).toBeFocused();
    await appearance.press("Enter");
    await expect(appearance).toHaveAttribute("aria-selected", "true");
    await appearance.press("ArrowDown");
    const advanced = vertical.getByRole("tab", { name: "Advanced", exact: true });
    await expect(advanced).toBeFocused();
    await advanced.press("Enter");
    await expect(appearance).toHaveAttribute("aria-selected", "true");
    await expect(advanced).toHaveCSS("opacity", "0.5");
    await advanced.press("Home");
    await expect(general).toBeFocused();
    const panel = vertical.locator(":scope > .greyui-tab-panel:visible");
    const nested = panel.locator(".greyui-tabs");
    await expect(nested.getByRole("tablist")).toHaveCSS("flex-direction", "row");
    await nested.getByRole("tab", { name: "Text", exact: true }).click();
    await expect(nested.getByRole("tabpanel")).toHaveText("Text and font settings.");
    await expect(appearance).toHaveAttribute("aria-selected", "true");
    const failures = await fixture.evaluate((element) =>
      [...element.querySelectorAll<HTMLElement>(".greyui-tabs")].flatMap((tabs) => {
        const right = tabs.getBoundingClientRect().right;
        return [...tabs.querySelectorAll<HTMLElement>(".greyui-tab")]
          .filter((tab) => tab.getBoundingClientRect().right > right + 1)
          .map((tab) => tab.textContent);
      }),
    );
    expect(failures).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width,
    );
    await fixture.screenshot({ path: testInfo.outputPath("tabs.png") });
  });

  test(`toolbar groups stay usable in narrow containers at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(fixtureUrl);
    const toolbar = page.getByRole("toolbar", { name: "Compact document toolbar" });
    const input = toolbar.getByRole("textbox", { name: "Search documents" });
    const geometry = await toolbar.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      return {
        width: bounds.width,
        scroll: element.scrollWidth,
        escaped: [...element.querySelectorAll("button, input")].some(
          (child) => child.getBoundingClientRect().right > bounds.right + 1,
        ),
      };
    });
    expect(geometry.scroll).toBeLessThanOrEqual(Math.ceil(geometry.width));
    expect(geometry.escaped).toBe(false);
    await input.fill("Calibration");
    await expect(input).toBeFocused();
    await expect(input).toHaveValue("Calibration");
    const vertical = page.getByRole("toolbar", { name: "Vertical document toolbar" });
    const buttons = vertical.getByRole("button");
    const [top, next] = await buttons.evaluateAll((items) =>
      items.map((item) => {
        const { y, height } = item.getBoundingClientRect();
        return { y, height };
      }),
    );
    if (!top || !next) throw new Error("Expected vertical toolbar buttons");
    expect(next.y).toBeGreaterThanOrEqual(top.y + top.height);
    await toolbar.getByRole("button", { name: "Open document…" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(input).toBeFocused();
    await toolbar.locator("..").screenshot({ path: testInfo.outputPath("toolbar.png") });
  });
}
