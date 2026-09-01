from pathlib import Path
import re


def read(path: str) -> str:
    return Path(path).read_text()


def write(path: str, value: str) -> None:
    Path(path).write_text(value)


def replace_once(path: str, old: str, new: str) -> None:
    source = read(path)
    count = source.count(old)
    if count != 1:
        raise RuntimeError(f"Expected one match in {path}, found {count}: {old[:120]!r}")
    write(path, source.replace(old, new, 1))


def replace_css_block(path: str, selector: str, replacement: str, after: str | None = None) -> None:
    source = read(path)
    search_start = 0 if after is None else source.index(after) + len(after)
    start = source.index(f"{selector} {{", search_start)
    opening = source.index("{", start)
    depth = 0
    end = None
    for index in range(opening, len(source)):
        char = source[index]
        if char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                end = index + 1
                break
    if end is None:
        raise RuntimeError(f"Could not find end of CSS block {selector}")
    write(path, source[:start] + replacement + source[end:])


def insert_after_css_block(path: str, selector: str, addition: str) -> None:
    source = read(path)
    start = source.index(f"{selector} {{")
    opening = source.index("{", start)
    depth = 0
    end = None
    for index in range(opening, len(source)):
        char = source[index]
        if char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                end = index + 1
                break
    if end is None:
        raise RuntimeError(f"Could not find end of CSS block {selector}")
    write(path, source[:end] + "\n\n" + addition.strip() + source[end:])


# Expose the complete chrome composition through Window.* as well as standalone exports.
replace_once(
    "src/components/window.tsx",
    '''  Description: WindowDescription,
  Actions: WindowActions,
  StatusBar,
});''',
    '''  Description: WindowDescription,
  Actions: WindowActions,
  MenuBar,
  StatusBar,
});''',
)

styles = "src/styles.css"

# Align the shell geometry with WorkbenchOS: the tab participates in grid flow and
# offsets into the 3px exterior frame instead of being absolutely overlaid on a
# synthetic top padding rail.
replace_css_block(
    styles,
    ".greyui-window",
    '''.greyui-window {
  position: relative;
  display: grid;
  gap: 0;
  isolation: isolate;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  padding: 0 3px 3px;
  border: 0;
  background: transparent;
  box-shadow: 3px 3px 6px rgb(0 0 0 / 22%);
  color: var(--greyui-text);
  font: 400 var(--greyui-font-size) / 1.5 var(--greyui-font-ui);
}''',
)

replace_css_block(
    styles,
    ".greyui-window-tab",
    '''.greyui-window-tab {
  position: relative;
  z-index: 3;
  justify-self: start;
  display: flex;
  align-items: stretch;
  width: max-content;
  margin-left: -3px;
  max-width: min(34rem, calc(100% - 18px));
  min-height: var(--greyui-tab-height);
  box-sizing: border-box;
  border: 1px solid var(--greyui-tab-active-dark);
  border-bottom: 0;
  border-radius: 1px 1px 0 0;
  background: var(--greyui-tab-gradient-active);
  box-shadow:
    inset 1px 1px 0 rgb(255 255 255 / 75%),
    inset -1px 0 0 var(--greyui-tab-active-dark),
    1px 0 0 rgb(0 0 0 / 22%);
  color: var(--greyui-tab-text);
  cursor: default;
  user-select: none;
}''',
)

# Preserve the legacy padded body for simple windows. Complete windows opt into
# structural rails simply by composing MenuBar/Content/StatusBar as direct children.
replace_css_block(
    styles,
    ".greyui-window-body",
    '''.greyui-window-body {
  position: relative;
  z-index: 2;
  min-width: 0;
  min-height: 0;
  padding: 0.5rem;
  overflow: auto;
  border: 1px solid var(--greyui-border-dark);
  background: var(--greyui-panel);
  box-shadow: var(--greyui-bevel-inset);
}''',
)

replace_css_block(
    styles,
    ".greyui-window-content",
    '''.greyui-window-content {
  display: grid;
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  min-height: 0;
  max-width: 100%;
  box-sizing: border-box;
  gap: 12px;
  padding: 12px;
  overflow: auto;
}''',
)

replace_css_block(
    styles,
    ".greyui-window-header",
    '''.greyui-window-header {
  display: flex;
  min-width: 0;
  max-width: 100%;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px 12px;
}''',
)

replace_css_block(
    styles,
    ".greyui-window-description",
    '''.greyui-window-description {
  flex: 1 1 18rem;
  min-width: 0;
  max-width: 48rem;
  margin: 0;
  color: var(--greyui-text-muted);
}''',
)

replace_css_block(
    styles,
    ".greyui-window-actions",
    '''.greyui-window-actions {
  display: flex;
  flex: 0 1 auto;
  min-width: 0;
  max-width: 100%;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 8px;
  margin-left: auto;
}''',
)

insert_after_css_block(
    styles,
    ".greyui-window-actions",
    '''.greyui-window-content > *,
.greyui-window-actions > * {
  min-width: 0;
  max-width: 100%;
}

.greyui-window-actions .greyui-field-action-row {
  max-width: 100%;
  flex-wrap: wrap;
}

/* A complete Window uses the body as a structural frame. Content owns the
   scroll/padding rail; menu and status bars draw only their internal separator,
   leaving the body bevel as the single perimeter. */
.greyui-window-body:has(> .greyui-window-content),
.greyui-window-body:has(> .greyui-menubar),
.greyui-window-body:has(> .greyui-statusbar) {
  padding: 0;
}

.greyui-window-body:has(> .greyui-window-content) {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.greyui-window-body > .greyui-menubar {
  flex: 0 0 auto;
  border-width: 0 0 1px;
  box-shadow: inset 0 1px 0 var(--greyui-border-light);
}

.greyui-window-body > .greyui-statusbar {
  flex: 0 0 auto;
  border-width: 1px 0 0;
  box-shadow: inset 0 1px 0 var(--greyui-border-light);
}''',
)

# The old 520px rules described a grid header. Keep the small-screen behavior,
# but express it in terms of the flex layout used at every width.
replace_css_block(
    styles,
    ".greyui-window-header",
    '''.greyui-window-header {
    align-items: stretch;
  }''',
    after="@media (max-width: 520px)",
)
replace_css_block(
    styles,
    ".greyui-window-actions",
    '''.greyui-window-actions {
    width: 100%;
    margin-left: 0;
    justify-content: flex-start;
  }''',
    after="@media (max-width: 520px)",
)

# Turn the dense example into the canonical complete-window composition. Window.Actions
# itself owns wrapping, so callers should not need an extra Field.ActionRow to prevent overflow.
write(
    "docs/src/dense-window-example.tsx",
    '''import {
  Button,
  Checkbox,
  Fieldset,
  Input,
  Menu,
  Select,
  StatusBarItem,
  StatusLight,
  Table,
  Window,
} from "../../src";

const presets = [
  { value: "915-61", label: "Porsche 915/61" },
  { value: "915-63", label: "Porsche 915/63" },
];

const gears = [
  { label: "Gear 1", value: "11:35" },
  { label: "Gear 2", value: "18:33" },
  { label: "Gear 3", value: "23:29" },
  { label: "Gear 4", value: "26:26" },
  { label: "Gear 5", value: "29:22" },
  { label: "Gear 6", value: "" },
];

export function DenseWindowExample() {
  return (
    <Window title="Gearset" responsive="stacked" className="docs-dense-window">
      <Window.MenuBar aria-label="Gearset menu bar">
        <Menu.Root>
          <Menu.Trigger>File</Menu.Trigger>
          <Menu.Popup>
            <Menu.Item>New preset</Menu.Item>
            <Menu.Item>Open preset…</Menu.Item>
          </Menu.Popup>
        </Menu.Root>
        <Menu.Root>
          <Menu.Trigger>Edit</Menu.Trigger>
          <Menu.Popup>
            <Menu.Item>Reset ratios</Menu.Item>
          </Menu.Popup>
        </Menu.Root>
      </Window.MenuBar>

      <Window.Content>
        <Window.Header>
          <Window.Description>
            Configure the transmission and its operating limits. The description and controls share
            the same content rails as the grouped fields below.
          </Window.Description>
          <Window.Actions>
            <Select label="Preset" defaultValue="915-61" options={presets} />
            <Button type="button">Copy link</Button>
          </Window.Actions>
        </Window.Header>

        <Fieldset.Root variant="plain" aria-label="Transmission gears">
          <div className="docs-dense-fieldset-heading">
            <div>
              <strong>Tooth counts</strong>
              <p>Enter driving:driven pairs. Sixth gear is optional.</p>
            </div>
            <Checkbox label="Use direct ratios" />
          </div>
          <div className="docs-dense-field-grid">
            {gears.map((gear) => (
              <label className="docs-field" key={gear.label}>
                <span>{gear.label}</span>
                <Input
                  defaultValue={gear.value}
                  placeholder={gear.value === "" ? "Optional" : undefined}
                />
              </label>
            ))}
          </div>
        </Fieldset.Root>

        <Table aria-label="Calculated gear speeds">
          <thead>
            <tr>
              <th>Gear</th>
              <th>Ratio</th>
              <th>Speed</th>
              <th>RPM drop</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1st</td>
              <td>3.182</td>
              <td>43 mph</td>
              <td>—</td>
            </tr>
            <tr>
              <td>2nd</td>
              <td>1.833</td>
              <td>75 mph</td>
              <td>3,353</td>
            </tr>
          </tbody>
        </Table>
      </Window.Content>

      <Window.StatusBar>
        <StatusBarItem grow>URL-compatible teeth and direct-ratio input</StatusBarItem>
        <StatusLight state="ready" label="Gearset ready" />
      </Window.StatusBar>
    </Window>
  );
}

export const denseWindowCode = `<Window title="Gearset" responsive="stacked">
  <Window.MenuBar>{/* File / Edit menus */}</Window.MenuBar>
  <Window.Content>
    <Window.Header>
      <Window.Description>Configure the transmission.</Window.Description>
      <Window.Actions>
        <Select label="Preset" options={presets} />
        <Button>Copy link</Button>
      </Window.Actions>
    </Window.Header>
    <Fieldset.Root variant="plain">{/* grouped inputs */}</Fieldset.Root>
    <Table>{/* results */}</Table>
  </Window.Content>
  <Window.StatusBar>Ready</Window.StatusBar>
</Window>`;
''',
)

# Keep the docs concise: one sentence describing the canonical rails.
main_path = "docs/src/main.tsx"
main = read(main_path)
main = re.sub(
    r'(<Guidance title="Dense application composition" code=\{denseWindowCode\}>\s*<p>)[\s\S]*?(</p>)',
    r'''\1
                  Compose complete application windows as <code>Window.MenuBar</code>,
                  <code> Window.Content</code>, and <code>Window.StatusBar</code>; Content owns the
                  padded scroll rail, while Header/Actions wrap inside it.
                \2''',
    main,
    count=1,
)
write(main_path, main)

# Mirror the canonical layout in the short README contract.
readme = read("README.md")
readme = readme.replace(
    '`Window` supports controlled/uncontrolled collapse and `responsive="stacked"` or `"floating"`. Use `Window.Content` for standard body rails and compose `Window.Header`, `Window.Description`, and `Window.Actions` for responsive in-body headers. `Popover.Popup.positionerProps` accepts Base UI positioning options such as virtual anchors.',
    '`Window` supports controlled/uncontrolled collapse and `responsive="stacked"` or `"floating"`. Complete windows compose `Window.MenuBar`, `Window.Content`, and `Window.StatusBar`; `Window.Header`/`Window.Actions` provide a wrapping content header. `Popover.Popup.positionerProps` accepts Base UI positioning options such as virtual anchors.',
    1,
)
write("README.md", readme)

# Extend the existing Window composition test instead of adding a parallel API test.
components_path = "tests/components.test.tsx"
components = read(components_path)
pattern = re.compile(
    r'  it\("provides stable content-rail, header, description, and action slots", \(\) => \{[\s\S]*?\n  \}\);',
)
replacement = '''  it("provides stable complete-window rails and wrapping content slots", () => {
    render(
      <Window title="Gearset">
        <Window.MenuBar aria-label="Gearset menu bar">Menu</Window.MenuBar>
        <Window.Content density="compact">
          <Window.Header>
            <Window.Description>Configure the transmission.</Window.Description>
            <Window.Actions>
              <Button>Copy link</Button>
            </Window.Actions>
          </Window.Header>
        </Window.Content>
        <Window.StatusBar>Ready</Window.StatusBar>
      </Window>,
    );

    const content = screen
      .getByText("Configure the transmission.")
      .closest('[data-greyui-component="window-content"]');
    expect(content?.getAttribute("data-density")).toBe("compact");
    expect(content?.querySelector(".greyui-window-header")).not.toBeNull();
    expect(content?.querySelector(".greyui-window-description")).not.toBeNull();
    expect(content?.querySelector(".greyui-window-actions")).not.toBeNull();
    expect(screen.getByLabelText("Gearset menu bar").classList.contains("greyui-menubar")).toBe(true);
    expect(screen.getByText("Ready").classList.contains("greyui-statusbar")).toBe(true);
  });'''
components, count = pattern.subn(replacement, components, count=1)
if count != 1:
    raise RuntimeError(f"Expected one Window composition test, replaced {count}")
write(components_path, components)

# Update CSS assertions to guard the actual layout invariants rather than the old grid implementation.
styles_test_path = "tests/styles.test.ts"
styles_test = read(styles_test_path)
old = '''  it("provides content rails and a stacked application header without styling body internals", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");

    expect(css).toMatch(/\\.greyui-window-content\\s*\\{[\\s\\S]*?padding:\\s*12px/);
    expect(css).toMatch(
      /\\.greyui-window-header\\s*\\{[\\s\\S]*?grid-template-columns:\\s*minmax\\(0, 1fr\\) auto/,
    );
    expect(css).toMatch(
      /@media \\(max-width: 520px\\)[\\s\\S]*?\\.greyui-window-header\\s*\\{[\\s\\S]*?grid-template-columns:\\s*minmax\\(0, 1fr\\)/,
    );
  });'''
new = '''  it("provides bounded complete-window rails and wrapping application headers", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");

    expect(css).toMatch(/\\.greyui-window\\s*\\{[\\s\\S]*?padding:\\s*0 3px 3px/);
    expect(css).toMatch(
      /\\.greyui-window-tab\\s*\\{[\\s\\S]*?position:\\s*relative;[\\s\\S]*?margin-left:\\s*-3px/,
    );
    expect(css).toMatch(
      /\\.greyui-window-content\\s*\\{[\\s\\S]*?max-width:\\s*100%;[\\s\\S]*?padding:\\s*12px;[\\s\\S]*?overflow:\\s*auto/,
    );
    expect(css).toMatch(
      /\\.greyui-window-header\\s*\\{[\\s\\S]*?display:\\s*flex;[\\s\\S]*?flex-wrap:\\s*wrap/,
    );
    expect(css).toMatch(
      /\\.greyui-window-actions\\s*\\{[\\s\\S]*?max-width:\\s*100%;[\\s\\S]*?flex-wrap:\\s*wrap/,
    );
    expect(css).toMatch(
      /\\.greyui-window-body:has\\(> \\.greyui-window-content\\)[\\s\\S]*?padding:\\s*0/,
    );
    expect(css).toMatch(
      /\\.greyui-window-body > \\.greyui-menubar\\s*\\{[\\s\\S]*?border-width:\\s*0 0 1px/,
    );
    expect(css).toMatch(
      /\\.greyui-window-body > \\.greyui-statusbar\\s*\\{[\\s\\S]*?border-width:\\s*1px 0 0/,
    );
  });'''
if old not in styles_test:
    raise RuntimeError("Could not find window content rail style test")
write(styles_test_path, styles_test.replace(old, new, 1))

# Dense docs should demonstrate the complete composition and avoid the redundant nested ActionRow.
docs_test_path = "tests/docs.test.tsx"
docs_test = read(docs_test_path)
docs_test = docs_test.replace(
    '''    expect(denseWindow).toContain("<Window.Content>");
    expect(denseWindow).toContain("<Window.Header>");''',
    '''    expect(denseWindow).toContain("<Window.MenuBar");
    expect(denseWindow).toContain("<Window.Content>");
    expect(denseWindow).toContain("<Window.Header>");''',
    1,
)
docs_test = docs_test.replace(
    '''    expect(denseWindow).toContain("<Window.Actions>");''',
    '''    expect(denseWindow).toContain("<Window.Actions>");
    expect(denseWindow).toContain("<Window.StatusBar>");
    expect(denseWindow).not.toContain("<Field.ActionRow>");''',
    1,
)
write(docs_test_path, docs_test)

print("Hardened window geometry, complete-layout rails, and dense example")
