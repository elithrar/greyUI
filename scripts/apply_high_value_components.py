from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def write(path: str, content: str) -> None:
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content.rstrip() + "\n", encoding="utf-8")


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def update(path: str, content: str) -> None:
    (ROOT / path).write_text(content, encoding="utf-8")


def insert_once(source: str, anchor: str, addition: str, *, before: bool = False) -> str:
    if addition.strip() in source:
        return source
    if anchor not in source:
        raise RuntimeError(f"Missing anchor: {anchor[:80]}")
    if before:
        return source.replace(anchor, addition + anchor, 1)
    return source.replace(anchor, anchor + addition, 1)


write(
    "src/components/toggle-group.tsx",
    '''import type { ComponentProps } from "react";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";

type WithClassName<T> = Omit<T, "className"> & { className?: string };

export function ToggleGroupRoot({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ToggleGroupPrimitive>>) {
  return (
    <ToggleGroupPrimitive
      data-greyui-component="toggle-group"
      className={`greyui-toggle-group ${className}`.trim()}
      {...props}
    />
  );
}

export function ToggleGroupItem({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof TogglePrimitive>>) {
  return (
    <TogglePrimitive
      className={`greyui-button greyui-toggle-group-item ${className}`.trim()}
      {...props}
    />
  );
}

export const ToggleGroup = {
  Root: ToggleGroupRoot,
  Item: ToggleGroupItem,
};''',
)

write(
    "src/components/checkbox-group.tsx",
    '''import type { ComponentProps } from "react";
import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group";

type PrimitiveProps = Omit<ComponentProps<typeof CheckboxGroupPrimitive>, "className">;

export interface CheckboxGroupProps extends PrimitiveProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function CheckboxGroup({
  className = "",
  orientation = "vertical",
  ...props
}: CheckboxGroupProps) {
  return (
    <CheckboxGroupPrimitive
      data-greyui-component="checkbox-group"
      data-orientation={orientation}
      className={`greyui-checkbox-group ${className}`.trim()}
      {...props}
    />
  );
}''',
)

write(
    "src/components/fieldset.tsx",
    '''import type { ComponentProps } from "react";
import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset";

type WithClassName<T> = Omit<T, "className"> & { className?: string };

export function FieldsetRoot({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof FieldsetPrimitive.Root>>) {
  return (
    <FieldsetPrimitive.Root
      data-greyui-component="fieldset"
      className={`greyui-fieldset ${className}`.trim()}
      {...props}
    />
  );
}

export function FieldsetLegend({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof FieldsetPrimitive.Legend>>) {
  return (
    <FieldsetPrimitive.Legend
      className={`greyui-fieldset-legend ${className}`.trim()}
      {...props}
    />
  );
}

export const Fieldset = {
  Root: FieldsetRoot,
  Legend: FieldsetLegend,
};''',
)

write(
    "src/components/accordion.tsx",
    '''import type { ComponentProps } from "react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";

type WithClassName<T> = Omit<T, "className"> & { className?: string };

export function AccordionRoot({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof AccordionPrimitive.Root>>) {
  return (
    <AccordionPrimitive.Root
      data-greyui-component="accordion"
      className={`greyui-accordion ${className}`.trim()}
      {...props}
    />
  );
}

export function AccordionItem({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof AccordionPrimitive.Item>>) {
  return <AccordionPrimitive.Item className={`greyui-accordion-item ${className}`.trim()} {...props} />;
}

export function AccordionHeader({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof AccordionPrimitive.Header>>) {
  return (
    <AccordionPrimitive.Header className={`greyui-accordion-header ${className}`.trim()} {...props} />
  );
}

export function AccordionTrigger({
  className = "",
  children,
  ...props
}: WithClassName<ComponentProps<typeof AccordionPrimitive.Trigger>>) {
  return (
    <AccordionPrimitive.Trigger
      className={`greyui-accordion-trigger ${className}`.trim()}
      {...props}
    >
      <span className="greyui-accordion-arrow" aria-hidden="true" />
      <span className="greyui-accordion-trigger-label">{children}</span>
    </AccordionPrimitive.Trigger>
  );
}

export function AccordionPanel({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof AccordionPrimitive.Panel>>) {
  return (
    <AccordionPrimitive.Panel className={`greyui-accordion-panel ${className}`.trim()} {...props} />
  );
}

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Panel: AccordionPanel,
};''',
)

write(
    "src/components/autocomplete.tsx",
    '''import type { ComponentProps, ReactNode } from "react";
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import { useLayerContainer } from "./layer";

export const AutocompleteRoot = AutocompletePrimitive.Root;

type WithClassName<T> = Omit<T, "className"> & { className?: string };

export function AutocompleteInputGroup({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof AutocompletePrimitive.InputGroup>>) {
  return (
    <AutocompletePrimitive.InputGroup
      data-greyui-component="autocomplete"
      className={`greyui-combobox-input-group greyui-autocomplete-input-group ${className}`.trim()}
      {...props}
    />
  );
}

export function AutocompleteInput({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof AutocompletePrimitive.Input>>) {
  return (
    <AutocompletePrimitive.Input
      className={`greyui-combobox-input greyui-autocomplete-input ${className}`.trim()}
      {...props}
    />
  );
}

export function AutocompleteTrigger({
  "aria-label": ariaLabel = "Show suggestions",
  className = "",
  children,
  ...props
}: WithClassName<ComponentProps<typeof AutocompletePrimitive.Trigger> & { children?: ReactNode }>) {
  return (
    <AutocompletePrimitive.Trigger
      aria-label={ariaLabel}
      className={`greyui-combobox-trigger greyui-autocomplete-trigger ${className}`.trim()}
      {...props}
    >
      {children ?? <span className="greyui-select-arrow" aria-hidden="true" />}
    </AutocompletePrimitive.Trigger>
  );
}

export function AutocompleteClear({
  "aria-label": ariaLabel = "Clear input",
  className = "",
  children = "×",
  ...props
}: WithClassName<ComponentProps<typeof AutocompletePrimitive.Clear> & { children?: ReactNode }>) {
  return (
    <AutocompletePrimitive.Clear
      aria-label={ariaLabel}
      className={`greyui-combobox-clear greyui-autocomplete-clear ${className}`.trim()}
      {...props}
    >
      {children}
    </AutocompletePrimitive.Clear>
  );
}

export function AutocompletePopup({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof AutocompletePrimitive.Popup>>) {
  const container = useLayerContainer("menu");
  return (
    <AutocompletePrimitive.Portal container={container}>
      <AutocompletePrimitive.Positioner
        className="greyui-combobox-positioner greyui-autocomplete-positioner"
        align="start"
        sideOffset={2}
      >
        <AutocompletePrimitive.Popup
          className={`greyui-combobox-popup greyui-autocomplete-popup ${className}`.trim()}
          {...props}
        />
      </AutocompletePrimitive.Positioner>
    </AutocompletePrimitive.Portal>
  );
}

export function AutocompleteList({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof AutocompletePrimitive.List>>) {
  return (
    <AutocompletePrimitive.List
      className={`greyui-combobox-list greyui-autocomplete-list ${className}`.trim()}
      {...props}
    />
  );
}

export function AutocompleteItem({
  className = "",
  children,
  ...props
}: WithClassName<ComponentProps<typeof AutocompletePrimitive.Item>>) {
  return (
    <AutocompletePrimitive.Item
      className={`greyui-combobox-item greyui-autocomplete-item ${className}`.trim()}
      {...props}
    >
      <span className="greyui-autocomplete-item-label">{children}</span>
      <span className="greyui-combobox-item-indicator greyui-autocomplete-item-indicator" aria-hidden="true">
        ✓
      </span>
    </AutocompletePrimitive.Item>
  );
}

export function AutocompleteEmpty({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof AutocompletePrimitive.Empty>>) {
  return (
    <AutocompletePrimitive.Empty
      className={`greyui-combobox-empty greyui-autocomplete-empty ${className}`.trim()}
      {...props}
    />
  );
}

export function AutocompleteGroup({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof AutocompletePrimitive.Group>>) {
  return <AutocompletePrimitive.Group className={`greyui-autocomplete-group ${className}`.trim()} {...props} />;
}

export function AutocompleteGroupLabel({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof AutocompletePrimitive.GroupLabel>>) {
  return (
    <AutocompletePrimitive.GroupLabel
      className={`greyui-autocomplete-group-label ${className}`.trim()}
      {...props}
    />
  );
}

export function AutocompleteSeparator({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof AutocompletePrimitive.Separator>>) {
  return (
    <AutocompletePrimitive.Separator
      className={`greyui-menu-separator ${className}`.trim()}
      {...props}
    />
  );
}

export const AutocompleteValue = AutocompletePrimitive.Value;
export const AutocompleteCollection = AutocompletePrimitive.Collection;
export const AutocompleteStatus = AutocompletePrimitive.Status;
export const useAutocompleteFilter = AutocompletePrimitive.useFilter;
export const useFilteredAutocompleteItems = AutocompletePrimitive.useFilteredItems;

export const Autocomplete = {
  Root: AutocompleteRoot,
  Value: AutocompleteValue,
  InputGroup: AutocompleteInputGroup,
  Input: AutocompleteInput,
  Trigger: AutocompleteTrigger,
  Clear: AutocompleteClear,
  Popup: AutocompletePopup,
  List: AutocompleteList,
  Item: AutocompleteItem,
  Empty: AutocompleteEmpty,
  Group: AutocompleteGroup,
  GroupLabel: AutocompleteGroupLabel,
  Separator: AutocompleteSeparator,
  Collection: AutocompleteCollection,
  Status: AutocompleteStatus,
  useFilter: useAutocompleteFilter,
  useFilteredItems: useFilteredAutocompleteItems,
};''',
)

checkbox_path = "src/components/checkbox.tsx"
checkbox = read(checkbox_path)
checkbox = checkbox.replace("  disabled = false,\n", "  disabled,\n")
checkbox = checkbox.replace(
    '<CheckboxPrimitive.Indicator className="greyui-checkbox-indicator">',
    '<CheckboxPrimitive.Indicator aria-hidden="true" className="greyui-checkbox-indicator">',
)
update(checkbox_path, checkbox)

index_path = "src/index.ts"
index_lines = [line for line in read(index_path).splitlines() if line.strip()]
for module in ["accordion", "autocomplete", "checkbox-group", "fieldset", "toggle-group"]:
    line = f'export * from "./components/{module}";'
    if line not in index_lines:
        index_lines.append(line)
index_lines.sort()
update(index_path, "\n".join(index_lines) + "\n")

css_path = "src/components-v2.css"
css = read(css_path)
marker = "/* High-value grouped controls */"
if marker not in css:
    css += '''\n\n/* High-value grouped controls */
.greyui-toggle-group,
.greyui-checkbox-group,
.greyui-fieldset,
.greyui-accordion,
.greyui-autocomplete-input-group,
.greyui-autocomplete-popup {
  color: var(--greyui-text);
  font-family: var(--greyui-font-ui);
  font-size: var(--greyui-font-size);
}

.greyui-toggle-group {
  display: inline-flex;
  max-width: 100%;
  align-items: stretch;
  flex-wrap: wrap;
}

.greyui-toggle-group[data-orientation="vertical"] {
  flex-direction: column;
  flex-wrap: nowrap;
}

.greyui-toggle-group-item {
  position: relative;
  min-width: 0;
}

.greyui-toggle-group[data-orientation="horizontal"] > .greyui-toggle-group-item + .greyui-toggle-group-item {
  margin-left: -1px;
}

.greyui-toggle-group[data-orientation="vertical"] > .greyui-toggle-group-item + .greyui-toggle-group-item {
  margin-top: -1px;
}

.greyui-toggle-group-item[data-pressed],
.greyui-toggle-group-item[aria-pressed="true"] {
  z-index: 1;
  background: var(--greyui-panel-dark);
  box-shadow: var(--greyui-bevel-inset);
}

.greyui-toggle-group-item:focus-visible {
  z-index: 2;
}

.greyui-checkbox-group {
  display: grid;
  min-width: 0;
  gap: 5px;
}

.greyui-checkbox-group[data-orientation="horizontal"] {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 14px;
}

.greyui-control-label:has(.greyui-checkbox[data-disabled]) {
  color: var(--greyui-text-muted);
  cursor: not-allowed;
}

.greyui-fieldset {
  min-width: 0;
  margin: 0;
  padding: 0.55rem 0.6rem 0.65rem;
  border: 1px solid var(--greyui-border-dark);
  background: var(--greyui-panel);
  box-shadow: inset 1px 1px 0 var(--greyui-border-light);
}

.greyui-fieldset-legend {
  max-width: calc(100% - 8px);
  padding: 0 4px;
  color: var(--greyui-text);
  font-weight: 700;
  line-height: 1.2;
  white-space: normal;
}

.greyui-fieldset[data-disabled] .greyui-fieldset-legend {
  color: var(--greyui-text-muted);
}

.greyui-accordion {
  display: grid;
  min-width: 0;
  gap: 3px;
}

.greyui-accordion-item {
  min-width: 0;
}

.greyui-accordion-header {
  margin: 0;
  font: inherit;
}

.greyui-accordion-trigger {
  display: flex;
  width: 100%;
  min-height: 1.85rem;
  box-sizing: border-box;
  align-items: center;
  gap: 6px;
  padding: 0.25rem 0.45rem;
  border: 1px solid var(--greyui-border-dark);
  background: var(--greyui-control);
  box-shadow: var(--greyui-bevel-outset);
  color: var(--greyui-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.greyui-accordion-trigger:hover:not([data-disabled]) {
  filter: brightness(1.03);
}

.greyui-accordion-trigger:active:not([data-disabled]),
.greyui-accordion-trigger[data-open] {
  box-shadow: var(--greyui-bevel-inset);
}

.greyui-accordion-trigger:focus-visible {
  outline: 2px solid var(--greyui-keyboard-navigation);
  outline-offset: -3px;
}

.greyui-accordion-trigger[data-disabled] {
  color: var(--greyui-text-muted);
  cursor: not-allowed;
}

.greyui-accordion-arrow {
  width: 0;
  height: 0;
  flex: 0 0 auto;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-left: 6px solid currentColor;
  transition: transform 100ms ease;
  transform-origin: 40% 50%;
}

.greyui-accordion-trigger[data-open] .greyui-accordion-arrow {
  transform: rotate(90deg);
}

.greyui-accordion-trigger-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.greyui-accordion-panel {
  min-width: 0;
  padding: 0.5rem 0.55rem;
  border: 1px solid var(--greyui-border-dark);
  border-top: 0;
  background: var(--greyui-document);
  box-shadow: var(--greyui-bevel-inset);
}

.greyui-autocomplete-item {
  grid-template-columns: minmax(0, 1fr) auto;
}

.greyui-autocomplete-item-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.greyui-autocomplete-item-indicator {
  visibility: hidden;
}

.greyui-autocomplete-item[data-selected] .greyui-autocomplete-item-indicator {
  visibility: visible;
}

.greyui-autocomplete-group + .greyui-autocomplete-group {
  margin-top: 3px;
  padding-top: 3px;
  border-top: 1px solid var(--greyui-border-dark);
}

.greyui-autocomplete-group-label {
  padding: 0.2rem 0.45rem;
  color: var(--greyui-text-muted);
  font-size: var(--greyui-font-size-small);
  font-weight: 700;
}

@media (prefers-reduced-motion: reduce) {
  .greyui-accordion-arrow {
    transition: none;
  }
}
'''
update(css_path, css)

readme_path = "README.md"
readme_lines = read(readme_path).splitlines()
additions = {
    "- Inputs:": ["Autocomplete", "Fieldset"],
    "- Controls:": ["CheckboxGroup", "ToggleGroup"],
    "- Desktop UI:": ["Accordion"],
}
for index, line in enumerate(readme_lines):
    for prefix, names in additions.items():
        if line.startswith(prefix):
            for name in names:
                if name not in line:
                    line += f", {name}"
            readme_lines[index] = line
update(readme_path, "\n".join(readme_lines) + "\n")

write(
    "docs/src/component-imports.tsx",
    '''import { CopyCommand } from "./CopyCommand";

export interface ComponentImportSpec {
  name: string;
  path: string;
  imports?: readonly string[];
}

export const COMPONENT_IMPORTS: readonly ComponentImportSpec[] = [
  { name: "Accordion", path: "accordion" },
  { name: "AlertDialog", path: "alert-dialog" },
  { name: "Autocomplete", path: "autocomplete" },
  { name: "Badge", path: "badge" },
  { name: "Banner", path: "banner" },
  { name: "Breadcrumbs", path: "breadcrumbs" },
  { name: "Button", path: "button" },
  { name: "ButtonGroup", path: "button" },
  { name: "Checkbox", path: "checkbox" },
  { name: "CheckboxGroup", path: "checkbox-group" },
  { name: "Collapsible", path: "collapsible" },
  { name: "Combobox", path: "combobox" },
  { name: "ContextMenu", path: "context-menu" },
  { name: "DatePicker", path: "date-picker" },
  { name: "Dialog", path: "dialog" },
  { name: "Empty", path: "empty" },
  { name: "Field", path: "field" },
  { name: "Fieldset", path: "fieldset" },
  { name: "GroupBox", path: "group-box" },
  { name: "IconButton", path: "button" },
  { name: "Input", path: "input" },
  { name: "InputGroup", path: "input-group" },
  { name: "Layer", path: "layer" },
  { name: "Loader", path: "loader" },
  { name: "Menu", path: "menu" },
  { name: "MenuBar", path: "window" },
  { name: "Meter", path: "meter" },
  { name: "NumberField", path: "number-field" },
  { name: "Pagination", path: "pagination" },
  { name: "Popover", path: "popover" },
  { name: "Progress", path: "progress" },
  { name: "RadioGroup", path: "radio-group" },
  { name: "ScrollArea", path: "scroll-area" },
  { name: "SegmentedControl", path: "toggle-button" },
  { name: "SegmentedMeter", path: "segmented-meter" },
  { name: "Select", path: "select" },
  { name: "Separator", path: "separator" },
  { name: "Slider", path: "slider" },
  { name: "StatusBar", path: "window" },
  { name: "StatusBarItem", path: "window" },
  { name: "StatusBarSeparator", path: "window" },
  { name: "StatusLight", path: "window" },
  { name: "Switch", path: "switch" },
  { name: "Table", path: "table" },
  { name: "Tabs", path: "tabs" },
  { name: "Textarea", path: "input" },
  { name: "Toast", path: "toast" },
  { name: "ToggleButton", path: "toggle-button" },
  { name: "ToggleGroup", path: "toggle-group" },
  { name: "Toolbar", path: "toolbar" },
  { name: "Tooltip", path: "tooltip" },
  { name: "Window", path: "window" },
  { name: "WindowWidget", path: "window" },
] as const;

export function granularImport(spec: ComponentImportSpec): string {
  const imports = spec.imports ?? [spec.name];
  return `import { ${imports.join(", ")} } from "greyui/components/${spec.path}";`;
}

export function ComponentImport(spec: ComponentImportSpec) {
  const statement = granularImport(spec);
  return (
    <div className="docs-component-import">
      <span className="docs-component-import-label">Import</span>
      <CopyCommand value={statement} label={`${spec.name} import`} />
    </div>
  );
}

export function ComponentImportCatalog() {
  return (
    <div className="docs-import-catalog">
      {COMPONENT_IMPORTS.map((spec) => (
        <div className="docs-import-catalog-row" key={spec.name}>
          <strong>{spec.name}</strong>
          <ComponentImport {...spec} />
        </div>
      ))}
    </div>
  );
}''',
)

write(
    "docs/src/high-value-components.tsx",
    '''import {
  Accordion,
  Autocomplete,
  Checkbox,
  CheckboxGroup,
  Fieldset,
  ToggleGroup,
} from "../../src";
import { ComponentImport } from "./component-imports";

const suggestions = ["BeOS R5", "Haiku", "Zeta", "NewOS"];

function ComponentDemo({
  name,
  path,
  imports,
  children,
}: {
  name: string;
  path: string;
  imports?: readonly string[];
  children: React.ReactNode;
}) {
  return (
    <article className="docs-high-value-demo">
      <div className="docs-high-value-demo-header">
        <h3>{name}</h3>
        <ComponentImport name={name} path={path} imports={imports} />
      </div>
      <div className="docs-high-value-demo-canvas">{children}</div>
    </article>
  );
}

export function HighValueComponentDemos() {
  return (
    <div className="docs-high-value-grid">
      <ComponentDemo name="ToggleGroup" path="toggle-group">
        <ToggleGroup.Root aria-label="Editor options" defaultValue={["grid"]}>
          <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
          <ToggleGroup.Item value="snap">Snap</ToggleGroup.Item>
          <ToggleGroup.Item value="guides">Guides</ToggleGroup.Item>
          <ToggleGroup.Item value="locked" disabled>
            Locked
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </ComponentDemo>

      <ComponentDemo name="Autocomplete" path="autocomplete">
        <div className="docs-high-value-stack">
          <Autocomplete.Root items={suggestions}>
            <Autocomplete.InputGroup>
              <Autocomplete.Input aria-label="Operating system" placeholder="Type any value…" />
              <Autocomplete.Clear />
              <Autocomplete.Trigger />
            </Autocomplete.InputGroup>
            <Autocomplete.Popup>
              <Autocomplete.Empty>No matching suggestion</Autocomplete.Empty>
              <Autocomplete.List>
                {(item: string) => (
                  <Autocomplete.Item key={item} value={item}>
                    {item}
                  </Autocomplete.Item>
                )}
              </Autocomplete.List>
            </Autocomplete.Popup>
          </Autocomplete.Root>
          <small>Suggestions assist entry; free-form values remain valid.</small>
        </div>
      </ComponentDemo>

      <ComponentDemo name="Accordion" path="accordion">
        <Accordion.Root defaultValue={["general"]}>
          <Accordion.Item value="general">
            <Accordion.Header>
              <Accordion.Trigger>General</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>Basic application settings.</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="advanced">
            <Accordion.Header>
              <Accordion.Trigger>Advanced</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>Cache, indexing, and integration settings.</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="managed" disabled>
            <Accordion.Header>
              <Accordion.Trigger>Managed</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>Managed by policy.</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>
      </ComponentDemo>

      <ComponentDemo name="CheckboxGroup" path="checkbox-group">
        <CheckboxGroup aria-label="Build output" defaultValue={["symbols"]}>
          <Checkbox value="symbols" label="Debug symbols" />
          <Checkbox value="map" label="Source map" />
          <Checkbox value="listing" label="Assembly listing" />
        </CheckboxGroup>
      </ComponentDemo>

      <ComponentDemo name="Fieldset" path="fieldset">
        <div className="docs-fieldset-pair">
          <Fieldset.Root>
            <Fieldset.Legend>Build output</Fieldset.Legend>
            <CheckboxGroup aria-label="Enabled build output" defaultValue={["symbols"]}>
              <Checkbox value="symbols" label="Debug symbols" />
              <Checkbox value="map" label="Source map" />
            </CheckboxGroup>
          </Fieldset.Root>
          <Fieldset.Root disabled>
            <Fieldset.Legend>Managed settings</Fieldset.Legend>
            <CheckboxGroup aria-label="Managed settings">
              <Checkbox value="policy" label="Enforce policy" />
            </CheckboxGroup>
          </Fieldset.Root>
        </div>
      </ComponentDemo>
    </div>
  );
}''',
)

main_path = "docs/src/main.tsx"
main = read(main_path)
main = insert_once(
    main,
    'import { CopyCommand } from "./CopyCommand";\n',
    'import { ComponentImportCatalog } from "./component-imports";\nimport { HighValueComponentDemos } from "./high-value-components";\n',
)
main = insert_once(
    main,
    '  ["principles", "Principles"],\n',
    '  ["imports", "Imports"],\n',
)
main = insert_once(
    main,
    '  ["selection", "Selection"],\n',
    '  ["high-value", "Grouped controls"],\n',
)
imports_section = '''\n\n          <Section
            id="imports"
            title="Component imports"
            intro="Copy the granular ESM import for any component. Import the shared stylesheet once from greyui/styles.css."
          >
            <ComponentImportCatalog />
          </Section>'''
main = insert_once(main, '          <Section\n            id="buttons"', imports_section + "\n\n", before=True)
high_value_section = '''\n\n          <Section
            id="high-value"
            title="Grouped controls and suggestions"
            intro={
              <>
                Stateful grouped controls and disclosures use Base UI behavior while retaining the
                compact geometry used by <a href={WORKBENCH_URL}>WorkbenchOS</a>.
              </>
            }
          >
            <HighValueComponentDemos />
          </Section>'''
main = insert_once(main, '          <Section\n            id="desktop"', high_value_section + "\n\n", before=True)
update(main_path, main)

docs_css_path = "docs/src/docs.css"
docs_css = read(docs_css_path)
if "/* Component import catalog */" not in docs_css:
    docs_css += '''\n\n/* Component import catalog */
.docs-component-import {
  display: grid;
  min-width: 0;
  gap: 3px;
}

.docs-component-import-label {
  color: var(--greyui-text-muted);
  font-size: var(--greyui-font-size-small);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.docs-component-import > *:last-child {
  min-width: 0;
}

.docs-import-catalog {
  display: grid;
  min-width: 0;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 5px;
}

.docs-import-catalog-row {
  display: grid;
  min-width: 0;
  gap: 4px;
  padding: 6px;
  border: 1px solid var(--greyui-border-dark);
  background: var(--greyui-panel);
  box-shadow: var(--greyui-bevel-outset);
}

.docs-import-catalog-row strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.docs-high-value-grid {
  display: grid;
  min-width: 0;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.docs-high-value-demo {
  min-width: 0;
  border: 1px solid var(--greyui-border-dark);
  background: var(--greyui-panel);
  box-shadow: var(--greyui-bevel-outset);
}

.docs-high-value-demo-header {
  display: grid;
  min-width: 0;
  gap: 5px;
  padding: 6px;
  border-bottom: 1px solid var(--greyui-border-dark);
  background: var(--greyui-panel-light);
}

.docs-high-value-demo-header h3 {
  margin: 0;
  font-size: var(--greyui-font-size);
}

.docs-high-value-demo-canvas {
  min-width: 0;
  padding: 10px;
  background: var(--greyui-document);
}

.docs-high-value-stack,
.docs-fieldset-pair {
  display: grid;
  min-width: 0;
  gap: 8px;
}

.docs-high-value-stack small {
  color: var(--greyui-text-muted);
}

@media (max-width: 767px) {
  .docs-import-catalog,
  .docs-high-value-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
'''
update(docs_css_path, docs_css)

write(
    "tests/high-value-components.test.tsx",
    '''import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  Accordion,
  Autocomplete,
  Checkbox,
  CheckboxGroup,
  Fieldset,
  ToggleGroup,
} from "../src";

afterEach(cleanup);

describe("high-value component behavior", () => {
  it("shares pressed state through ToggleGroup", () => {
    render(
      <ToggleGroup.Root aria-label="Editor options" defaultValue={["grid"]}>
        <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
        <ToggleGroup.Item value="snap">Snap</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );

    const grid = screen.getByRole("button", { name: "Grid" });
    const snap = screen.getByRole("button", { name: "Snap" });
    expect(grid.getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(snap);
    expect(snap.getAttribute("aria-pressed")).toBe("true");
  });

  it("keeps Autocomplete input free-form while filtering suggestions", () => {
    render(
      <Autocomplete.Root items={["BeOS R5", "Haiku"]}>
        <Autocomplete.InputGroup>
          <Autocomplete.Input aria-label="Operating system" />
          <Autocomplete.Clear />
          <Autocomplete.Trigger />
        </Autocomplete.InputGroup>
        <Autocomplete.Popup>
          <Autocomplete.List>
            {(item: string) => (
              <Autocomplete.Item key={item} value={item}>
                {item}
              </Autocomplete.Item>
            )}
          </Autocomplete.List>
        </Autocomplete.Popup>
      </Autocomplete.Root>,
    );

    const input = screen.getByRole("combobox", { name: "Operating system" });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Hai" } });
    expect(screen.getByRole("option", { name: "Haiku" })).not.toBeNull();
    expect(screen.queryByRole("option", { name: "BeOS R5" })).toBeNull();

    fireEvent.change(input, { target: { value: "Custom OS" } });
    fireEvent.blur(input);
    expect((input as HTMLInputElement).value).toBe("Custom OS");
  });

  it("opens Accordion panels through their trigger", () => {
    render(
      <Accordion.Root>
        <Accordion.Item value="advanced">
          <Accordion.Header>
            <Accordion.Trigger>Advanced</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>Advanced settings</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>,
    );

    const trigger = screen.getByRole("button", { name: "Advanced" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Advanced settings")).not.toBeNull();
  });

  it("groups Checkbox values without polluting accessible names", () => {
    render(
      <CheckboxGroup aria-label="Build output" defaultValue={["symbols"]}>
        <Checkbox value="symbols" label="Debug symbols" />
        <Checkbox value="map" label="Source map" />
      </CheckboxGroup>,
    );

    const symbols = screen.getByRole("checkbox", { name: "Debug symbols" });
    const sourceMap = screen.getByRole("checkbox", { name: "Source map" });
    expect(symbols.getAttribute("aria-checked")).toBe("true");
    fireEvent.click(sourceMap);
    expect(sourceMap.getAttribute("aria-checked")).toBe("true");
  });

  it("propagates disabled Fieldset state to custom Checkbox controls", () => {
    render(
      <Fieldset.Root disabled>
        <Fieldset.Legend>Managed settings</Fieldset.Legend>
        <CheckboxGroup aria-label="Managed settings">
          <Checkbox value="policy" label="Enforce policy" />
        </CheckboxGroup>
      </Fieldset.Root>,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Enforce policy" });
    expect(
      checkbox.hasAttribute("disabled") ||
        checkbox.hasAttribute("data-disabled") ||
        checkbox.getAttribute("aria-disabled") === "true",
    ).toBe(true);
  });
});''',
)

write(
    "tests/component-imports.test.tsx",
    '''import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  COMPONENT_IMPORTS,
  ComponentImport,
  granularImport,
} from "../docs/src/component-imports";

afterEach(cleanup);

describe("component import documentation", () => {
  it("covers every public component module with a granular import", () => {
    const componentsDirectory = fileURLToPath(new URL("../src/components", import.meta.url));
    const sourceModules = readdirSync(componentsDirectory)
      .filter((name) => name.endsWith(".ts") || name.endsWith(".tsx"))
      .map((name) => name.replace(/\\.tsx?$/, ""))
      .sort();
    const documentedModules = [...new Set(COMPONENT_IMPORTS.map((spec) => spec.path))].sort();

    expect(documentedModules).toEqual(sourceModules);
  });

  it("renders and copies the granular import", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(<ComponentImport name="Accordion" path="accordion" />);
    const statement = 'import { Accordion } from "greyui/components/accordion";';
    expect(screen.getByText(statement)).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Copy Accordion import" }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(statement));
    expect(granularImport({ name: "Accordion", path: "accordion" })).toBe(statement);
  });
});''',
)

print("Applied high-value component implementation")
