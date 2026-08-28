import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { chromium } from "playwright";

function channel(value) {
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance(rgb) {
  const channels = rgb
    .match(/\d+(?:\.\d+)?/g)
    ?.slice(0, 3)
    .map((value) => Number(value) / 255);
  assert.ok(channels?.length === 3, `Could not parse ${rgb}`);
  return 0.2126 * channel(channels[0]) + 0.7152 * channel(channels[1]) + 0.0722 * channel(channels[2]);
}

function contrast(foreground, background) {
  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

const browser = await chromium.launch();
const widths = [1280, 768, 390, 320];
const report = [];

for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: 1000 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173", { waitUntil: "networkidle" });

  const overflow = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  assert.ok(
    overflow.scrollWidth <= overflow.clientWidth + 1,
    `Horizontal overflow at ${width}px: ${overflow.scrollWidth} > ${overflow.clientWidth}`,
  );

  const selectDemo = page
    .locator("#fields .docs-demo")
    .filter({ has: page.getByText("Select", { exact: true }) });
  const selectTrigger = selectDemo.getByRole("combobox", { name: "Theme" });
  await selectTrigger.click();
  const popup = page.locator(".greyui-select-popup");
  await popup.waitFor({ state: "visible" });

  const selectMetrics = await popup.evaluate((node) => {
    const popupBox = node.getBoundingClientRect();
    const items = Array.from(node.querySelectorAll(".greyui-select-item"));
    return {
      popup: {
        left: popupBox.left,
        right: popupBox.right,
        width: popupBox.width,
      },
      items: items.map((item) => {
        const text = item.querySelector(".greyui-select-item-text");
        if (!(item instanceof HTMLElement) || !(text instanceof HTMLElement)) {
          return null;
        }
        const itemBox = item.getBoundingClientRect();
        const textStyle = getComputedStyle(text);
        return {
          label: text.textContent?.trim() ?? "",
          itemHeight: itemBox.height,
          clientHeight: text.clientHeight,
          scrollHeight: text.scrollHeight,
          whiteSpace: textStyle.whiteSpace,
        };
      }),
    };
  });
  assert.equal(selectMetrics.items.length, 3);
  assert.ok(selectMetrics.items.every((item) => item !== null));
  for (const item of selectMetrics.items) {
    assert.ok(item);
    assert.equal(item.whiteSpace, "nowrap");
    assert.ok(item.scrollHeight <= item.clientHeight + 1, `${item.label} wrapped at ${width}px`);
    assert.ok(item.itemHeight <= 30, `${item.label} is unexpectedly tall at ${width}px`);
  }
  const triggerBox = await selectTrigger.boundingBox();
  assert.ok(triggerBox);
  assert.ok(selectMetrics.popup.width >= triggerBox.width - 1);
  assert.ok(selectMetrics.popup.left >= -1);
  assert.ok(selectMetrics.popup.right <= width + 1);
  await page.locator("#fields").screenshot({
    path: `artifacts/select-groups-imports/fields-select-${width}.png`,
  });
  await page.keyboard.press("Escape");

  const groupMetrics = await page.locator("#high-value").evaluate((section) => {
    const panel = getComputedStyle(document.documentElement).getPropertyValue("--greyui-panel").trim();
    const canvases = Array.from(section.querySelectorAll(".docs-high-value-demo-canvas"));
    const fieldsets = Array.from(section.querySelectorAll(".greyui-fieldset"));
    const accordionPanels = Array.from(section.querySelectorAll(".greyui-accordion-panel"));
    return {
      panel,
      canvasBackgrounds: canvases.map((node) => getComputedStyle(node).backgroundColor),
      fieldsetBackgrounds: fieldsets.map((node) => getComputedStyle(node).backgroundColor),
      accordionBackgrounds: accordionPanels.map((node) => getComputedStyle(node).backgroundColor),
    };
  });
  const expectedPanel = "rgb(216, 216, 216)";
  assert.equal(groupMetrics.panel.toLowerCase(), "#d8d8d8");
  assert.ok(groupMetrics.canvasBackgrounds.every((value) => value === expectedPanel));
  assert.ok(groupMetrics.fieldsetBackgrounds.every((value) => value === expectedPanel));
  assert.ok(groupMetrics.accordionBackgrounds.every((value) => value === expectedPanel));
  await page.locator("#high-value").screenshot({
    path: `artifacts/select-groups-imports/grouped-controls-${width}.png`,
  });

  const importRows = page.locator(".docs-section-import");
  assert.equal(await importRows.count(), 13);
  const importMetrics = await importRows.evaluateAll((rows) =>
    rows.map((row) => {
      const box = row.getBoundingClientRect();
      const style = getComputedStyle(row);
      const code = row.querySelector(".docs-copy-command-text");
      const codeStyle = code ? getComputedStyle(code) : null;
      const section = row.closest(".docs-section");
      const children = section ? Array.from(section.children) : [];
      return {
        section: section?.id ?? null,
        childIndex: children.indexOf(row),
        left: box.left,
        right: box.right,
        background: style.backgroundColor,
        color: style.color,
        borderWidth: style.borderTopWidth,
        whiteSpace: codeStyle?.whiteSpace ?? null,
        textOverflow: codeStyle?.textOverflow ?? null,
        text: code?.textContent ?? "",
        scrollWidth: code instanceof HTMLElement ? code.scrollWidth : 0,
        clientWidth: code instanceof HTMLElement ? code.clientWidth : 0,
      };
    }),
  );
  for (const metric of importMetrics) {
    assert.equal(metric.childIndex, 2, `${metric.section} import is misplaced`);
    assert.ok(metric.left >= -1);
    assert.ok(metric.right <= width + 1);
    assert.equal(metric.background, expectedPanel);
    assert.equal(metric.borderWidth, "1px");
    assert.equal(metric.whiteSpace, "pre-wrap");
    assert.equal(metric.textOverflow, "clip");
    assert.ok(metric.text.includes('from "greyui/components/'));
    assert.ok(contrast(metric.color, metric.background) >= 7);
    assert.ok(metric.scrollWidth <= metric.clientWidth + 1);
  }

  const fieldsImport = page.locator("#fields > .docs-section-import");
  const fieldsStatement =
    (await fieldsImport.locator(".docs-copy-command-text").textContent()) ?? "";
  assert.ok(fieldsStatement.includes("\n"));
  assert.ok(
    fieldsStatement.includes('import { Input, Textarea } from "greyui/components/input";'),
  );
  const copyButton = fieldsImport.getByRole("button", { name: "Copy Fields import" });
  await copyButton.click();
  await page.waitForFunction(
    () =>
      document.querySelector("#fields .docs-copy-command")?.getAttribute("data-copied") === "true",
  );
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), fieldsStatement);
  await page.locator("#fields").screenshot({
    path: `artifacts/select-groups-imports/fields-imports-${width}.png`,
  });

  report.push({ width, overflow, selectMetrics, groupMetrics, importMetrics });
  await context.close();
}

await browser.close();
await writeFile(
  "artifacts/select-groups-imports/report.json",
  `${JSON.stringify(report, null, 2)}\n`,
);
