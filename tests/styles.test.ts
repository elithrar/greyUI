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

  it("uses neutral inset keyboard focus without overriding selected button state", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");
    const focusStart = css.indexOf(
      ".greyui-button:focus-visible {",
      css.indexOf("/* Pointer focus"),
    );
    const focusEnd = css.indexOf("}", focusStart);
    const focusRule = css.slice(focusStart, focusEnd);
    const primaryStart = css.indexOf('.greyui-button[data-variant="primary"]');
    const selectedStart = css.indexOf('.greyui-button[aria-pressed="true"] {', primaryStart);

    expect(focusRule).toContain("outline: 0");
    expect(focusRule).toContain("inset 0 0 0 1px var(--greyui-keyboard-navigation)");
    expect(focusRule).not.toContain("var(--greyui-selection)");
    expect(selectedStart).toBeGreaterThan(primaryStart);
    expect(css.slice(selectedStart, focusStart)).toContain("var(--greyui-selection)");
  });

  it("provides content rails and a stacked application header without styling body internals", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");

    expect(css).toMatch(/\.greyui-window-content\s*\{[\s\S]*?padding:\s*12px/);
    expect(css).toMatch(
      /\.greyui-window-header\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\) auto/,
    );
    expect(css).toMatch(
      /@media \(max-width: 520px\)[\s\S]*?\.greyui-window-header\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\)/,
    );
  });

  it("keeps window control hover chrome off touch devices", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");
    const hoverMediaStart = css.indexOf("@media (hover: hover)");
    const focusRuleStart = css.indexOf(".greyui-window-widget:focus-visible");
    const hoverMedia = css.slice(hoverMediaStart, focusRuleStart);

    expect(hoverMediaStart).toBeGreaterThan(-1);
    expect(hoverMedia).toContain(".greyui-window-widget:hover");
    expect(hoverMedia).toContain("outline: 1px solid var(--greyui-selection)");
    expect(css).toMatch(/\.greyui-window-widget\s*\{[\s\S]*?outline:\s*0/);
    expect(css).toMatch(
      /\.greyui-window-widget:focus-visible\s*\{[\s\S]*?outline:\s*1px solid var\(--greyui-keyboard-navigation\)/,
    );
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

  it("keeps Select menu labels single-line within a content-sized popup", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");

    expect(css).toMatch(/\.greyui-select-list\s*\{[\s\S]*?min-width:\s*max-content/);
    expect(css).toMatch(/\.greyui-select-item-text\s*\{[\s\S]*?grid-column:\s*2/);
    expect(css).toMatch(/\.greyui-select-item-text\s*\{[\s\S]*?white-space:\s*nowrap/);
    expect(css).toMatch(/\.greyui-select-item-indicator\s*\{[\s\S]*?grid-column:\s*1/);
  });

  it("uses standard panel surfaces for grouped controls", () => {
    const css = readFileSync(resolve(process.cwd(), "src/components-v2.css"), "utf8");

    expect(css).toMatch(/\.greyui-fieldset\s*\{[\s\S]*?background:\s*var\(--greyui-panel\)/);
    expect(css).toMatch(/\.greyui-accordion-panel\s*\{[\s\S]*?background:\s*var\(--greyui-panel\)/);
  });

  it("removes nested chrome from plain fieldsets and aligns field action rows", () => {
    const css = readFileSync(resolve(process.cwd(), "src/components-v2.css"), "utf8");

    expect(css).toMatch(
      /\.greyui-fieldset\[data-variant="plain"\]\s*\{[\s\S]*?padding:\s*0;[\s\S]*?border:\s*0;[\s\S]*?background:\s*transparent;[\s\S]*?box-shadow:\s*none/,
    );
    expect(css).toMatch(/\.greyui-field-action-row\s*\{[\s\S]*?align-items:\s*flex-end/);
  });

  it("paints table row fills through every cell edge", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");

    expect(css).toMatch(/\.greyui-table\s*\{[\s\S]*?background:\s*var\(--greyui-panel-light\)/);
    expect(css).toMatch(
      /\.greyui-table tbody td\s*\{[\s\S]*?background:\s*var\(--greyui-panel-light\)/,
    );
    expect(css).toMatch(
      /\.greyui-table tbody tr:nth-child\(even\) td\s*\{[\s\S]*?background:\s*var\(--greyui-panel\)/,
    );
    expect(css).toMatch(
      /\.greyui-table tbody tr\[aria-selected="true"\] td\s*\{[\s\S]*?background:\s*var\(--greyui-selection\)/,
    );
  });
});
