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


main_path = "docs/src/main.tsx"
main = read(main_path)
main = main.replace(
    'const WORKBENCH_URL = "https://workbench.questionable.services/";\n',
    'const WORKBENCH_URL = "https://workbench.questionable.services/";\nconst BASE_UI_COMPONENTS_URL = "https://base-ui.com/react/components";\n',
    1,
)

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
new_demo = '''function CodeDetails({ code, label = "Usage" }: { code: string; label?: string }) {
  return (
    <details className="docs-code-details">
      <summary>{label}</summary>
      <pre className="docs-code">
        <code>{code}</code>
      </pre>
    </details>
  );
}

function Demo({ title, children, code }: { title: string; children: ReactNode; code?: string }) {
  return (
    <div className="docs-demo">
      <div className="docs-demo-title">{title}</div>
      <div className="docs-demo-canvas">{children}</div>
      {code ? <CodeDetails code={code} /> : null}
    </div>
  );
}'''
if main.count(old_demo) != 1:
    raise RuntimeError("Could not replace Demo")
main = main.replace(old_demo, new_demo, 1)

section_end = '''  );
}

function App() {'''
guidance = '''  );
}

function Guidance({
  title,
  children,
  code,
  codeLabel,
}: {
  title: string;
  children: ReactNode;
  code?: string;
  codeLabel?: string;
}) {
  return (
    <aside className="docs-guidance" aria-label={title}>
      <strong className="docs-guidance-title">{title}</strong>
      <div className="docs-guidance-body">{children}</div>
      {code ? <CodeDetails code={code} label={codeLabel} /> : null}
    </aside>
  );
}

function App() {'''
if main.count(section_end) != 1:
    raise RuntimeError("Could not insert Guidance")
main = main.replace(section_end, guidance, 1)

main = main.replace(
    '''            <div className="docs-deskbar-footer">
              React 19
              <br />
              Base UI 1.7
            </div>''',
    '''            <div className="docs-deskbar-footer">
              React
              <br />
              Base UI
            </div>''',
    1,
)

principles_close = '''              </div>
            </Section>

            <Section
              id="buttons"'''
principles_new = '''              </div>
              <Guidance title="API conventions">
                <ul>
                  <li>
                    Import <code>greyui/styles.css</code> once. Root imports are the simplest path;
                    granular <code>greyui/components/*</code> entrypoints are optional.
                  </li>
                  <li>
                    Simple controls accept native element props. Compound controls use
                    <code> Root</code> plus named parts, with Base UI providing keyboard, focus, and
                    ARIA behavior.
                  </li>
                  <li>
                    These docs cover greyUI-specific defaults and composition. Use the
                    <a href={BASE_UI_COMPONENTS_URL}> Base UI component reference</a> for exhaustive
                    primitive props.
                  </li>
                </ul>
                <CopyCommand value={COMPONENT_IMPORT_EXAMPLE} label="component import example" />
              </Guidance>
            </Section>

            <Section
              id="buttons"'''
if main.count(principles_close) != 1:
    raise RuntimeError("Could not add API conventions")
main = main.replace(principles_close, principles_new, 1)

buttons_marker = '''            >
              <Demo
                title="Variants"'''
buttons_new = '''            >
              <Guidance title="Button behavior">
                <ul>
                  <li>
                    <code>Button</code> defaults to <code>type="button"</code>; set
                    <code> type="submit"</code> explicitly inside forms.
                  </li>
                  <li>
                    <code>defaultAction</code> adds the default-action outline; it does not change
                    form semantics.
                  </li>
                  <li>
                    <code>IconButton</code> requires a text <code>label</code> for its accessible
                    name.
                  </li>
                </ul>
              </Guidance>
              <Demo
                title="Variants"'''
# This marker appears more than once in the file; anchor it within the Buttons section.
buttons_index = main.index('id="buttons"')
marker_index = main.index(buttons_marker, buttons_index)
main = main[:marker_index] + main[marker_index:].replace(buttons_marker, buttons_new, 1)

fields_marker = '''            >
              <div className="docs-grid-2">
                <Demo title="Input">'''
fields_new = '''            >
              <Guidance title="Choose the field">
                <ul>
                  <li>
                    <code>Select</code>: a small fixed list with no text entry.
                  </li>
                  <li>
                    <code>Combobox</code>: searchable selection where the committed value comes from
                    the item list.
                  </li>
                  <li>
                    <code>Autocomplete</code>: free-form text with suggestions; typed values remain
                    valid even when they are not listed.
                  </li>
                  <li>
                    <code>NumberField</code>: numeric editing with keyboard stepping and scrub
                    interaction.
                  </li>
                </ul>
              </Guidance>
              <div className="docs-grid-2">
                <Demo title="Input">'''
fields_index = main.index('id="fields"')
marker_index = main.index(fields_marker, fields_index)
main = main[:marker_index] + main[marker_index:].replace(fields_marker, fields_new, 1)

old_select_demo = '''                <Demo title="Select">
                  <Select'''
new_select_demo = '''                <Demo
                  title="Select"
                  code={
                    '<Select\\n  label="Theme"\\n  options={[\\n    { value: "beos", label: "BeOS R5" },\\n    { value: "haiku", label: "Haiku" },\\n  ]}\\n/>'
                  }
                >
                  <Select'''
if main.count(old_select_demo) != 1:
    raise RuntimeError("Could not add Select usage")
main = main.replace(old_select_demo, new_select_demo, 1)

high_marker = '''            >
              <HighValueComponentDemos />
            </Section>'''
high_new = '''            >
              <Guidance title="Composition choices">
                <ul>
                  <li>
                    <code>ToggleGroup</code> owns selected values. <code>SegmentedControl</code> is a
                    visual group for caller-controlled <code>ToggleButton</code> state.
                  </li>
                  <li>
                    <code>CheckboxGroup</code> owns checkbox values. <code>Fieldset</code> adds native
                    fieldset/legend semantics and propagates disabled state.
                  </li>
                  <li>
                    Use <code>Accordion</code> for related disclosure sections and
                    <code> Collapsible</code> for a single disclosure.
                  </li>
                </ul>
              </Guidance>
              <HighValueComponentDemos />
            </Section>'''
high_index = main.index('id="high-value"')
marker_index = main.index(high_marker, high_index)
main = main[:marker_index] + main[marker_index:].replace(high_marker, high_new, 1)

feedback_marker = '''            >
              <FeedbackDemos />
            </Section>'''
feedback_new = '''            >
              <Guidance
                title="Choose feedback"
                code={'<Toast.Provider>\\n  <App />\\n  <Toast.Toaster />\\n</Toast.Provider>'}
                codeLabel="Toast setup"
              >
                <ul>
                  <li>
                    <code>Progress</code> describes task completion or indeterminate work;
                    <code> Meter</code> describes a bounded measurement.
                  </li>
                  <li>
                    <code>Banner</code> is persistent inline feedback; <code>Toast</code> is transient
                    notification UI.
                  </li>
                  <li>
                    Toasts require a <code>Toast.Provider</code> and one <code>Toast.Toaster</code> in
                    the owning scope.
                  </li>
                </ul>
              </Guidance>
              <FeedbackDemos />
            </Section>'''
feedback_index = main.index('id="feedback"')
marker_index = main.index(feedback_marker, feedback_index)
main = main[:marker_index] + main[marker_index:].replace(feedback_marker, feedback_new, 1)

old_groupbox = '''              <GroupBox title="GroupBox component" className="docs-import-guide">
                <div className="docs-import-guide-example">
                  <p>
                    <code>GroupBox</code> is greyUI&apos;s titled, inset container for related
                    controls and content.
                  </p>
                  <CopyCommand value={COMPONENT_IMPORT_EXAMPLE} label="component import example" />
                </div>
                <ul>
                  <li>
                    Import <code>greyui/styles.css</code> once in your application entry point.
                  </li>
                  <li>
                    Use the root entry shown here, or granular entries under
                    <code> greyui/components/*</code>.
                  </li>
                  <li>
                    Use <code>GroupBox</code> for compact titled groups like this one.
                  </li>
                </ul>
              </GroupBox>'''
new_groupbox = '''              <GroupBox title="GroupBox component" className="docs-groupbox-guide">
                <p>
                  <code>GroupBox</code> is a visual, titled container for related application
                  controls and content.
                </p>
                <ul>
                  <li>Use it for compact titled sections such as settings or inspector groups.</li>
                  <li>
                    Use <code>Fieldset</code> instead when related form controls need
                    fieldset/legend semantics or shared disabled state.
                  </li>
                </ul>
              </GroupBox>'''
if main.count(old_groupbox) != 1:
    raise RuntimeError("Could not simplify GroupBox guide")
main = main.replace(old_groupbox, new_groupbox, 1)

overlays_marker = '''            >
              <div className="docs-grid-2 docs-component-grid">'''
overlays_new = '''            >
              <Guidance
                title="Overlay contract"
                code={'<Layer.Provider>\\n  <App />\\n</Layer.Provider>'}
                codeLabel="Application setup"
              >
                <ul>
                  <li>
                    Mount one <code>Layer.Provider</code> near the application root when using
                    menus, popovers, dialogs, toasts, or tooltips; greyUI routes them into stable
                    top-level hosts.
                  </li>
                  <li>
                    Use <code>Dialog</code> for modal tasks and <code>AlertDialog</code> for decisions
                    that require explicit confirmation.
                  </li>
                  <li>
                    Context menus are enhancements: keep important actions reachable without
                    right-click.
                  </li>
                </ul>
              </Guidance>
              <div className="docs-grid-2 docs-component-grid">'''
overlays_index = main.index('id="overlays"')
marker_index = main.index(overlays_marker, overlays_index)
main = main[:marker_index] + main[marker_index:].replace(overlays_marker, overlays_new, 1)

old_window_demo = '''              <Demo title="Active and inactive windows">'''
new_window_demo = '''              <Demo
                title="Active and inactive windows"
                code={'<Window title="Preferences" collapsible responsive="stacked">\\n  …\\n</Window>'}
              >'''
if main.count(old_window_demo) != 1:
    raise RuntimeError("Could not add Window usage")
main = main.replace(old_window_demo, new_window_demo, 1)

tokens_marker = '''            >
              <div className="docs-token-grid">'''
tokens_new = '''            >
              <Guidance
                title="Theme overrides"
                code={
                  '[data-greyui-theme="custom"] {\\n  --greyui-panel: #d4d4d4;\\n  --greyui-selection: #356c9f;\\n}'
                }
                codeLabel="CSS example"
              >
                <p>
                  Override tokens at a theme boundary rather than targeting component internals.
                  Keep document/editing surfaces distinct from neutral panel surfaces.
                </p>
              </Guidance>
              <div className="docs-token-grid">'''
tokens_index = main.index('id="tokens"')
marker_index = main.index(tokens_marker, tokens_index)
main = main[:marker_index] + main[marker_index:].replace(tokens_marker, tokens_new, 1)

main = main.replace(
    '              greyUI {GREYUI_VERSION} · React 19 · Base UI 1.7',
    '              greyUI {GREYUI_VERSION} · React · Base UI',
    1,
)

old_root = '''createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);'''
new_root = '''const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("greyUI docs root element is missing.");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);'''
if main.count(old_root) != 1:
    raise RuntimeError("Could not tighten docs root handling")
main = main.replace(old_root, new_root, 1)
write(main_path, main)

# Documentation-only styles: distinguish guidance from actual greyUI components,
# keep code opt-in, and simplify the GroupBox example layout.
css_path = "docs/src/docs.css"
css = read(css_path)
old_guide_css = '''.docs-import-guide {
  grid-column: 1 / -1;
  margin-bottom: 14px;
}
.docs-import-guide .greyui-groupbox-body {
  grid-template-columns: minmax(0, 1.15fr) minmax(15rem, 0.85fr);
  align-items: start;
  gap: 12px;
}
.docs-import-guide-example {
  display: grid;
  min-width: 0;
  gap: 6px;
}
.docs-import-guide p,
.docs-import-guide ul {
  margin-top: 0;
  margin-bottom: 0;
}
.docs-import-guide p {
  line-height: 1.4;
}
.docs-import-guide .docs-copy-command {
  width: 100%;
}
.docs-import-guide code {
  font-size: inherit;
}
'''
new_guide_css = '''.docs-groupbox-guide {
  margin-bottom: 14px;
}
.docs-groupbox-guide p,
.docs-groupbox-guide ul {
  margin-top: 0;
  margin-bottom: 0;
}
.docs-groupbox-guide p {
  line-height: 1.4;
}
.docs-groupbox-guide code {
  font-size: inherit;
}

.docs-guidance {
  min-width: 0;
  margin: 0 0 12px;
  padding: 8px 10px;
  border-top: 1px solid var(--greyui-control-border);
  border-bottom: 1px solid var(--greyui-control-border);
  border-left: 3px solid var(--greyui-border-dark);
}
.docs-guidance-title {
  display: block;
  margin-bottom: 4px;
  font-size: 11px;
}
.docs-guidance-body > :first-child {
  margin-top: 0;
}
.docs-guidance-body > :last-child {
  margin-bottom: 0;
}
.docs-guidance ul {
  margin: 0;
  padding-left: 18px;
  line-height: 1.45;
}
.docs-guidance li + li {
  margin-top: 2px;
}
.docs-guidance a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.docs-guidance .docs-copy-command {
  width: min(100%, 720px);
  margin-top: 7px;
}
'''
if css.count(old_guide_css) != 1:
    raise RuntimeError("Could not replace import-guide CSS")
css = css.replace(old_guide_css, new_guide_css, 1)

old_code_css = '''.docs-code {
  margin: 0;
  padding: 10px 12px;
  overflow: auto;
  border-top: 1px solid var(--greyui-border-dark);
  background: #fff;
  box-shadow: inset 0 1px #ddd;
  font-size: 11px;
  line-height: 1.45;
}
'''
new_code_css = '''.docs-code-details {
  border-top: 1px solid var(--greyui-border-dark);
}
.docs-code-details summary {
  padding: 5px 7px;
  color: var(--greyui-text-muted);
  cursor: pointer;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.docs-code-details[open] summary {
  border-bottom: 1px solid var(--greyui-control-border);
}
.docs-code {
  margin: 0;
  padding: 10px 12px;
  overflow: auto;
  background: #fff;
  box-shadow: inset 0 1px #ddd;
  font-size: 11px;
  line-height: 1.45;
}
.docs-guidance .docs-code-details {
  margin-top: 7px;
  border: 1px solid var(--greyui-control-border);
  background: var(--greyui-panel-light);
}
'''
if css.count(old_code_css) != 1:
    raise RuntimeError("Could not replace code CSS")
css = css.replace(old_code_css, new_code_css, 1)
css = css.replace(
    '''  .docs-import-guide .greyui-groupbox-body {
    grid-template-columns: minmax(0, 1fr);
  }
''',
    '',
    1,
)
write(css_path, css)

# README: make the public contract and component choices explicit without
# duplicating Base UI's exhaustive prop tables.
readme_path = "README.md"
readme = read(readme_path)
anchor = '''Both forms use the same build graph. CI checks that representative root imports tree-shake to comparable consumer bundles as their component subpaths. React and React DOM remain peer dependencies.

## Use locally
'''
replacement = '''Both forms use the same build graph. CI checks that representative root imports tree-shake to comparable consumer bundles as their component subpaths. React and React DOM remain peer dependencies.

## API conventions

- Simple controls accept the corresponding native element props. Compound controls use `Root` plus named parts and preserve Base UI keyboard, focus, positioning, and ARIA behavior.
- The greyUI docs describe greyUI-specific defaults, composition, and visual behavior. Use the [Base UI component reference](https://base-ui.com/react/components) for exhaustive primitive props.
- `Button` defaults to `type="button"`; opt into submit behavior explicitly.
- Wrap applications that use menus, popovers, dialogs, toasts, or tooltips in `Layer.Provider` so overlays share stable top-level hosts.

## Choosing components

- `Select` is for a fixed list; `Combobox` is for searchable selection; `Autocomplete` keeps free-form text valid while offering suggestions.
- `GroupBox` is visual grouping. Use `Fieldset` when related form controls need fieldset/legend semantics or shared disabled state.
- `Progress` reports task completion or indeterminate work. `Meter` reports a bounded measurement.
- `Accordion` groups related disclosures; `Collapsible` handles a single disclosure.

## Use locally
'''
if readme.count(anchor) != 1:
    raise RuntimeError("Could not add README API conventions")
readme = readme.replace(anchor, replacement, 1)
readme = readme.replace(
    '`npm run check` runs Oxfmt, Oxlint, TypeScript, and Vitest.',
    '`npm run check` runs Oxfmt, Oxlint with the vendored anti-slop rules, TypeScript, and Vitest.',
    1,
)
write(readme_path, readme)

# Make the new typed Oxlint config part of the TypeScript-checked config surface.
tsconfig_path = "tsconfig.json"
tsconfig = read(tsconfig_path)
tsconfig = tsconfig.replace(
    '    "vite.config.ts",\n',
    '    "vite.config.ts",\n    "oxlint.config.ts",\n',
    1,
)
write(tsconfig_path, tsconfig)

# Extend structural regression coverage for the technical documentation contract.
tests_path = "tests/docs.test.tsx"
tests = read(tests_path)
old_expectations = '''    expect(componentDocs).not.toContain("ComponentImport");
    expect(principlesSection).not.toContain('title="GroupBox component"');
    expect(patternsSection).toContain('title="GroupBox component"');
    expect(main).toContain('import { Button, GroupBox, Select, Window } from "greyui";');
    expect(main).toContain('label="git clone command"');'''
new_expectations = '''    expect(componentDocs).not.toContain("ComponentImport");
    expect(principlesSection).not.toContain('title="GroupBox component"');
    expect(principlesSection).toContain('title="API conventions"');
    expect(patternsSection).toContain('title="GroupBox component"');
    expect(patternsSection).toContain("Use <code>Fieldset</code> instead");
    expect(main).toContain('title="Choose the field"');
    expect(main).toContain('title="Composition choices"');
    expect(main).toContain('title="Choose feedback"');
    expect(main).toContain('title="Overlay contract"');
    expect(main).toContain('title="Theme overrides"');
    expect(main).toContain('href={BASE_UI_COMPONENTS_URL}');
    expect(main).toContain('import { Button, GroupBox, Select, Window } from "greyui";');
    expect(main).toContain('label="git clone command"');'''
if tests.count(old_expectations) != 1:
    raise RuntimeError("Could not update docs structure tests")
tests = tests.replace(old_expectations, new_expectations, 1)
write(tests_path, tests)

print("Applied final documentation quality improvements")
