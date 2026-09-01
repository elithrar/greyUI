import { expect, test, type Locator, type Page } from "@playwright/test";

const viewports = [
  { width: 1280, height: 900 },
  { width: 768, height: 900 },
  { width: 390, height: 844 },
  { width: 320, height: 720 },
] as const;

for (const viewport of viewports) {
  test(`window fixtures stay contained at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const suite = page.locator("[data-regression-suite='window-containers']");
    await suite.scrollIntoViewIfNeeded();
    await expect(suite).toHaveAttribute("data-regression-geometry", "passed");

    const failures = await page.evaluate(() => {
      const messages: string[] = [];
      if (document.documentElement.scrollWidth > document.documentElement.clientWidth) {
        messages.push("document overflows horizontally");
      }

      for (const fixture of document.querySelectorAll<HTMLElement>(
        "[data-regression-case='window']",
      )) {
        const frame = fixture.querySelector<HTMLElement>("[data-regression-frame='window']");
        if (frame === null) continue;
        const frameRect = frame.getBoundingClientRect();
        for (const child of frame.querySelectorAll<HTMLElement>(
          "[data-regression-contained], .greyui-window-tab, .greyui-window-body, .greyui-menubar, .greyui-statusbar",
        )) {
          if (child.hidden || child.closest("[hidden]") !== null) continue;
          const childRect = child.getBoundingClientRect();
          if (childRect.left < frameRect.left - 1 || childRect.right > frameRect.right + 1) {
            messages.push(`${fixture.dataset.regressionWidth}px fixture escapes its frame`);
          }
        }
      }
      return messages;
    });

    expect(failures).toEqual([]);

    if (viewport.width === 1280) {
      await expect(suite.locator("[data-regression-width='280'] .greyui-window-tab")).toHaveCSS(
        "position",
        "static",
      );
      await expect(suite.locator("[data-regression-width='320'] .greyui-window-tab")).toHaveCSS(
        "border-bottom-width",
        "0px",
      );
      await expect(suite.locator("[data-regression-width='640'] .greyui-window-tab")).toHaveCSS(
        "position",
        "absolute",
      );
      await expect(suite.locator("[data-regression-width='760'] .greyui-window-tab")).toHaveCSS(
        "position",
        "static",
      );
      await expect(suite.locator("[data-regression-width='820'] .greyui-window-tab")).toHaveCSS(
        "position",
        "absolute",
      );
    }
  });
}

test("edge menu and form popups remain inside the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const suite = page.locator("[data-regression-suite='window-containers']");
  await suite.scrollIntoViewIfNeeded();
  await suite.getByRole("menuitem", { name: "Window" }).click();
  await expectViewportContainment(page, page.locator(".greyui-menu-popup:visible"));
  await page.keyboard.press("Escape");

  const select = suite.getByRole("combobox").first();
  await select.click();
  const selectPopup = page.locator(".greyui-select-popup:visible");
  await expectViewportContainment(page, selectPopup);
  const [selectBox, selectPopupBox] = await Promise.all([
    select.boundingBox(),
    selectPopup.boundingBox(),
  ]);
  expect(selectBox).not.toBeNull();
  expect(selectPopupBox).not.toBeNull();
  expect(Math.abs(selectBox!.width - selectPopupBox!.width)).toBeLessThanOrEqual(1);
  await page.keyboard.press("Escape");

  const combobox = page.getByPlaceholder("Find a theme…");
  await combobox.scrollIntoViewIfNeeded();
  await combobox.click();
  await expectViewportContainment(page, page.locator(".greyui-combobox-popup:visible"));
  await page.keyboard.press("Escape");

  const autocomplete = page.getByPlaceholder("Type any value…");
  await autocomplete.scrollIntoViewIfNeeded();
  await autocomplete.click();
  await expectViewportContainment(page, page.locator(".greyui-autocomplete-popup:visible"));
});

test("menus clamp at desktop left and short-viewport bottom edges", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  const fixture = page.locator("[data-regression-width='360']");
  const leftTrigger = fixture.getByRole("menuitem", { name: "File" });
  await leftTrigger.evaluate((element) => element.scrollIntoView({ block: "start" }));
  await leftTrigger.click();
  const leftPopup = page.locator(".greyui-menu-popup:visible");
  await expectViewportContainment(page, leftPopup);
  const [leftTriggerBox, leftPopupBox] = await Promise.all([
    leftTrigger.boundingBox(),
    leftPopup.boundingBox(),
  ]);
  expect(leftTriggerBox).not.toBeNull();
  expect(leftPopupBox).not.toBeNull();
  expect(leftPopupBox!.width).toBeGreaterThan(leftTriggerBox!.x + leftTriggerBox!.width);
  expect(leftPopupBox!.x).toBeGreaterThanOrEqual(0);
  await page.keyboard.press("Escape");

  await page.setViewportSize({ width: 390, height: 320 });
  const bottomTrigger = fixture.getByRole("menuitem", { name: "Window" });
  await bottomTrigger.evaluate((element) => element.scrollIntoView({ block: "end" }));
  await bottomTrigger.click();
  await expectViewportContainment(page, page.locator(".greyui-menu-popup:visible"));
});

async function expectViewportContainment(page: Page, popup: Locator) {
  await expect(popup).toBeVisible();
  const box = await popup.boundingBox();
  const viewport = page.viewportSize();
  expect(box).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height);
}
