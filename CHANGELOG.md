# Changelog

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
