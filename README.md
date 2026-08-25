# greyUI

greyUI is a standalone BeOS R5 / Haiku-inspired React component library derived from WorkbenchOS. Base UI provides keyboard, focus, positioning, and ARIA behavior for compound controls.

## Install

```bash
npm install @elithrar/greyui
```

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

Import components and the stylesheet once:

```tsx
import { Button, Input, Window } from "@elithrar/greyui";
import "@elithrar/greyui/styles.css";
```

## Components

- Controls: Button, ToggleButton, SegmentedControl, Input, Textarea, Checkbox, RadioGroup, Switch, Select
- Compound UI: Tabs, Menu, Popover, Tooltip, Dialog, AlertDialog, ScrollArea
- Surfaces: Table, Badge, GroupBox, Window, MenuBar, StatusBar

## Development

```bash
npm install
npm run check
npm run build
```

`npm run check` runs Oxfmt, Oxlint, TypeScript, and Vitest. CI also validates the package tarball and docs deployment configuration.

## Docs

```bash
npm run dev:docs
npm run verify:docs
npm run deploy:docs
```

The docs site deploys `docs/dist` with Cloudflare Workers Static Assets; no Worker runtime code is required.

## Design provenance

The visual system is derived from WorkbenchOS's BeOS/Haiku design language. Kumo UI informs package ergonomics; Base UI provides headless behavior for compound primitives. greyUI ships original CSS and generic control geometry, not BeOS or Haiku artwork or system assets.
