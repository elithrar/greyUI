from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    file = Path(path)
    source = file.read_text()
    count = source.count(old)
    if count != 1:
        raise RuntimeError(f"Expected one match in {path}, found {count}: {old[:80]!r}")
    file.write_text(source.replace(old, new, 1))


replace_once(
    "src/components/select.tsx",
    "<SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>",
    '''<SelectPrimitive.ItemText className="greyui-select-item-text">
                    {option.label}
                  </SelectPrimitive.ItemText>''',
)

replace_once(
    "src/styles.css",
    '''.greyui-select-list {
  padding: 0;
}''',
    '''.greyui-select-list {
  min-width: max-content;
  padding: 0;
}''',
)

replace_once(
    "src/styles.css",
    '''.greyui-select-item {
  display: grid;
  grid-template-columns: 1rem minmax(0, 1fr);
  gap: 0.35rem;
  align-items: center;
  min-height: 24px;
  padding: 0.3rem 0.5rem;
  color: var(--greyui-text);
  outline: none;
  cursor: pointer;
}''',
    '''.greyui-select-item {
  display: grid;
  width: 100%;
  min-height: 24px;
  box-sizing: border-box;
  grid-template-columns: 1rem minmax(0, 1fr);
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.5rem;
  color: var(--greyui-text);
  outline: none;
  cursor: pointer;
  white-space: nowrap;
}

.greyui-select-item-text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}''',
)

replace_once(
    "src/components-v2.css",
    '''.greyui-fieldset {
  min-width: 0;
  margin: 0;
  padding: 0.55rem 0.6rem 0.65rem;
  border: 1px solid var(--greyui-border-dark);
  background: var(--greyui-panel);
  box-shadow: inset 1px 1px 0 var(--greyui-border-light);
}''',
    '''.greyui-fieldset {
  min-width: 0;
  margin: 0;
  padding: 0.55rem 0.6rem 0.65rem;
  border: 1px solid var(--greyui-control-border);
  background: var(--greyui-panel);
  box-shadow: var(--greyui-bevel-inset);
}''',
)

replace_once(
    "src/components-v2.css",
    '''.greyui-accordion-panel {
  min-width: 0;
  padding: 0.5rem 0.55rem;
  border: 1px solid var(--greyui-border-dark);
  border-top: 0;
  background: var(--greyui-document);
  box-shadow: var(--greyui-bevel-inset);
}''',
    '''.greyui-accordion-panel {
  min-width: 0;
  padding: 0.5rem 0.55rem;
  border: 1px solid var(--greyui-control-border);
  border-top: 0;
  background: var(--greyui-panel);
  box-shadow: var(--greyui-bevel-inset);
}''',
)

path = Path("docs/src/component-imports.tsx")
source = path.read_text()
source = source.replace(').join(" ");', ').join("\\n");', 1)
source = source.replace(
    '<div className="docs-section-import">',
    '<div className="docs-section-import" role="note" aria-label={`${label} imports`}>',
    1,
)
path.write_text(source)

path = Path("docs/src/docs.css")
source = path.read_text()
start = source.index("/* Section imports */")
end = source.index(".docs-high-value-grid {", start)
import_styles = '''/* Section imports */
.docs-section-import {
  display: grid;
  width: min(100%, 760px);
  min-width: 0;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  gap: 8px;
  margin: -6px 0 14px;
  padding: 5px 6px;
  border: 1px solid var(--greyui-control-border);
  background: var(--greyui-panel);
  box-shadow: var(--greyui-bevel-inset);
  color: var(--greyui-text);
}

.docs-section-import-label {
  padding-top: 1px;
  color: var(--greyui-text-muted);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.docs-section-import .docs-copy-command {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  align-items: start;
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
  color: var(--greyui-text);
  font-size: 11px;
  line-height: 1.35;
}

.docs-section-import .docs-copy-command-text {
  min-width: 0;
  overflow: visible;
  text-overflow: clip;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.docs-section-import .docs-copy-command:hover,
.docs-section-import .docs-copy-command:focus-visible {
  outline: 1px dotted var(--greyui-keyboard-navigation);
  outline-offset: 2px;
}

.docs-section-import .docs-copy-command:active,
.docs-section-import .docs-copy-command[data-copied="true"] {
  background: transparent;
  box-shadow: none;
}

.docs-section-import .docs-copy-command-icon {
  width: auto;
  height: auto;
  border: 0;
  background: transparent;
  box-shadow: none;
  color: var(--greyui-text-muted);
  font: 700 9px / 1 var(--greyui-font-ui);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.docs-section-import .docs-copy-command-icon::before {
  content: "Copy";
  position: static;
  width: auto;
  height: auto;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.docs-section-import .docs-copy-command[data-copied="true"] .docs-copy-command-icon::before {
  content: "Copied";
}

.docs-section-import .docs-copy-command[data-copied="true"] .docs-copy-command-icon::after {
  content: none;
}

'''
source = source[:start] + import_styles + source[end:]
source = source.replace(
    '''.docs-high-value-demo-canvas {
  min-width: 0;
  padding: 10px;
  background: var(--greyui-document);
}''',
    '''.docs-high-value-demo-canvas {
  min-width: 0;
  padding: 10px;
  background: var(--greyui-panel);
}''',
    1,
)
path.write_text(source)

path = Path("tests/component-imports.test.tsx")
source = path.read_text()
source = source.replace(
    '''      'import { Button, ButtonGroup, IconButton } from "greyui/components/button"; ' +
        'import { SegmentedControl, ToggleButton } from "greyui/components/toggle-button";',
''',
    '''      'import { Button, ButtonGroup, IconButton } from "greyui/components/button";\\n' +
        'import { SegmentedControl, ToggleButton } from "greyui/components/toggle-button";',
''',
    1,
)
source = source.replace(
    '''    render(<ComponentImport imports={imports} label="Buttons" />);

    expect(screen.getByText(statement)).not.toBeNull();''',
    '''    render(<ComponentImport imports={imports} label="Buttons" />);

    expect(screen.getByRole("note", { name: "Buttons imports" })).not.toBeNull();
    expect(screen.getByText(statement)).not.toBeNull();''',
    1,
)
path.write_text(source)

path = Path("tests/styles.test.ts")
source = path.read_text()
marker = "\n});\n"
head, tail = source.rsplit(marker, 1)
additions = '''

  it("keeps Select menu labels single-line within a content-sized popup", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");

    expect(css).toMatch(/\\.greyui-select-list\\s*\\{[\\s\\S]*?min-width:\\s*max-content/);
    expect(css).toMatch(/\\.greyui-select-item-text\\s*\\{[\\s\\S]*?white-space:\\s*nowrap/);
  });

  it("uses standard panel surfaces for grouped controls", () => {
    const css = readFileSync(resolve(process.cwd(), "src/components-v2.css"), "utf8");

    expect(css).toMatch(/\\.greyui-fieldset\\s*\\{[\\s\\S]*?background:\\s*var\\(--greyui-panel\\)/);
    expect(css).toMatch(
      /\\.greyui-accordion-panel\\s*\\{[\\s\\S]*?background:\\s*var\\(--greyui-panel\\)/,
    );
  });'''
path.write_text(head + additions + marker + tail)
