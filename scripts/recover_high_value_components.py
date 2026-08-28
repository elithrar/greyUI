from __future__ import annotations

from pathlib import Path
import re
import runpy

ROOT = Path(__file__).resolve().parents[1]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def write(path: str, content: str) -> None:
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding="utf-8")


def replace_once(source: str, old: str, new: str, label: str) -> str:
    if old not in source:
        raise RuntimeError(f"Missing replacement anchor: {label}")
    return source.replace(old, new, 1)


apply_path = ROOT / "scripts/apply_high_value_components.py"
apply_source = apply_path.read_text(encoding="utf-8")
apply_source = replace_once(
    apply_source,
    "main = insert_once(main, '          <Section\\n            id=\"buttons\"'",
    "main = insert_once(main, '            <Section\\n              id=\"buttons\"'",
    "buttons docs section",
)
apply_source = replace_once(
    apply_source,
    "main = insert_once(main, '          <Section\\n            id=\"desktop\"'",
    "main = insert_once(main, '            <Section\\n              id=\"desktop\"'",
    "desktop docs section",
)
apply_path.write_text(apply_source, encoding="utf-8")
runpy.run_path(str(apply_path), run_name="__main__")

imports_test = read("tests/component-imports.test.tsx")
imports_test = replace_once(
    imports_test,
    'import { fileURLToPath } from "node:url";',
    'import { resolve } from "node:path";',
    "portable component test path import",
)
imports_test = replace_once(
    imports_test,
    'fileURLToPath(new URL("../src/components", import.meta.url))',
    'resolve(process.cwd(), "src/components")',
    "portable component test path",
)
imports_test = replace_once(
    imports_test,
    "const writeText = vi.fn().mockResolvedValue(undefined);",
    "const writeText = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined);",
    "clipboard mock type",
)
write("tests/component-imports.test.tsx", imports_test)

docs = read("docs/src/high-value-components.tsx")
docs = replace_once(
    docs,
    "        <ComponentImport name={name} path={path} imports={imports} />",
    """        {imports === undefined ? (
          <ComponentImport name={name} path={path} />
        ) : (
          <ComponentImport name={name} path={path} imports={imports} />
        )}""",
    "optional imports prop",
)
write("docs/src/high-value-components.tsx", docs)

write(
    "src/fieldset-context.ts",
    """import { createContext, useContext } from "react";

export const FieldsetDisabledContext = createContext(false);

export function useFieldsetDisabled() {
  return useContext(FieldsetDisabledContext);
}
""",
)

fieldset = read("src/components/fieldset.tsx")
fieldset = replace_once(
    fieldset,
    'import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset";',
    'import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset";\nimport { FieldsetDisabledContext, useFieldsetDisabled } from "../fieldset-context";',
    "fieldset context import",
)
fieldset_root = """export function FieldsetRoot({
  className = "",
  disabled = false,
  children,
  ...props
}: WithClassName<ComponentProps<typeof FieldsetPrimitive.Root>>) {
  const parentDisabled = useFieldsetDisabled();
  const resolvedDisabled = parentDisabled || disabled;

  return (
    <FieldsetDisabledContext.Provider value={resolvedDisabled}>
      <FieldsetPrimitive.Root
        data-greyui-component="fieldset"
        disabled={resolvedDisabled}
        className={`greyui-fieldset ${className}`.trim()}
        {...props}
      >
        {children}
      </FieldsetPrimitive.Root>
    </FieldsetDisabledContext.Provider>
  );
}
"""
fieldset, count = re.subn(
    r"export function FieldsetRoot\(\{.*?\n\}\n\n(?=export function FieldsetLegend)",
    fieldset_root + "\n",
    fieldset,
    count=1,
    flags=re.S,
)
if count != 1:
    raise RuntimeError("Could not replace generated Fieldset root")
write("src/components/fieldset.tsx", fieldset)

checkbox = read("src/components/checkbox.tsx")
checkbox = replace_once(
    checkbox,
    'import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";',
    'import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";\nimport { useFieldsetDisabled } from "../fieldset-context";',
    "checkbox fieldset context import",
)
checkbox = replace_once(
    checkbox,
    "}: CheckboxProps) {\n  const control = (",
    "}: CheckboxProps) {\n  const fieldsetDisabled = useFieldsetDisabled();\n  const resolvedDisabled = fieldsetDisabled || disabled === true;\n\n  const control = (",
    "checkbox disabled resolution",
)
checkbox = replace_once(
    checkbox,
    "      disabled={disabled}\n",
    "      disabled={resolvedDisabled}\n",
    "checkbox primitive disabled prop",
)
checkbox = replace_once(
    checkbox,
    'data-disabled={disabled ? "" : undefined}',
    'data-disabled={resolvedDisabled ? "" : undefined}',
    "checkbox label disabled state",
)
write("src/components/checkbox.tsx", checkbox)

autocomplete = read("src/components/autocomplete.tsx")
autocomplete_root = """export function AutocompleteRoot<ItemValue>({
  openOnInputClick = true,
  ...props
}: AutocompletePrimitive.Root.Props<ItemValue>) {
  const rootProps = props as Omit<AutocompletePrimitive.Root.Props<ItemValue>, "items"> & {
    items?: readonly ItemValue[];
  };

  return (
    <AutocompletePrimitive.Root openOnInputClick={openOnInputClick} {...rootProps} />
  );
}"""
autocomplete = replace_once(
    autocomplete,
    "export const AutocompleteRoot = AutocompletePrimitive.Root;",
    autocomplete_root,
    "Autocomplete root wrapper",
)
write("src/components/autocomplete.tsx", autocomplete)

interactions = read("tests/high-value-components.test.tsx")
interactions = replace_once(
    interactions,
    '    fireEvent.focus(input);\n    fireEvent.change(input, { target: { value: "Hai" } });',
    '    fireEvent.focus(input);\n    fireEvent.input(input, { target: { value: "Hai" }, inputType: "insertText" });',
    "Autocomplete typed input interaction",
)
interactions = replace_once(
    interactions,
    '''    expect(
      checkbox.hasAttribute("disabled") ||
        checkbox.hasAttribute("data-disabled") ||
        checkbox.getAttribute("aria-disabled") === "true",
    ).toBe(true);''',
    '''    expect(checkbox.hasAttribute("data-disabled")).toBe(true);
    fireEvent.click(checkbox);
    expect(checkbox.getAttribute("aria-checked")).toBe("false");''',
    "Fieldset disabled interaction",
)
write("tests/high-value-components.test.tsx", interactions)

print("Recovered high-value component source")
