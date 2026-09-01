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

  it("names Window as an inline-size query container", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");

    expect(css).toMatch(
      /\.greyui-window\[data-chrome="auto"\]\s*\{[\s\S]*?container-type:\s*inline-size;[\s\S]*?container-name:\s*greyui-window;/,
    );
    expect(css).toMatch(
      /:where\(\.greyui-window\[data-chrome="auto"\], \.greyui-window\[data-chrome="stacked"\]\)\s*\{[\s\S]*?width:\s*100%/,
    );
    expect(css).toMatch(
      /@container greyui-window \(max-width: 768px\)[\s\S]*?\.greyui-window\[data-chrome="auto"\] \.greyui-window-frame/,
    );
    expect(css).toMatch(
      /\.greyui-window\[data-chrome="stacked"\] \.greyui-window-frame\s*\{[\s\S]*?padding:\s*0/,
    );
    expect(css).toMatch(
      /\.greyui-window\[data-collapsed="true"\] \.greyui-window-frame\s*\{[\s\S]*?width:\s*max-content/,
    );
    expect(css).toMatch(
      /\.greyui-window\[data-chrome="stacked"\] \.greyui-window-frame\s*\{[\s\S]*?width:\s*100%/,
    );
    expect(css).not.toMatch(
      /@media \(max-width: 768px\)[\s\S]*?\.greyui-window\[data-(?:chrome|responsive)=/,
    );
  });

  it("gives the inner window frame sole ownership of outer chrome", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");
    const rootRule = css.slice(
      css.indexOf(".greyui-window {"),
      css.indexOf(".greyui-window-frame {"),
    );
    const frameRule = css.slice(
      css.indexOf(".greyui-window-frame {"),
      css.indexOf(".greyui-window-frame::before"),
    );
    const bodyRule = css.slice(
      css.indexOf(".greyui-window-body {"),
      css.indexOf(".greyui-window-content {"),
    );

    expect(rootRule).not.toContain("box-shadow:");
    expect(frameRule).toContain("box-shadow:");
    expect(css).toMatch(/\.greyui-window-frame::before\s*\{[\s\S]*?border:/);
    expect(bodyRule).not.toContain("border:");
    expect(bodyRule).not.toContain("box-shadow:");
    expect(css).toMatch(/\.greyui-menubar\s*\{[\s\S]*?margin:\s*0;/);
    expect(css).toMatch(/\.greyui-statusbar\s*\{[\s\S]*?margin:\s*0;/);
    expect(css).toMatch(
      /\.greyui-window\[data-chrome="stacked"\] \.greyui-menubar\s*\{[\s\S]*?border-top:\s*0;[\s\S]*?border-left:\s*0/,
    );
    expect(css).toMatch(
      /\.greyui-window\[data-chrome="stacked"\] \.greyui-statusbar\s*\{[\s\S]*?border-bottom:\s*0;[\s\S]*?border-left:\s*0/,
    );
    expect(css).toMatch(
      /\.greyui-window\[data-chrome="stacked"\]\[data-collapsed="true"\] \.greyui-window-tab\s*\{[\s\S]*?border-bottom:\s*0/,
    );
    expect(css).toMatch(
      /@container greyui-window \(max-width: 768px\)[\s\S]*?\.greyui-window\[data-chrome="auto"\]\[data-collapsed="true"\] \.greyui-window-tab\s*\{[\s\S]*?border-bottom:\s*0/,
    );
  });

  it("keeps active and inactive window geometry identical", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");
    const inactiveDeclarations = Array.from(
      css.matchAll(/\.greyui-window\[data-active="false"\][^{]*\{([^}]*)\}/g),
      (match) => match[1],
    ).join("\n");

    expect(inactiveDeclarations).not.toMatch(
      /(?:^|\s)(?:display|position|inset|width|height|min-width|min-height|max-width|max-height|margin|padding|border-width):/,
    );
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

  it("provides container-aware content rails and application headers", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");

    expect(css).toMatch(/\.greyui-window-content\s*\{[\s\S]*?padding:\s*12px/);
    expect(css).toMatch(
      /\.greyui-window-header\s*\{[\s\S]*?container-name:\s*greyui-window-header/,
    );
    expect(css).toMatch(
      /\.greyui-window-header-layout\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\) minmax\(0, max-content\)/,
    );
    expect(css).toMatch(/\.greyui-window-actions\s*\{[\s\S]*?max-width:\s*100%/);
    expect(css).toMatch(
      /@container greyui-window-header \(max-width: 520px\)[\s\S]*?\[data-layout="auto"\]/,
    );
  });

  it("stacks field action rows against their own container", () => {
    const css = readFileSync(resolve(process.cwd(), "src/components-v2.css"), "utf8");

    expect(css).toMatch(
      /\.greyui-field-action-row\s*\{[\s\S]*?container-name:\s*greyui-field-action-row/,
    );
    expect(css).toMatch(
      /\.greyui-field-action-row\s*\{[\s\S]*?contain-intrinsic-inline-size:\s*22rem/,
    );
    expect(css).toMatch(
      /@container greyui-field-action-row \(max-width: 350px\)[\s\S]*?\[data-layout="auto"\]/,
    );
    expect(css).toMatch(
      /\[data-layout="stacked"\][\s\S]*?\.greyui-field-action-row-layout[\s\S]*?flex-direction:\s*column/,
    );
    expect(css).not.toContain("@media (max-width: 350px)");
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

  it("uses anchor-width form popups with explicit content-width overrides", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");
    const componentCss = readFileSync(resolve(process.cwd(), "src/components-v2.css"), "utf8");

    expect(css).toMatch(
      /\.greyui-select-popup\s*\{[\s\S]*?width:\s*min\(var\(--anchor-width[\s\S]*?var\(--available-width/,
    );
    expect(css).toMatch(
      /\.greyui-select-popup\[data-greyui-popup-width="content"\]\s*\{[\s\S]*?width:\s*max-content/,
    );
    expect(css).toMatch(/\.greyui-select-list\s*\{[\s\S]*?min-width:\s*0/);
    expect(css).toMatch(
      /\.greyui-select-popup\[data-greyui-popup-width="content"\] \.greyui-select-list\s*\{[\s\S]*?min-width:\s*max-content/,
    );
    expect(css).toMatch(/\.greyui-select-item-text\s*\{[\s\S]*?grid-column:\s*2/);
    expect(css).toMatch(/\.greyui-select-item-text\s*\{[\s\S]*?white-space:\s*nowrap/);
    expect(css).toMatch(/\.greyui-select-item-indicator\s*\{[\s\S]*?grid-column:\s*1/);
    expect(componentCss).toMatch(
      /\.greyui-combobox-popup\s*\{[\s\S]*?width:\s*min\(var\(--anchor-width[\s\S]*?var\(--available-width/,
    );
    expect(componentCss).toMatch(/\.greyui-autocomplete-item-text\s*\{[\s\S]*?grid-column:\s*1/);
    expect(componentCss).toMatch(
      /\.greyui-autocomplete-item-indicator\s*\{[\s\S]*?grid-column:\s*2/,
    );
    expect(componentCss).not.toContain(
      ".greyui-combobox-item > :not(.greyui-combobox-item-indicator)",
    );
  });

  it("clamps menus to Base UI's collision area and communicates disabled triggers", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");

    expect(css).toMatch(
      /\.greyui-menu-popup\s*\{[\s\S]*?max-width:[^;]*var\(--available-width[\s\S]*?max-height:[^;]*var\(--available-height/,
    );
    expect(css).toMatch(/\.greyui-menu-trigger\[data-disabled\]\s*\{[\s\S]*?cursor:\s*not-allowed/);
    expect(css).toMatch(
      /\.greyui-menubar \.greyui-menu-trigger\[data-disabled\]\s*\{[\s\S]*?color:\s*var\(--greyui-text-muted\)/,
    );
    expect(css).toContain(".greyui-menu-trigger:hover:not([data-disabled])");
  });

  it("removes nested chrome from plain fieldsets and aligns field action rows", () => {
    const css = readFileSync(resolve(process.cwd(), "src/components-v2.css"), "utf8");

    expect(css).toMatch(
      /\.greyui-fieldset\[data-variant="plain"\]\s*\{[\s\S]*?padding:\s*0;[\s\S]*?border:\s*0;[\s\S]*?background:\s*transparent;[\s\S]*?box-shadow:\s*none/,
    );
    expect(css).toMatch(/\.greyui-field-action-row-layout\s*\{[\s\S]*?align-items:\s*flex-end/);
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
