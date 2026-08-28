from pathlib import Path
import re


def read(path: str) -> str:
    return Path(path).read_text()


def write(path: str, source: str) -> None:
    Path(path).write_text(source)


def replace_once(path: str, old: str, new: str) -> None:
    source = read(path)
    count = source.count(old)
    if count != 1:
        raise RuntimeError(f"Expected one match in {path}, found {count}: {old[:100]!r}")
    write(path, source.replace(old, new, 1))


# Base UI omits ItemIndicator for unselected rows. Pin both children to explicit
# grid columns so labels never fall into the 1rem indicator column.
replace_once(
    "src/styles.css",
    '''.greyui-select-item-text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}''',
    '''.greyui-select-item-text {
  grid-column: 2;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}''',
)
replace_once(
    "src/styles.css",
    '''.greyui-select-item-indicator {
  font-weight: 700;
  text-align: center;
}''',
    '''.greyui-select-item-indicator {
  grid-column: 1;
  font-weight: 700;
  text-align: center;
}''',
)

# Keep granular imports grouped by package endpoint, while exposing each
# statement separately so the docs can render readable one-line rows.
replace_once(
    "docs/src/component-imports.tsx",
    '''export function groupedGranularImport(imports: readonly string[]): string {
  const importsByPath = new Map<string, string[]>();

  for (const name of imports) {
    const spec = componentImportByName.get(name);
    if (spec === undefined) {
      throw new Error(`No granular import is documented for ${name}.`);
    }

    const pathImports = importsByPath.get(spec.path);
    if (pathImports === undefined) {
      importsByPath.set(spec.path, [name]);
    } else {
      pathImports.push(name);
    }
  }

  return Array.from(importsByPath, ([path, pathImports]) =>
    granularImport({ name: pathImports[0] ?? path, path, imports: pathImports }),
  ).join("\\n");
}

export function ComponentImport({ imports, label }: { imports: readonly string[]; label: string }) {
  const statement = groupedGranularImport(imports);

  return (
    <div className="docs-section-import" role="note" aria-label={`${label} imports`}>
      <span className="docs-section-import-label">Import</span>
      <CopyCommand value={statement} label={`${label} import`} />
    </div>
  );
}''',
    '''export function groupedGranularImports(imports: readonly string[]): readonly string[] {
  const importsByPath = new Map<string, string[]>();

  for (const name of imports) {
    const spec = componentImportByName.get(name);
    if (spec === undefined) {
      throw new Error(`No granular import is documented for ${name}.`);
    }

    const pathImports = importsByPath.get(spec.path);
    if (pathImports === undefined) {
      importsByPath.set(spec.path, [name]);
    } else {
      pathImports.push(name);
    }
  }

  return Array.from(importsByPath, ([path, pathImports]) =>
    granularImport({ name: pathImports[0] ?? path, path, imports: pathImports }),
  );
}

export function groupedGranularImport(imports: readonly string[]): string {
  return groupedGranularImports(imports).join("\\n");
}

export function ComponentImport({ imports, label }: { imports: readonly string[]; label: string }) {
  const statement = groupedGranularImport(imports);

  return (
    <div className="docs-component-import" role="note" aria-label={`${label} imports`}>
      <span className="docs-component-import-label">Import</span>
      <CopyCommand value={statement} label={`${label} import`} />
    </div>
  );
}''',
)

# Replace the oversized section-level import block with a compact inline banner.
css_path = "docs/src/docs.css"
css = read(css_path)
start = css.index("/* Section imports */")
end = css.index(".docs-high-value-grid", start)
import_css = '''/* Contextual component imports */
.docs-component-import {
  display: grid;
  min-width: 0;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 6px;
  padding: 4px 5px;
  border-top: 1px solid var(--greyui-border-dark);
  border-bottom: 1px solid var(--greyui-border-dark);
  background: var(--greyui-panel-dark);
  box-shadow: inset 1px 1px 0 var(--greyui-border-light);
  color: var(--greyui-text);
}

.docs-section > .docs-component-import {
  width: min(100%, 760px);
  margin: -6px 0 12px;
  border: 1px solid var(--greyui-border-dark);
}

.docs-component-import-label {
  color: var(--greyui-text-muted);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.docs-component-import .docs-copy-command {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  padding: 2px 3px 2px 5px;
  border-color: var(--greyui-border-dark);
  background: var(--greyui-document);
  box-shadow: var(--greyui-bevel-inset);
  color: var(--greyui-text);
  font-size: 11px;
  line-height: 1.35;
}

.docs-component-import .docs-copy-command-text {
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  text-overflow: clip;
  white-space: pre;
  scrollbar-width: thin;
}

.docs-component-import .docs-copy-command:hover,
.docs-component-import .docs-copy-command:focus-visible {
  outline: 1px solid var(--greyui-keyboard-navigation);
  outline-offset: 0;
}

.docs-component-import .docs-copy-command-icon {
  flex: 0 0 auto;
}

'''
write(css_path, css[:start] + import_css + css[end:])

# Main docs: imports belong with the demo/group they describe, not at section level.
main_path = "docs/src/main.tsx"
main = read(main_path)
old_demo = '''function Demo({ title, children, code }: { title: string; children: ReactNode; code?: string }) {
  return (
    <div className="docs-demo">
      <div className="docs-demo-title">{title}</div>
      <div className="docs-demo-canvas">{children}</div>
      {code ? (
        <pre className="docs-code">
          <code>{code}</code>
        </pre>
      ) : null}
    </div>
  );
}'''
new_demo = '''function Demo({
  title,
  children,
  code,
  imports,
}: {
  title: string;
  children: ReactNode;
  code?: string;
  imports?: readonly string[];
}) {
  return (
    <div className="docs-demo">
      <div className="docs-demo-title">{title}</div>
      {imports ? <ComponentImport imports={imports} label={title} /> : null}
      <div className="docs-demo-canvas">{children}</div>
      {code ? (
        <pre className="docs-code">
          <code>{code}</code>
        </pre>
      ) : null}
    </div>
  );
}'''
if main.count(old_demo) != 1:
    raise RuntimeError("Could not replace main Demo")
main = main.replace(old_demo, new_demo, 1)
old_section = '''function Section({
  id,
  title,
  intro,
  imports,
  children,
}: {
  id: string;
  title: string;
  intro: ReactNode;
  imports?: readonly string[];
  children: ReactNode;
}) {
  return (
    <section className="docs-section" id={id}>
      <h2>{title}</h2>
      <p className="docs-lede">{intro}</p>
      {imports ? <ComponentImport imports={imports} label={title} /> : null}
      {children}
    </section>
  );
}'''
new_section = '''function Section({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="docs-section" id={id}>
      <h2>{title}</h2>
      <p className="docs-lede">{intro}</p>
      {children}
    </section>
  );
}'''
if main.count(old_section) != 1:
    raise RuntimeError("Could not replace Section")
main = main.replace(old_section, new_section, 1)
main, removed = re.subn(r'\n\s+imports=\{\[[\s\S]*?\]\}', '', main)
if removed != 13:
    raise RuntimeError(f"Expected 13 section import props, removed {removed}")
main = main.replace(
    '              <div className="docs-principles">',
    '              <ComponentImport imports={["GroupBox"]} label="Group boxes" />\n              <div className="docs-principles">',
    1,
)
main = main.replace(
    '              <Demo\n                title="Variants"',
    '              <Demo\n                title="Variants"\n                imports={["Button", "SegmentedControl", "ToggleButton"]}',
    1,
)
main = main.replace(
    '            >\n              <div className="docs-grid-2">\n                <Demo title="Input">',
    '            >\n              <ComponentImport imports={["Input", "Textarea", "Select"]} label="Basic fields" />\n              <div className="docs-grid-2">\n                <Demo title="Input">',
    1,
)
main = main.replace(
    '<Demo title="Checkbox, radio and switch">',
    '<Demo title="Checkbox, radio and switch" imports={["Checkbox", "RadioGroup", "Switch"]}>',
    1,
)
main = main.replace(
    '<Demo title="Related views">',
    '<Demo title="Related views" imports={["Tabs"]}>',
    1,
)
main = main.replace(
    '<Demo title="Interactive overlays">',
    '<Demo\n                title="Interactive overlays"\n                imports={["AlertDialog", "Dialog", "Layer", "Menu", "Popover", "Tooltip"]}\n              >',
    1,
)
main = main.replace('<Demo title="Table">', '<Demo title="Table" imports={["Badge", "Table"]}>', 1)
main = main.replace(
    '<Demo title="Scroll area">',
    '<Demo title="Scroll area" imports={["ScrollArea"]}>',
    1,
)
main = main.replace(
    '<Demo title="Active and inactive windows">',
    '<Demo\n                title="Active and inactive windows"\n                imports={["Menu", "MenuBar", "StatusBar", "Window", "WindowWidget"]}\n              >',
    1,
)
write(main_path, main)

# Helper demos own their contextual import banners.
next_path = "docs/src/next-components.tsx"
next_source = read(next_path)
next_source = next_source.replace(
    'import { useMemo, useRef, useState } from "react";\n',
    'import { useMemo, useRef, useState } from "react";\nimport { ComponentImport } from "./component-imports";\n',
    1,
)
old_next_demo = '''function Demo({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="docs-demo">
      <div className="docs-demo-title">{title}</div>
      <div className="docs-demo-canvas">{children}</div>
    </div>
  );
}'''
new_next_demo = '''function Demo({
  title,
  children,
  imports,
}: {
  title: string;
  children: React.ReactNode;
  imports: readonly string[];
}) {
  return (
    <div className="docs-demo">
      <div className="docs-demo-title">{title}</div>
      <ComponentImport imports={imports} label={title} />
      <div className="docs-demo-canvas">{children}</div>
    </div>
  );
}'''
if next_source.count(old_next_demo) != 1:
    raise RuntimeError("Could not replace helper Demo")
next_source = next_source.replace(old_next_demo, new_next_demo, 1)
next_imports = {
    "Field": ["Field"],
    "Input group": ["InputGroup"],
    "Number field": ["NumberField"],
    "Combobox": ["Combobox"],
    "Form state matrix": ["Input", "NumberField"],
    "Toolbar": ["Toolbar"],
    "Slider": ["Slider"],
    "Context menu": ["ContextMenu"],
    "Collapsible": ["Button", "Collapsible"],
    "Separator": ["Button", "Separator"],
    "Progress": ["Progress"],
    "Meter": ["Meter"],
    "Toast": ["Button", "Toast"],
    "Inline banners": ["Banner"],
    "Tracker breadcrumbs": ["Breadcrumbs"],
    "Empty state": ["Button", "Empty"],
    "Loaders": ["Loader"],
    "Pagination": ["Pagination"],
    "Compact date picker": ["DatePicker"],
    "Icon button group": ["ButtonGroup", "IconButton"],
    "Segmented meter": ["SegmentedMeter"],
    "Virtual-anchor popover": ["Popover", "createVirtualAnchor"],
    "Floating, collapsible window": [
        "StatusBar",
        "StatusBarItem",
        "StatusBarSeparator",
        "StatusLight",
        "Window",
    ],
}
for title, imports in next_imports.items():
    old = f'<Demo title="{title}">'
    values = ", ".join(f'"{name}"' for name in imports)
    new = f'<Demo title="{title}" imports={{[{values}]}}>'
    if next_source.count(old) != 1:
        raise RuntimeError(f"Could not add imports to helper demo {title}")
    next_source = next_source.replace(old, new, 1)
write(next_path, next_source)

# High-value component cards each get a local banner.
high_path = "docs/src/high-value-components.tsx"
high = read(high_path)
high = high.replace(
    'import { Accordion, Autocomplete, Checkbox, CheckboxGroup, Fieldset, ToggleGroup } from "../../src";\n',
    'import { Accordion, Autocomplete, Checkbox, CheckboxGroup, Fieldset, ToggleGroup } from "../../src";\nimport { ComponentImport } from "./component-imports";\n',
    1,
)
old_component_demo = '''function ComponentDemo({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <article className="docs-high-value-demo">
      <div className="docs-high-value-demo-header">
        <h3>{name}</h3>
      </div>
      <div className="docs-high-value-demo-canvas">{children}</div>
    </article>
  );
}'''
new_component_demo = '''function ComponentDemo({
  name,
  imports,
  children,
}: {
  name: string;
  imports: readonly string[];
  children: React.ReactNode;
}) {
  return (
    <article className="docs-high-value-demo">
      <div className="docs-high-value-demo-header">
        <h3>{name}</h3>
      </div>
      <ComponentImport imports={imports} label={name} />
      <div className="docs-high-value-demo-canvas">{children}</div>
    </article>
  );
}'''
if high.count(old_component_demo) != 1:
    raise RuntimeError("Could not replace high-value ComponentDemo")
high = high.replace(old_component_demo, new_component_demo, 1)
high_imports = {
    "ToggleGroup": ["ToggleGroup"],
    "Autocomplete": ["Autocomplete"],
    "Accordion": ["Accordion"],
    "CheckboxGroup": ["Checkbox", "CheckboxGroup"],
    "Fieldset": ["Checkbox", "CheckboxGroup", "Fieldset"],
}
for title, imports in high_imports.items():
    old = f'<ComponentDemo name="{title}">'
    values = ", ".join(f'"{name}"' for name in imports)
    new = f'<ComponentDemo name="{title}" imports={{[{values}]}}>'
    if high.count(old) != 1:
        raise RuntimeError(f"Could not add imports to {title}")
    high = high.replace(old, new, 1)
write(high_path, high)

# Regression coverage for explicit Select grid placement and readable import rows.
style_tests = read("tests/styles.test.ts")
style_tests = style_tests.replace(
    '''    expect(css).toMatch(/\\.greyui-select-list\\s*\\{[\\s\\S]*?min-width:\\s*max-content/);
    expect(css).toMatch(/\\.greyui-select-item-text\\s*\\{[\\s\\S]*?white-space:\\s*nowrap/);''',
    '''    expect(css).toMatch(/\\.greyui-select-list\\s*\\{[\\s\\S]*?min-width:\\s*max-content/);
    expect(css).toMatch(/\\.greyui-select-item-text\\s*\\{[\\s\\S]*?grid-column:\\s*2/);
    expect(css).toMatch(/\\.greyui-select-item-text\\s*\\{[\\s\\S]*?white-space:\\s*nowrap/);
    expect(css).toMatch(/\\.greyui-select-item-indicator\\s*\\{[\\s\\S]*?grid-column:\\s*1/);''',
    1,
)
write("tests/styles.test.ts", style_tests)

import_tests = read("tests/component-imports.test.tsx")
import_tests = import_tests.replace(
    '''  granularImport,
  groupedGranularImport,''',
    '''  granularImport,
  groupedGranularImport,
  groupedGranularImports,''',
    1,
)
import_tests = import_tests.replace(
    '''    expect(() => groupedGranularImport(["UnknownComponent"])).toThrow(
      "No granular import is documented for UnknownComponent.",
    );''',
    '''    expect(groupedGranularImports(["Input", "Textarea", "Select"])).toEqual([
      'import { Input, Textarea } from "greyui/components/input";',
      'import { Select } from "greyui/components/select";',
    ]);
    expect(() => groupedGranularImport(["UnknownComponent"])).toThrow(
      "No granular import is documented for UnknownComponent.",
    );''',
    1,
)
write("tests/component-imports.test.tsx", import_tests)

print("Applied final Select, grouped-surface, and contextual-import changes")
