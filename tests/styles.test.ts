import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function luminance(hex: string) {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    ?.map((value) => Number.parseInt(value, 16) / 255)
    .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  if (!channels || channels.length !== 3) throw new Error(`Invalid hex color: ${hex}`);
  return 0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!;
}

function contrast(first: string, second: string) {
  const light = Math.max(luminance(first), luminance(second));
  const dark = Math.min(luminance(first), luminance(second));
  return (light + 0.05) / (dark + 0.05);
}

describe("default theme contrast", () => {
  it("keeps white selection text above WCAG AA contrast", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");
    const selection = css.match(/--greyui-selection:\s*(#[0-9a-f]{6})/i)?.[1];
    const text = css.match(/--greyui-selection-text:\s*(#[0-9a-f]{6})/i)?.[1];
    if (!selection || !text) throw new Error("Expected selection color tokens");

    expect(contrast(selection, text)).toBeGreaterThanOrEqual(4.5);
  });

  it("limits mobile window flattening to the stacked responsive mode", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");
    const mobileRules = css.slice(css.indexOf("@media (max-width: 768px)"));

    expect(mobileRules).toContain('.greyui-window[data-responsive="stacked"]');
    expect(mobileRules).not.toContain('.greyui-window[data-responsive="floating"]');
  });

  it("keeps WorkbenchOS typography and window scale tokens aligned", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");

    expect(css).toContain("--greyui-font-size: 12px");
    expect(css).toContain("--greyui-font-size-small: 11px");
    expect(css).toContain("--greyui-tab-height: 26px");
    expect(css).toContain("--greyui-menubar-height: 20px");
    expect(css).toMatch(/\.greyui-button\s*\{[\s\S]*?min-height:\s*1\.85rem/);
    expect(css).toMatch(/\.greyui-button\s*\{[\s\S]*?font-weight:\s*400/);
  });

  it("keeps tooltip and app overlay layers above window-level content", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");
    const overlay = Number(css.match(/--greyui-layer-overlay:\s*(\d+)/)?.[1]);
    const dialog = Number(css.match(/--greyui-layer-dialog:\s*(\d+)/)?.[1]);
    const tooltip = Number(css.match(/--greyui-layer-tooltip:\s*(\d+)/)?.[1]);

    expect(overlay).toBeGreaterThan(1000);
    expect(dialog).toBeGreaterThan(overlay);
    expect(tooltip).toBeGreaterThan(dialog);
  });
});
