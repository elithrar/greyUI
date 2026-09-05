import { expect, test } from "@playwright/test";

for (const width of [1280, 768, 390, 320]) {
  test(`component API examples work at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    const groupedControls = page.locator("#high-value");
    await groupedControls.scrollIntoViewIfNeeded();
    await groupedControls.screenshot({ path: testInfo.outputPath("grouped-controls.png") });
    const managedSwitch = page.getByRole("switch", { name: "Managed autosave" });
    await expect(managedSwitch).toBeDisabled();
    await expect(managedSwitch).toHaveAttribute("data-disabled", "");

    const input = page.getByRole("combobox", { name: "Operating system" });
    await input.click();
    const suggestions = page.locator(".greyui-autocomplete-popup:visible");
    await expect(suggestions.getByText("BeOS family", { exact: true })).toBeVisible();
    await expect(suggestions.getByRole("option", { name: "Haiku" })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("grouped-suggestions.png") });
    const bounds = await suggestions.boundingBox();
    expect(bounds).not.toBeNull();
    if (!bounds) throw new Error("Expected suggestions popup");
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    await input.fill("Haiku");
    await suggestions.getByRole("option", { name: "Haiku" }).click();
    await expect(input).toHaveValue("Haiku");
    await expect(suggestions).not.toBeVisible();

    const empty = page.locator(".greyui-empty");
    await expect(empty.getByRole("button", { name: "Open ROM…" })).toBeVisible();
    await empty.screenshot({ path: testInfo.outputPath("empty-children.png") });

    await page.getByRole("button", { name: "Open dialog…" }).click();
    const dialog = page.getByRole("dialog", { name: "Enable edit mode" });
    await expect(dialog).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("rich-dialog-title.png") });
    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).not.toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width,
    );
  });
}
