import { CopyCommand } from "./CopyCommand";

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
}
