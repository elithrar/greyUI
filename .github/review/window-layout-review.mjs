import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const browser = await chromium.launch();
const widths = [1280, 768, 390, 320];
const report = [];

for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: 1100 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173", { waitUntil: "networkidle" });

  const pageSize = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  assert.ok(pageSize.scrollWidth <= pageSize.clientWidth + 1, `page overflow at ${width}px`);

  const dense = page.locator(".docs-dense-window");
  await dense.scrollIntoViewIfNeeded();
  const metrics = await dense.evaluate((windowNode) => {
    const rect = (element) => {
      const box = element.getBoundingClientRect();
      return {
        left: box.left,
        top: box.top,
        right: box.right,
        bottom: box.bottom,
        width: box.width,
        height: box.height,
      };
    };
    const body = windowNode.querySelector(".greyui-window-body");
    const tab = windowNode.querySelector(".greyui-window-tab");
    const content = windowNode.querySelector(".greyui-window-content");
    const actions = windowNode.querySelector(".greyui-window-actions");
    const menu = windowNode.querySelector(".greyui-menubar");
    const status = windowNode.querySelector(".greyui-statusbar");
    const button = Array.from(windowNode.querySelectorAll("button")).find(
      (node) => node.textContent?.trim() === "Copy link",
    );
    if (!body || !tab || !content || !actions || !menu || !status || !button) {
      throw new Error("Dense window is missing a canonical layout rail");
    }
    const styles = (element) => {
      const style = getComputedStyle(element);
      return {
        borderTop: style.borderTopWidth,
        borderRight: style.borderRightWidth,
        borderBottom: style.borderBottomWidth,
        borderLeft: style.borderLeftWidth,
        overflow: style.overflow,
      };
    };
    return {
      window: rect(windowNode),
      body: rect(body),
      tab: rect(tab),
      content: rect(content),
      actions: rect(actions),
      button: rect(button),
      menu: rect(menu),
      status: rect(status),
      bodyStyle: styles(body),
      menuStyle: styles(menu),
      statusStyle: styles(status),
    };
  });

  assert.ok(metrics.button.right <= metrics.content.right + 1, `Copy link escapes content at ${width}px`);
  assert.ok(metrics.actions.right <= metrics.content.right + 1, `Window.Actions escapes content at ${width}px`);
  assert.ok(metrics.content.left >= metrics.body.left - 1);
  assert.ok(metrics.content.right <= metrics.body.right + 1);
  assert.equal(metrics.menuStyle.borderLeft, "0px");
  assert.equal(metrics.menuStyle.borderRight, "0px");
  assert.equal(metrics.statusStyle.borderLeft, "0px");
  assert.equal(metrics.statusStyle.borderRight, "0px");

  if (width > 768) {
    assert.ok(Math.abs(metrics.tab.left - metrics.window.left) <= 1, "tab no longer aligns to outer frame");
    assert.ok(Math.abs(metrics.body.left - (metrics.window.left + 3)) <= 1, "body left rail is not 3px inset");
    assert.ok(Math.abs(metrics.window.right - metrics.body.right - 3) <= 1, "body right rail is not 3px inset");
    assert.ok(Math.abs(metrics.body.top - metrics.tab.bottom) <= 1, "tab/body frames overlap or gap");
    assert.equal(metrics.bodyStyle.borderLeft, "1px");
  }

  const inactive = page.locator('.greyui-window[data-active="false"]').first();
  if ((await inactive.count()) > 0) {
    await inactive.scrollIntoViewIfNeeded();
    const inactiveGeometry = await inactive.evaluate((node) => {
      const tab = node.querySelector(".greyui-window-tab");
      const body = node.querySelector(".greyui-window-body");
      if (!tab || !body) throw new Error("Inactive window missing tab/body");
      const tabBox = tab.getBoundingClientRect();
      const bodyBox = body.getBoundingClientRect();
      return {
        tabBottom: tabBox.bottom,
        bodyTop: bodyBox.top,
        tabLeft: tabBox.left,
        windowLeft: node.getBoundingClientRect().left,
      };
    });
    if (width > 768) {
      assert.ok(Math.abs(inactiveGeometry.bodyTop - inactiveGeometry.tabBottom) <= 1);
      assert.ok(Math.abs(inactiveGeometry.tabLeft - inactiveGeometry.windowLeft) <= 1);
    }
  }

  await dense.screenshot({ path: `artifacts/window-layout/dense-${width}.png` });
  await page.locator("#window").screenshot({ path: `artifacts/window-layout/windows-${width}.png` });
  report.push({ width, pageSize, metrics });
  await context.close();
}

await browser.close();
await writeFile("artifacts/window-layout/report.json", `${JSON.stringify(report, null, 2)}\n`);
