# greyUI

greyUI is a standalone BeOS R5 / Haiku-inspired React component library derived from WorkbenchOS.

It preserves WorkbenchOS's compact Swiss-style typography, neutral grey panels, beveled controls, white document surfaces, blue selection state, and yellow active tabs. Interactive compound components use Base UI for keyboard, focus, positioning, and ARIA behavior.

The source repository is public. npm publishing is intentionally disabled for now with `"private": true`; the 1.0 source API is available here without implying a registry release.

## Use from source

```bash
git clone https://github.com/elithrar/greyUI.git
cd greyUI
npm install
npm run build
```

For a local workspace, build greyUI first, then depend on the repository path and import the stylesheet once:

```tsx
import { Button, Input, Window } from "@elithrar/greyui";
import "@elithrar/greyui/styles.css";
```

## 1.0 components

- Button, ToggleButton, SegmentedControl, Input, Textarea
- Checkbox, RadioGroup, Switch, Select
- Tabs
- Menu, Popover, Tooltip, Dialog, AlertDialog
- ScrollArea, Table
- Badge, GroupBox
- Window, MenuBar, StatusBar

## Development

Oxc is the project-wide lint and formatting toolchain.

```bash
npm install
npm run format       # oxfmt
npm run lint         # oxlint
npm run typecheck
npm test
npm run check        # formatting + lint + types + tests
npm run build
```

CI runs the same checks, builds both the library and docs, performs a package dry run, and validates the Workers Static Assets deployment configuration.

## Docs / Workers Static Assets

The single-page docs site lives entirely under `docs/`.

```bash
npm run dev:docs
npm run build:docs
npm run deploy:docs
```

`docs/wrangler.jsonc` deploys `docs/dist` as Workers Static Assets; no Worker runtime code is required.

## Design provenance

The visual system is derived from WorkbenchOS's BeOS/Haiku design guidelines and palette. Kumo UI informs package ergonomics and high-level component API design; Base UI provides the headless behavior for compound interactive primitives and is bundled as an implementation detail, following Kumo's packaging direction.

The package uses original CSS and generic system-control geometry; it does not ship BeOS or Haiku trademark artwork or system assets.
