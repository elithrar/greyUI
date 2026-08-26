# greyUI

greyUI is a standalone BeOS R5 / Haiku-inspired React component library derived from [WorkbenchOS](https://workbench.questionable.services/). Base UI provides keyboard, focus, positioning, and ARIA behavior for compound controls.

## Install

```bash
npm install greyui
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
import { Button, Input, Window } from "greyui";
import "greyui/styles.css";
```

## Components

- Inputs: Input, Textarea, Field, InputGroup, NumberField, Select, Combobox
- Controls: Button, ToggleButton, SegmentedControl, Checkbox, RadioGroup, Switch, Slider
- Desktop UI: Tabs, Menu, ContextMenu, Toolbar, Collapsible, Popover, Tooltip, Dialog, AlertDialog
- Feedback and content: Progress, Meter, Toast, ScrollArea, Table, Badge, GroupBox, Separator
- Window chrome: Window, MenuBar, StatusBar

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

The visual system is derived from [WorkbenchOS](https://workbench.questionable.services/)'s BeOS/Haiku design language. Kumo UI informs package ergonomics; Base UI provides headless behavior for compound primitives. greyUI ships original CSS and generic control geometry, not BeOS or Haiku artwork or system assets.
