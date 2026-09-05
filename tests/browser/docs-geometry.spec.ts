import { expect, test, type Locator, type Page } from "@playwright/test";

const viewports = [
  { width: 1280, height: 900 },
  { width: 768, height: 900 },
  { width: 390, height: 844 },
  { width: 320, height: 720 },
] as const;

for (const viewport of viewports) {
  test(`window fixtures stay contained at ${viewport.width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const suite = page.locator("[data-regression-suite='window-containers']");
    await suite.scrollIntoViewIfNeeded();
    await expect(suite).toBeVisible();

    const failures = await page.evaluate(() => {
      const messages: string[] = [];
      if (document.documentElement.scrollWidth > document.documentElement.clientWidth) {
        const rightmost = Array.from(document.querySelectorAll<HTMLElement>("body *"))
          .map((element) => ({
            element,
            right: element.getBoundingClientRect().right,
          }))
          .filter(({ right }) => right > document.documentElement.clientWidth)
          .sort((first, second) => second.right - first.right)
          .slice(0, 3)
          .map(({ element, right }) => `${element.tagName}.${element.className} at ${right}px`);
        messages.push(
          `document overflows horizontally (${document.documentElement.scrollWidth}px > ${document.documentElement.clientWidth}px): ${rightmost.join(", ")}`,
        );
      }

      for (const fixture of document.querySelectorAll<HTMLElement>(
        "[data-regression-case='window']",
      )) {
        const frame = fixture.querySelector<HTMLElement>("[data-regression-frame='window']");
        if (frame === null) continue;
        const frameRect = frame.getBoundingClientRect();
        for (const child of frame.querySelectorAll<HTMLElement>(
          "[data-regression-contained], .greyui-window-tab, .greyui-window-body, .greyui-menubar, .greyui-field-action-row-layout > *, .greyui-statusbar",
        )) {
          if (
            child.hidden ||
            child.closest("[hidden]") !== null ||
            child.getAttribute("aria-hidden") === "true"
          ) {
            continue;
          }
          const childRect = child.getBoundingClientRect();
          if (childRect.left < frameRect.left - 1 || childRect.right > frameRect.right + 1) {
            messages.push(`${fixture.dataset.regressionWidth}px fixture escapes its frame`);
          }
        }
      }
      return messages;
    });

    await suite.locator("[data-regression-width='760']").screenshot({
      path: testInfo.outputPath("application-window.png"),
    });
    expect(await headerTextOverlaps(page)).toEqual([]);
    expect(failures).toEqual([]);

    const windowSurfaceFailures = await page.evaluate(() => {
      const messages: string[] = [];
      for (const windowRoot of document.querySelectorAll<HTMLElement>(".greyui-window")) {
        const windowRect = windowRoot.getBoundingClientRect();
        for (const child of windowRoot.querySelectorAll<HTMLElement>(
          ".greyui-window-frame, .greyui-window-tab, .greyui-window-body, .greyui-window-content, .greyui-window-header, .greyui-window-actions, .greyui-field-action-row-layout > *, .greyui-menubar, .greyui-statusbar",
        )) {
          if (
            child.hidden ||
            child.closest("[hidden]") !== null ||
            child.getAttribute("aria-hidden") === "true"
          ) {
            continue;
          }
          const childRect = child.getBoundingClientRect();
          if (childRect.left < windowRect.left - 1 || childRect.right > windowRect.right + 1) {
            messages.push(
              `${child.getAttribute("data-greyui-component") ?? child.className} escapes ${windowRoot.textContent?.slice(0, 32) ?? "window"}`,
            );
          }
        }
      }
      return messages;
    });

    expect(windowSurfaceFailures).toEqual([]);

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
      await expectFloatingFrameRail(suite, 520);
      await expectFloatingFrameRail(suite, 640);
      await expectFloatingFrameRail(suite, 820);
      await expectStackedTitleJoin(suite, 280);
      await expectStackedTitleJoin(suite, 760);
    }
  });
}

async function expectFloatingFrameRail(suite: Locator, width: number) {
  const geometry = await windowGeometry(suite, width);

  expect(geometry.framePaddingTop).toBe(geometry.tabHeight + 3);
  expect(geometry.bodyTop - geometry.tabBottom).toBeCloseTo(3, 5);
}

async function expectStackedTitleJoin(suite: Locator, width: number) {
  const geometry = await windowGeometry(suite, width);

  expect(geometry.bodyTop - geometry.tabBottom).toBeCloseTo(0, 5);
}

async function windowGeometry(suite: Locator, width: number) {
  return suite.locator(`[data-regression-width='${width}']`).evaluate((fixture) => {
    const frame = fixture.querySelector<HTMLElement>(".greyui-window-frame");
    const tab = fixture.querySelector<HTMLElement>(".greyui-window-tab");
    const body = fixture.querySelector<HTMLElement>(".greyui-window-body");
    if (frame === null || tab === null || body === null) {
      throw new Error(
        `Missing Window geometry for ${fixture.dataset.regressionWidth ?? "unknown"}`,
      );
    }

    const frameStyle = getComputedStyle(frame);
    const tabRect = tab.getBoundingClientRect();
    const bodyRect = body.getBoundingClientRect();

    return {
      bodyTop: bodyRect.top,
      framePaddingTop: Number.parseFloat(frameStyle.paddingTop),
      tabBottom: tabRect.bottom,
      tabHeight: tabRect.height,
    };
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

test("anchored overlays do not shift the docs page", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  await expectNoPageShift(
    page,
    page.getByText("Right-click this Tracker row", { exact: true }),
    async (trigger) => trigger.click({ button: "right" }),
    page.locator(".greyui-context-menu-popup:visible"),
  );
  await expectNoPageShift(
    page,
    page.locator(".greyui-menu-trigger", { hasText: "Actions" }),
    async (trigger) => trigger.click(),
    page.locator(".greyui-menu-popup:visible"),
  );
  await expectNoPageShift(
    page,
    page.locator("[data-regression-suite='window-containers']").getByRole("combobox").first(),
    async (trigger) => trigger.click(),
    page.locator(".greyui-select-popup:visible"),
  );
  await expectNoPageShift(
    page,
    page.getByPlaceholder("Find a theme…"),
    async (trigger) => trigger.click(),
    page.locator(".greyui-combobox-popup:visible"),
  );
  await expectNoPageShift(
    page,
    page.getByPlaceholder("Type any value…"),
    async (trigger) => trigger.click(),
    page.locator(".greyui-autocomplete-popup:visible"),
  );
});

interface PageGeometry {
  clientWidth: number;
  deskbarLeft: number;
  mainLeft: number;
  mainWidth: number;
  scrollX: number;
  scrollY: number;
}

async function expectNoPageShift(
  page: Page,
  trigger: Locator,
  open: (trigger: Locator) => Promise<void>,
  popup: Locator,
) {
  await trigger.scrollIntoViewIfNeeded();
  const before = await readPageGeometry(page);
  await open(trigger);
  await expect(popup).toBeVisible();
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => resolve(null))));
  expect(await readPageGeometry(page)).toEqual(before);
  await page.keyboard.press("Escape");
  await expect(popup).not.toBeVisible();
}

async function readPageGeometry(page: Page): Promise<PageGeometry> {
  return page.evaluate(() => {
    const main = document.querySelector<HTMLElement>(".docs-main")?.getBoundingClientRect();
    const deskbar = document.querySelector<HTMLElement>(".docs-deskbar")?.getBoundingClientRect();
    if (main === undefined || deskbar === undefined) {
      throw new Error("Expected docs shell geometry");
    }
    return {
      clientWidth: document.documentElement.clientWidth,
      deskbarLeft: deskbar.left,
      mainLeft: main.left,
      mainWidth: main.width,
      scrollX: window.scrollX,
      scrollY: window.scrollY,
    };
  });
}

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

test("window headers adapt across responsive breakpoints", async ({ page }) => {
  await page.goto("/");
  for (const width of [
    360, 375, 393, 414, 428, 519, 520, 521, 619, 620, 621, 767, 769, 820, 1024, 1440,
  ]) {
    // Resize sequentially to exercise transitions in the same mounted components.
    // eslint-disable-next-line no-await-in-loop
    await page.setViewportSize({ width, height: 900 });
    // eslint-disable-next-line no-await-in-loop
    expect(await headerTextOverlaps(page), `Header overlap at ${width}px`).toEqual([]);
    // eslint-disable-next-line no-await-in-loop
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width,
    );
  }
});

async function headerTextOverlaps(page: Page) {
  return page.locator(".greyui-window-header-layout").evaluateAll((headers) =>
    headers.flatMap((header) => {
      const description = header.querySelector(".greyui-window-description");
      const actions = header.querySelector(".greyui-window-actions");
      if (!description || !actions || !description.getClientRects().length) return [];
      const bounds = actions.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(description);
      const overlaps = [...range.getClientRects()].some(
        (line) =>
          line.left < bounds.right &&
          line.right > bounds.left &&
          line.top < bounds.bottom &&
          line.bottom > bounds.top,
      );
      return overlaps
        ? [
            `Description overlaps actions in ${header.closest(".greyui-window")?.querySelector(".greyui-window-title")?.textContent}`,
          ]
        : [];
    }),
  );
}
