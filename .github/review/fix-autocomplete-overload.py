from pathlib import Path

path = Path("src/components/autocomplete.tsx")
source = path.read_text()
source = source.replace(
    'import type { ComponentProps, ReactNode } from "react";',
    'import type { ComponentProps, ReactElement, ReactNode } from "react";',
    1,
)
old = '''export function AutocompleteRoot<ItemValue>({
  openOnInputClick = true,
  ...props
}: AutocompletePrimitive.Root.Props<ItemValue>) {
  return <AutocompletePrimitive.Root openOnInputClick={openOnInputClick} {...props} />;
}'''
new = '''type AutocompleteRootImplementation = <ItemValue>(
  props: AutocompletePrimitive.Root.Props<ItemValue>,
) => ReactElement;

// SAFETY: Base UI 1.7 implements Root with Root.Props<ItemValue>; its public
// overloads narrow `items` only to improve flat/grouped inference at call sites.
const renderAutocompleteRoot = AutocompletePrimitive.Root as AutocompleteRootImplementation;

export function AutocompleteRoot<ItemValue>({
  openOnInputClick = true,
  ...props
}: AutocompletePrimitive.Root.Props<ItemValue>) {
  return renderAutocompleteRoot({ openOnInputClick, ...props });
}'''
if source.count(old) != 1:
    raise RuntimeError("Expected the assertion-free AutocompleteRoot from the first remediation pass")
path.write_text(source.replace(old, new, 1))
