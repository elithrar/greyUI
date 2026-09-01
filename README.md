# greyUI

greyUI is a standalone BeOS R5 / Haiku-inspired React component library derived from [WorkbenchOS](https://workbench.questionable.services/). Base UI provides keyboard, focus, positioning, and ARIA behavior for compound controls.

<img width="778" height="812" alt="image" src="https://github.com/user-attachments/assets/2e2a0afa-477b-415c-8280-6cebfa5b25a8" />

You can find the full set of interactive example components at https://greyui.questionable.services/

## Install

```bash
npm install greyui
```

Import the shared stylesheet once. Named root imports remain the default:

```tsx
import { Button, Input, Window } from "greyui";
import "greyui/styles.css";
```

Component subpaths are available for explicit imports:

```tsx
import { Button } from "greyui/components/button";
import { Select } from "greyui/components/select";
import "greyui/styles.css";
```

Both forms use the same build graph. CI checks that representative root imports tree-shake to comparable consumer bundles as their component subpaths. React and React DOM remain peer dependencies.

## API conventions

- Simple controls accept native props; compound controls use `Root` plus named parts and Base UI behavior. Use the [Base UI reference](https://base-ui.com/react/components) for exhaustive primitive props.
- Consumers provide labels and accessible names. Wrap overlay-heavy apps in `Layer.Provider`.
- `Window` adapts to its own inline size with `chrome="auto"`. Use `chrome="floating"` or
  `chrome="stacked"` when geometry must remain fixed. The deprecated `responsive` adapter remains
  available throughout 0.6.x and is scheduled for removal no earlier than 0.7.0.

## Common distinctions

- `Select` is fixed-list; `Combobox` searches listed values; `Autocomplete` keeps free-form text valid.
- Form popups match their anchor by default. Use `Select popupWidth="content"` or
  `Combobox.Popup`/`Autocomplete.Popup width="content"` for longer lists; all three accept
  `positionerProps`.
- `GroupBox` is visual grouping; `Fieldset` adds form semantics. Use `Fieldset.Root variant="plain"` with an accessible name when surrounding chrome supplies the visual boundary.
- `Button` emphasis (`variant="primary"`), default action (`defaultAction`), selection (`aria-pressed`), and keyboard focus are independent states.
- `Field.ActionRow` bottom-aligns labeled controls such as `Select` with adjacent buttons. Its
  `layout="auto"` default follows its own container; `"inline"` and `"stacked"` are explicit
  overrides.

## Use locally

Build greyUI:

```bash
git clone https://github.com/elithrar/greyUI.git
cd greyUI
npm install
npm run build
```

Then install that local build from your app:

```bash
npm install /path/to/greyUI
```

## Components

- Inputs: Input, Textarea, Field, InputGroup, NumberField, Select, Combobox, DatePicker, Autocomplete, Fieldset
- Controls: Button, IconButton, ButtonGroup, ToggleButton, SegmentedControl, Checkbox, RadioGroup, Switch, Slider, CheckboxGroup, ToggleGroup
- Desktop UI: Tabs, Menu, ContextMenu, Toolbar, Collapsible, Popover, Tooltip, Dialog, AlertDialog, Layer, Accordion
- Feedback and content: Banner, Breadcrumbs, Empty, Loader, Pagination, Progress, Meter, SegmentedMeter, Toast, ScrollArea, Table, Badge, GroupBox, Separator
- Window chrome: Window (`Window.Widget`, `Window.MenuBar`, `Window.StatusBar.*`)

`Window` supports controlled/uncontrolled collapse and container-aware `chrome="auto"` behavior;
use `"floating"` or `"stacked"` to override its chrome geometry. Use `Window.Content` for standard
body rails and compose `Window.Header`, `Window.Description`, and `Window.Actions` for in-body
headers. `Window.Header` also accepts `layout="auto" | "inline" | "stacked"`. The legacy
`responsive` prop remains as a deprecated adapter. `Popover.Popup.positionerProps` accepts Base UI
positioning options such as virtual anchors.

`Window.MenuBar` coordinates sibling `Menu.Root` components with menubar semantics, including arrow-key traversal and open-menu handoff. `Menu` includes item, link, checkbox, radio, group, and submenu primitives; `Menu.Popup.positionerProps` exposes Base UI positioning options for edge cases and nested menus.

For 0.5 migrations, replace `responsive="stacked"` with `chrome="auto"` and
`responsive="floating"` with `chrome="floating"`. If both props are present, `chrome` wins.
`Window.Header` and `Field.ActionRow` become container-aware by default without markup changes;
set their `layout` prop only when an explicit inline or stacked arrangement is required.

`Layer.Provider` routes overlays into stable top-level hosts; `Layer.Portal` exposes the same contract for custom content.

## Development

```bash
npm install
npm run check
npm run build
npm run perf:package
```

`npm run check` runs Oxfmt, Oxlint + anti-slop, TypeScript, and Vitest. `npm run perf:package` checks package entrypoints and bundle costs; CI also validates the tarball and docs deployment.

## Docs

```bash
npm run dev:docs
npm run verify:docs
npm run deploy:docs
```

The docs site deploys `docs/dist` with Cloudflare Workers Static Assets; no Worker runtime code is required.

## Design provenance

The visual system is derived from [WorkbenchOS](https://workbench.questionable.services/)'s BeOS/Haiku design language. Kumo UI informs package ergonomics; Base UI provides headless behavior for compound primitives. greyUI ships original CSS and generic control geometry, not BeOS or Haiku artwork or system assets.
