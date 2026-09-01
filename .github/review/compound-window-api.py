from pathlib import Path
import re


def read(path: str) -> str:
    return Path(path).read_text()


def write(path: str, content: str) -> None:
    Path(path).write_text(content)


def replace_once(path: str, old: str, new: str) -> None:
    source = read(path)
    count = source.count(old)
    if count != 1:
        raise RuntimeError(f"Expected one match in {path}, found {count}: {old[:100]!r}")
    write(path, source.replace(old, new, 1))


# Canonicalize all window chrome under Window.*. Keep public prop types prefixed
# with Window, but stop exporting standalone runtime aliases pre-1.0.
path = "src/components/window.tsx"
source = read(path)
source = source.replace("<WindowWidget\n", "<WindowWidgetControl\n")
source = source.replace("export function WindowWidget({", "function WindowWidgetControl({")
source = source.replace("export type MenuBarProps =", "export type WindowMenuBarProps =")
source = source.replace(
    "export function MenuBar({ className = \"\", ...props }: MenuBarProps)",
    "function WindowMenuBar({ className = \"\", ...props }: WindowMenuBarProps)",
)
source = source.replace("export type StatusBarProps =", "export type WindowStatusBarProps =")
source = source.replace(
    "export function StatusBar({ className = \"\", ...props }: StatusBarProps)",
    "function WindowStatusBarRoot({ className = \"\", ...props }: WindowStatusBarProps)",
)
source = source.replace("export interface StatusBarItemProps", "export interface WindowStatusBarItemProps")
source = source.replace(
    "export function StatusBarItem({ className = \"\", grow = false, ...props }: StatusBarItemProps)",
    "function WindowStatusBarItem({ className = \"\", grow = false, ...props }: WindowStatusBarItemProps)",
)
source = source.replace("export type StatusBarSeparatorProps =", "export type WindowStatusBarSeparatorProps =")
source = source.replace(
    "export function StatusBarSeparator({ className = \"\", ...props }: StatusBarSeparatorProps)",
    "function WindowStatusBarSeparator({ className = \"\", ...props }: WindowStatusBarSeparatorProps)",
)
source = source.replace("export interface StatusLightProps", "export interface WindowStatusLightProps")
source = source.replace(
    "export function StatusLight({ className = \"\", label, state = \"idle\", ...props }: StatusLightProps)",
    "function WindowStatusLight({ className = \"\", label, state = \"idle\", ...props }: WindowStatusLightProps)",
)
marker = "export const Window = Object.assign(WindowComponent, {"
if marker not in source:
    raise RuntimeError("Window compound export marker missing")
source = source.replace(
    marker,
    '''const WindowStatusBar = Object.assign(WindowStatusBarRoot, {
  Item: WindowStatusBarItem,
  Separator: WindowStatusBarSeparator,
  Light: WindowStatusLight,
});

export const Window = Object.assign(WindowComponent, {''',
    1,
)
source = source.replace(
    '''  Controls: WindowControls,
  Collapse: WindowCollapse,
  Body: WindowBody,''',
    '''  Controls: WindowControls,
  Widget: WindowWidgetControl,
  Collapse: WindowCollapse,
  Body: WindowBody,''',
    1,
)
source = source.replace(
    '''  Description: WindowDescription,
  Actions: WindowActions,
  StatusBar,
});''',
    '''  Description: WindowDescription,
  Actions: WindowActions,
  MenuBar: WindowMenuBar,
  StatusBar: WindowStatusBar,
});''',
    1,
)
write(path, source)

# Migrate repository consumers to the canonical compound API.
jsx_paths = [
    "docs/src/main.tsx",
    "docs/src/next-components.tsx",
    "docs/src/dense-window-example.tsx",
    "tests/components.test.tsx",
]
old_runtime_exports = [
    "MenuBar",
    "StatusBar",
    "StatusBarItem",
    "StatusBarSeparator",
    "StatusLight",
    "WindowWidget",
]
for jsx_path in jsx_paths:
    source = read(jsx_path)
    for name in old_runtime_exports:
        source = re.sub(rf"^\s{{2}}{name},\n", "", source, flags=re.MULTILINE)

    replacements = [
        ("<StatusBarSeparator", "<Window.StatusBar.Separator"),
        ("<StatusBarItem", "<Window.StatusBar.Item"),
        ("</StatusBarItem>", "</Window.StatusBar.Item>"),
        ("<StatusLight", "<Window.StatusBar.Light"),
        ("<StatusBar", "<Window.StatusBar"),
        ("</StatusBar>", "</Window.StatusBar>"),
        ("<MenuBar", "<Window.MenuBar"),
        ("</MenuBar>", "</Window.MenuBar>"),
        ("<WindowWidget", "<Window.Widget"),
        ("WindowWidget", "Window.Widget"),
    ]
    for old, new in replacements:
        source = source.replace(old, new)
    write(jsx_path, source)

# README should describe one coherent Window surface, not legacy root exports.
replace_once(
    "README.md",
    "- Window chrome: Window, WindowWidget, MenuBar, StatusBar, StatusBarItem, StatusBarSeparator, StatusLight",
    "- Window chrome: Window (`Window.Widget`, `Window.MenuBar`, `Window.StatusBar.*`)",
)

# Record the intentional pre-1.0 break in the release notes.
replace_once(
    "CHANGELOG.md",
    "## Unreleased\n\n",
    "## Unreleased\n\n- Scope window chrome under `Window` (`Window.Widget`, `Window.MenuBar`, and `Window.StatusBar.*`) and remove the standalone pre-1.0 runtime exports.\n",
)

# Assert both the new compound surface and removal of legacy aliases.
test_path = "tests/components.test.tsx"
test_source = read(test_path)
if 'import * as GreyUI from "../src";' not in test_source:
    first_import_end = test_source.find("\n", test_source.find("from \"../src\""))
    # The main component import is multiline; insert after its terminating semicolon.
    import_end = test_source.find(";\n", test_source.find('from "../src"')) + 2
    if import_end < 2:
        raise RuntimeError("Could not find component import block")
    test_source = test_source[:import_end] + 'import * as GreyUI from "../src";\n' + test_source[import_end:]

anchor = 'describe("greyUI components", () => {'
if anchor not in test_source:
    raise RuntimeError("Component test describe block missing")
compound_test = '''describe("window compound API", () => {
  it("scopes window chrome under Window without standalone aliases", () => {
    expect(GreyUI).not.toHaveProperty("MenuBar");
    expect(GreyUI).not.toHaveProperty("StatusBar");
    expect(GreyUI).not.toHaveProperty("StatusBarItem");
    expect(GreyUI).not.toHaveProperty("StatusBarSeparator");
    expect(GreyUI).not.toHaveProperty("StatusLight");
    expect(GreyUI).not.toHaveProperty("WindowWidget");

    expect(Window).toHaveProperty("Widget");
    expect(Window).toHaveProperty("MenuBar");
    expect(Window.StatusBar).toHaveProperty("Item");
    expect(Window.StatusBar).toHaveProperty("Separator");
    expect(Window.StatusBar).toHaveProperty("Light");
  });
});

'''
test_source = test_source.replace(anchor, compound_test + anchor, 1)
write(test_path, test_source)

# Guard against any remaining runtime usages or imports in repository-owned TSX.
for jsx_path in jsx_paths:
    source = read(jsx_path)
    for name in old_runtime_exports:
        if re.search(rf"^\s{{2}}{name},$", source, flags=re.MULTILINE):
            raise RuntimeError(f"Legacy {name} import remains in {jsx_path}")

print("Migrated window chrome to the canonical Window compound API")
