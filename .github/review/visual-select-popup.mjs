import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch();
const widths = [1280, 768, 390, 320];
const expectedLabels = ["BeOS R5", "Haiku", "Inactive"];

for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173", { waitUntil: "networkidle" });

  const selectDemo = page
    .locator("#fields .docs-demo")
    .filter({ has: page.getByText("Select", { exact: true }) });
  const trigger = selectDemo.getByRole("combobox", { name: "Theme" });
  await trigger.click();

  const popup = page.locator(".greyui-select-popup");
  await popup.waitFor({ state: "visible" });
  const metrics = await popup.evaluate((node) => {
    const box = node.getBoundingClientRect();
    return {
      popup: { left: box.left, right: box.right, width: box.width },
      items: Array.from(node.querySelectorAll(".greyui-select-item")).map((item) => {
        const text = item.querySelector(".greyui-select-item-text");
        if (!(item instanceof HTMLElement) || !(text instanceof HTMLElement)) return null;
        const itemBox = item.getBoundingClientRect();
        return {
          label: text.textContent?.trim() ?? "",
          whiteSpace: getComputedStyle(text).whiteSpace,
          itemHeight: itemBox.height,
          clientWidth: text.clientWidth,
          scrollWidth: text.scrollWidth,
          clientHeight: text.clientHeight,
          scrollHeight: text.scrollHeight,
        };
      }),
    };
  });

  assert.deepEqual(
    metrics.items.map((item) => item?.label),
    expectedLabels,
  );
  for (const item of metrics.items) {
    assert.ok(item);
    assert.equal(item.whiteSpace, "nowrap");
    assert.ok(item.scrollHeight <= item.clientHeight + 1, `${item.label} wrapped at ${width}px`);
    assert.ok(item.scrollWidth <= item.clientWidth + 1, `${item.label} was truncated at ${width}px`);
    assert.ok(item.itemHeight <= 30, `${item.label} is unexpectedly tall at ${width}px`);
  }

  const triggerBox = await trigger.boundingBox();
  assert.ok(triggerBox);
  assert.ok(metrics.popup.width >= triggerBox.width - 1);
  assert.ok(metrics.popup.left >= -1);
  assert.ok(metrics.popup.right <= width + 1);
  await page.locator("#fields").screenshot({
    path: `artifacts/select-popup/select-${width}.png`,
  });

  await context.close();
}

await browser.close();
