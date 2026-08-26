# Repository guidance

## Component changes

- Preserve the existing public API and design language unless the task explicitly changes them.
- Use the shared greyUI tokens, control geometry, bevels, focus treatment, and state attributes. Check neighboring components before introducing a new pattern.
- Every component addition or update must include a corresponding docs-site change in the same pull request. Add or revise the example and copy so the changed API, state, behavior, or appearance is visible.
- Keep the README component inventory accurate when adding, removing, or renaming a public component.
- Add or update automated tests for public behavior, accessibility contracts, and regressions that can be asserted without visual layout.

## Review process

1. Inspect the relevant component, shared CSS, docs example, and adjacent controls before editing.
2. Reproduce suspected defects in the rendered docs. Do not change code based on appearance assumptions alone.
3. Make the smallest shared fix that addresses the verified issue without changing unrelated components.
4. Review the rendered result again after implementation. Compare related controls side by side and check that shared rules did not introduce drift elsewhere.
5. Perform a final detail pass before reporting completion.

Use WorkbenchOS source and its rendered interface as concrete references when fidelity is unclear. Match established greyUI behavior rather than approximating the style from memory.

## Responsive requirements

- Component and docs changes must work at desktop, tablet, and mobile sizes.
- Review at 1280px, 768px, 390px, and 320px viewport widths.
- Confirm the document has no horizontal overflow. Intentional scrolling must remain contained within tables, scroll areas, menus, or other dedicated surfaces.
- Check that controls shrink or wrap without clipped labels, inaccessible actions, overlapping borders, or broken window chrome.
- Open overlays at desktop and mobile widths. Menus, selects, comboboxes, popovers, dialogs, context menus, tooltips, and toasts must remain inside the viewport.
- Do not treat a desktop-only rendering as sufficient validation.

## Visual regression and detail testing

- Run the docs site and inspect every component affected by the changed CSS or shared primitive.
- Capture or compare before-and-after renders at representative desktop and mobile sizes.
- Test representative states when supported: default, hover, active, focus-visible, disabled, selected, checked, open, invalid, indeterminate, and loading.
- Exercise interactive components rather than reviewing only their closed or static state.
- Check fine details including control height, padding, alignment, box sizing, borders, bevel direction, dividers, scrollbar gutters, typography, icon centering, disabled opacity, and focus outlines.
- Pay special attention to components named or shown in the issue or request, while still checking other consumers of the same styles.
- Automated tests and a successful build do not replace rendered visual review.

## Required validation

Run the checks relevant to the change:

```bash
npm run check
npm run build
npm run build:docs
```

Run `npm run pack:check` when package output, exports, bundled CSS, or declarations may be affected.

If Vite cannot clear ignored build output in the managed checkout, validate from a clean directory under `/private/tmp` with the existing `node_modules` linked in. Report the exact checks run, any warnings, and any validation that could not be completed.
