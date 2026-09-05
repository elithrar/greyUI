# Component rendering review

## Confirmed defects and plan

Baseline: PR #32 at `9c671aca473e2b6e38ea03f2cd74177074fa750d`.
Reviewed the rendered docs at 1280, 768, 390, and 320px before changing component code.
Compared existing bevels, surfaces, typography, and control density with WorkbenchOS.

| Finding                                                        | Baseline evidence                                                                                                    | Fix                                                                                                                                                        |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SegmentedMeter overstates partial capacity                     | At 320px, a 50/100 value fills the entire 257px inner track. Zero-value segments leave a 1px divider.                | Size segments against the resolved maximum, leave unused capacity visible, and omit zero-value spans. Use an inset divider that does not consume capacity. |
| Tabs ignore vertical orientation and overflow with long labels | Vertical tabs render horizontally. A 280px label escapes 259px of available content, widening the document to 324px. | Add scoped orientation layout and constrain labels. Preserve nested tab orientation and keyboard handling.                                                 |
| Disabled tabs look enabled                                     | Base UI sets data-disabled and aria-disabled, while the CSS only matches native :disabled.                           | Match the actual state attribute for disabled styling and hover exclusion.                                                                                 |
| Toolbar groups overflow narrow containers                      | A button and input produce a 301px scroll width inside a 204–216px toolbar.                                          | Let groups wrap and controls shrink within their toolbar; stack vertical groups.                                                                           |

The plan was to reproduce these defects, make scoped fixes, then check rendered results,
keyboard behavior, neighboring controls, package output, and responsive containment.
The existing maximum normalization, numeric ARIA values, public props, and exports remain
unchanged. Disabled tabs remain focusable without becoming selected.

## Docs re-review and correction

The first implementation also added white inset tab panels and prominent edge-case demos.
Those were poor documentation choices: artificial labels and placeholder content added
clutter, while the inset surface made static content resemble an input. Docs copy alone
was not sufficient justification for changing every consumer's panel appearance.

| Area reviewed                                                                 | Final decision                                                                                                                                                                                                                                                                               |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tabs                                                                          | Remove the added vertical, nested, and long-label demos from the main page. Restore the original undecorated panel and horizontal spacing. Keep one existing example, mark Advanced disabled, and correct the intro. Retain the functional orientation, wrapping, disabled, and focus fixes. |
| Meter                                                                         | Remove the added capacity comparison and empty-track demo. Show partial capacity in the existing segmented-meter example: 34 of 40 miles surveyed. Keep the ordinary Meter example for its distinct API.                                                                                     |
| Toolbar                                                                       | Remove the added narrow and vertical demos. Keep the existing toolbar with one short note about wrapping and orientation.                                                                                                                                                                    |
| Autocomplete and Fieldset                                                     | Keep grouped suggestions and the inherited disabled Switch in existing examples. They demonstrate useful behavior without adding another demo card.                                                                                                                                          |
| Select, RadioGroup, Slider, Accordion, ToggleGroup, Empty, and overlay titles | Keep the brief API guidance and changes inside existing examples. These explain callback types, slot content, or precedence without repeating the component.                                                                                                                                 |

Move the synthetic meter, tab, and toolbar cases to `tests/browser/fixtures/rendering.tsx`.
The browser tests load them through a development-only HTML entry under `docs/__tests__`.
The main docs do not import them, and the production build still uses only `index.html`.
Remove the superseded screenshot gallery so it does not present the reverted design as
an approved result. The original captures remain in the earlier PR commit.

## Validation

- Inspected the simplified docs at 1280, 768, 390, and 320px: tabs, toolbar, meters,
  fields, selection controls, grouped controls, application patterns, and overlays.
  The public docs have no horizontal overflow. Tab selection still works.
- `npm run check`: formatting, lint, typecheck, and all 54 unit tests pass.
- `npm run test:browser`: all 23 tests pass, including 12 isolated rendering/interaction
  regressions and the existing public-docs, window, and overlay checks.
- `npm run build`, `npm run build:docs`, and `npm run pack:check`: pass.
- A separate clean docs build under `/tmp/grayui-simplified-docs-build` confirms that
  neither the development entry nor the synthetic fixture content ships in production.
  The managed checkout retained unused assets from a previous build; the generated
  index references the current assets.
- Browser coverage is Chromium only, using the temporary executable described in the
  TypeScript review. No dependency was added. npm emits the environment's existing
  unknown `http-proxy` configuration warning.
