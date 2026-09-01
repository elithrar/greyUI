# Changelog

## Unreleased

- Scope window chrome under `Window` (`Window.Widget`, `Window.MenuBar`, and `Window.StatusBar.*`) and remove the standalone pre-1.0 runtime exports.
- Add standard Window content rails and responsive description/action header slots.
- Add borderless semantic Fieldsets and bottom-aligned field action rows.
- Keep button selection independent from primary/default emphasis and replace outer focus chrome with
  a neutral inset keyboard cue.
- Document button states and a complete dense application-window composition.

## 0.4.1 — 2026-08-27

- Add shared Layer hosts for menus, popovers, app-owned overlays, dialogs, toasts, and tooltips.
- Add a compound Window API while preserving the existing shorthand component.
- Add WorkbenchOS-styled Banner, Breadcrumbs, Empty, Loader, and Pagination components using
  Kumo-inspired composition patterns.
- Align desktop tab height, button weight, and editable-value typography with WorkbenchOS.

## 0.4.0 — 2026-08-27

- Add controlled and uncontrolled Window collapse state, floating/stacked responsive modes, body
  props, and polymorphic rendering.
- Add IconButton, ButtonGroup, structured StatusBar parts, DatePicker, and SegmentedMeter.
- Add virtual-anchor positioning through Popover positioner props and `createVirtualAnchor()`.
- Raise the default selection-blue contrast above WCAG AA for white small text.
- Remove CommonJS React shims from the package build so root and subpath imports server-render in
  Worker-style ESM environments.
- Strengthen package audits with real bundle measurement, root/subpath equivalence, CommonJS
  rejection, and DOM-free SSR rendering.
