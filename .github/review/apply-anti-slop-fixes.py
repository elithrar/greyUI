from pathlib import Path


def read(path: str) -> str:
    return Path(path).read_text()


def write(path: str, source: str) -> None:
    Path(path).write_text(source)


def replace_once(path: str, old: str, new: str) -> None:
    source = read(path)
    count = source.count(old)
    if count != 1:
        raise RuntimeError(f"Expected one match in {path}, found {count}: {old[:120]!r}")
    write(path, source.replace(old, new, 1))


# SegmentedMeter: model the custom CSS property in the local type instead of
# asserting the complete object after construction.
replace_once(
    "src/components/segmented-meter.tsx",
    'type SegmentStyle = CSSProperties & { "--greyui-segment-color"?: string };\n',
    '''type SegmentStyle = CSSProperties & { "--greyui-segment-color"?: string };

function getSegmentStyle(segment: SegmentedMeterSegment): SegmentStyle {
  const style: SegmentStyle = {
    flexGrow: Math.max(0, segment.value),
    flexBasis: 0,
  };
  if (segment.color !== undefined) {
    style["--greyui-segment-color"] = segment.color;
  }
  return style;
}
''',
)
replace_once(
    "src/components/segmented-meter.tsx",
    '''          style={
            {
              flexGrow: Math.max(0, segment.value),
              flexBasis: 0,
              "--greyui-segment-color": segment.color,
            } as SegmentStyle
          }''',
    '''          style={getSegmentStyle(segment)}''',
)

# Autocomplete: Base UI 1.7 already accepts readonly items in Root.Props. The
# wrapper can preserve that contract directly without widening/rest-asserting.
replace_once(
    "src/components/autocomplete.tsx",
    '''export function AutocompleteRoot<ItemValue>({
  openOnInputClick = true,
  ...props
}: AutocompletePrimitive.Root.Props<ItemValue>) {
  const rootProps = props as Omit<AutocompletePrimitive.Root.Props<ItemValue>, "items"> & {
    items?: readonly ItemValue[];
  };

  return <AutocompletePrimitive.Root openOnInputClick={openOnInputClick} {...rootProps} />;
}''',
    '''export function AutocompleteRoot<ItemValue>({
  openOnInputClick = true,
  ...props
}: AutocompletePrimitive.Root.Props<ItemValue>) {
  return <AutocompletePrimitive.Root openOnInputClick={openOnInputClick} {...props} />;
}''',
)

# Layer: construct the fixed layer record with typed keys rather than asserting
# Object.fromEntries results. Access document through globalThis so SSR does not
# need runtime typeof narrowing.
layer = read("src/components/layer.tsx")
start = layer.index('export type LayerName =')
context = layer.index('const LayerContext =', start)
new_prefix = '''const layerNames = ["menu", "popover", "overlay", "dialog", "toast", "tooltip"] as const;

export type LayerName = (typeof layerNames)[number];

type LayerContainers = Record<LayerName, HTMLDivElement | null>;

function createLayerRecord<Value>(createValue: (name: LayerName) => Value): Record<LayerName, Value> {
  return {
    menu: createValue("menu"),
    popover: createValue("popover"),
    overlay: createValue("overlay"),
    dialog: createValue("dialog"),
    toast: createValue("toast"),
    tooltip: createValue("tooltip"),
  };
}

'''
layer = layer[:start] + new_prefix + layer[context:]
old_state = '''  const [containers, setContainers] = useState<LayerContainers>(
    () => Object.fromEntries(layerNames.map((name) => [name, null])) as LayerContainers,
  );
  const hostRefs = useMemo(
    () =>
      Object.fromEntries(
        layerNames.map((name) => [
          name,
          (node: HTMLDivElement | null) =>
            setContainers((current) =>
              current[name] === node ? current : { ...current, [name]: node },
            ),
        ]),
      ) as Record<LayerName, (node: HTMLDivElement | null) => void>,
    [],
  );
  const portalTarget = container ?? (typeof document === "undefined" ? null : document.body);'''
new_state = '''  const [containers, setContainers] = useState<LayerContainers>(() =>
    createLayerRecord(() => null),
  );
  const hostRefs = useMemo(
    () =>
      createLayerRecord(
        (name) => (node: HTMLDivElement | null) =>
          setContainers((current) =>
            current[name] === node ? current : { ...current, [name]: node },
          ),
      ),
    [],
  );
  const portalTarget = container ?? globalThis.document?.body ?? null;'''
if layer.count(old_state) != 1:
    raise RuntimeError("Could not replace Layer state construction")
layer = layer.replace(old_state, new_state, 1)
layer = layer.replace(
    '''  const context = useContext(LayerContext);
  if (typeof document === "undefined") return null;
  const target = context === null ? document.body : context[layer];''',
    '''  const context = useContext(LayerContext);
  const document = globalThis.document;
  if (!document) return null;
  const target = context === null ? document.body : context[layer];''',
    1,
)
write("src/components/layer.tsx", layer)

# Loader: keep the public string-or-number API, but name the narrowing and type
# the CSS custom property at construction time.
loader = '''import type { ComponentPropsWithoutRef, CSSProperties } from "react";

export type LoaderSize = "sm" | "base" | "lg" | number;

export interface LoaderProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  label?: string;
  size?: LoaderSize;
}

type LoaderStyle = CSSProperties & { "--greyui-loader-size": string };

const loaderSizes = { sm: 16, base: 24, lg: 32 } as const;

function isCustomLoaderSize(size: LoaderSize): size is number {
  return typeof size === "number";
}

export function Loader({
  className = "",
  label = "Loading",
  size = "base",
  style,
  ...props
}: LoaderProps) {
  const customSize = isCustomLoaderSize(size);
  const pixelSize = customSize ? size : loaderSizes[size];
  const loaderStyle: LoaderStyle = { "--greyui-loader-size": `${pixelSize}px`, ...style };

  return (
    <span
      role="status"
      aria-label={label}
      data-greyui-component="loader"
      data-size={customSize ? "custom" : size}
      className={`greyui-loader ${className}`.trim()}
      style={loaderStyle}
      {...props}
    />
  );
}
'''
write("src/components/loader.tsx", loader)

# Pagination: dispatch function children through an explicit type guard. This is
# a real part of the public union contract, not an I/O boundary parser.
replace_once(
    "src/components/pagination.tsx",
    '''export interface PaginationInfoProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  children?: ReactNode | PaginationInfoRenderer;
}

export function PaginationInfo({ children, className = "", ...props }: PaginationInfoProps) {''',
    '''export interface PaginationInfoProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  children?: ReactNode | PaginationInfoRenderer;
}

function isPaginationInfoRenderer(
  children: PaginationInfoProps["children"],
): children is PaginationInfoRenderer {
  return typeof children === "function";
}

export function PaginationInfo({ children, className = "", ...props }: PaginationInfoProps) {''',
)
replace_once(
    "src/components/pagination.tsx",
    '    typeof children === "function"\n      ? children(value)',
    '    isPaginationInfoRenderer(children)\n      ? children(value)',
)

# Copy fallback: optional method lookup is enough; no ad-hoc typeof branch is
# needed for a DOM API that may be absent in jsdom/older browsers.
replace_once(
    "docs/src/CopyCommand.tsx",
    '''function copyWithTemporaryField(value: string) {
  if (typeof document.execCommand !== "function") {
    return false;
  }

  let field: HTMLTextAreaElement | undefined;''',
    '''function copyWithTemporaryField(value: string) {
  const copy = document.execCommand?.bind(document);
  if (!copy) return false;

  let field: HTMLTextAreaElement | undefined;''',
)
replace_once(
    "docs/src/CopyCommand.tsx",
    '    return document.execCommand("copy");',
    '    return copy("copy");',
)

# Repository-owned package.json is a controlled boundary. Keep the small cast,
# but state the invariant anti-slop requires us to rely on.
for path, needle in [
    ("docs/vite.config.ts", 'const { version: packageVersion } = JSON.parse('),
    ("vitest.config.ts", 'const { version: packageVersion } = JSON.parse('),
    ("tests/docs.test.tsx", 'const { version: packageVersion } = JSON.parse('),
]:
    source = read(path)
    if source.count(needle) != 1:
        raise RuntimeError(f"Could not find package version assertion in {path}")
    source = source.replace(
        needle,
        '// SAFETY: package.json is repository-owned and npm requires `version` to be a string.\n' + needle,
        1,
    )
    write(path, source)

# Tests can ask Testing Library for the concrete element type rather than
# asserting after the query.
for path in ["tests/high-value-components.test.tsx", "tests/components.test.tsx"]:
    source = read(path)
    source = source.replace(
        'screen.getByRole("combobox", { name: "Operating system" })',
        'screen.getByRole<HTMLInputElement>("combobox", { name: "Operating system" })',
    )
    source = source.replace(
        'screen.getByRole("textbox", { name: "Count" })',
        'screen.getByRole<HTMLInputElement>("textbox", { name: "Count" })',
    )
    source = source.replace(
        'screen.getByRole("combobox", { name: "Theme" })',
        'screen.getByRole<HTMLInputElement>("combobox", { name: "Theme" })',
    )
    source = source.replace('(input as HTMLInputElement).value', 'input.value')
    write(path, source)

# The restore helper only ever operates on these two concrete DOM owners.
replace_once(
    "tests/docs.test.tsx",
    '''function restoreProperty(
  target: object,
  property: PropertyKey,
  descriptor: PropertyDescriptor | undefined,
) {''',
    '''function restoreProperty(
  target: Navigator | Document,
  property: PropertyKey,
  descriptor: PropertyDescriptor | undefined,
) {''',
)

print("Applied anti-slop-guided fixes")
