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
  { name: "createVirtualAnchor", path: "popover" },
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

const componentImportByName = new Map(COMPONENT_IMPORTS.map((spec) => [spec.name, spec]));

export function granularImport(spec: ComponentImportSpec): string {
  const imports = spec.imports ?? [spec.name];
  return `import { ${imports.join(", ")} } from "greyui/components/${spec.path}";`;
}

export function groupedGranularImports(imports: readonly string[]): readonly string[] {
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
  return groupedGranularImports(imports).join("\n");
}

export function ComponentImport({ imports, label }: { imports: readonly string[]; label: string }) {
  const statement = groupedGranularImport(imports);

  return (
    <div className="docs-component-import" role="note" aria-label={`${label} imports`}>
      <span className="docs-component-import-label">Import</span>
      <CopyCommand value={statement} label={`${label} import`} />
    </div>
  );
}
