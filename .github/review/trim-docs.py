from pathlib import Path


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


main_path = "docs/src/main.tsx"
main = read(main_path)

replace_once(
    main_path,
    '''function Demo({ title, children, code }: { title: string; children: ReactNode; code?: string }) {
  return (
    <div className="docs-demo">
      <div className="docs-demo-title">{title}</div>
      <div className="docs-demo-canvas">{children}</div>
      {code ? <CodeDetails code={code} /> : null}
    </div>
  );
}''',
    '''function Demo({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="docs-demo">
      <div className="docs-demo-title">{title}</div>
      <div className="docs-demo-canvas">{children}</div>
    </div>
  );
}''',
)

replace_once(
    main_path,
    '''              <Guidance title="API conventions">
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
                    Consumers still provide accessible names and visible labels where appropriate;
                    compound controls follow Base UI's controlled and uncontrolled conventions.
                  </li>
                  <li>
                    These docs cover greyUI-specific defaults and composition. Use the
                    <a href={BASE_UI_COMPONENTS_URL}> Base UI component reference</a> for exhaustive
                    primitive props.
                  </li>
                </ul>
                <CopyCommand value={COMPONENT_IMPORT_EXAMPLE} label="component import example" />
              </Guidance>''',
    '''              <Guidance title="API conventions">
                <p>
                  Import <code>greyui/styles.css</code> once. Simple controls accept native props;
                  compound controls use <code>Root</code> plus named parts and Base UI behavior.
                  Consumers still provide labels and accessible names. See the
                  <a href={BASE_UI_COMPONENTS_URL}> Base UI reference</a> for exhaustive primitive
                  props.
                </p>
                <CopyCommand value={COMPONENT_IMPORT_EXAMPLE} label="component import example" />
              </Guidance>''',
)

replace_once(
    main_path,
    '''              intro="Compact beveled buttons. The defaultAction prop adds the default-action outline."
            >
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
                title="Variants"
                code={
                  '<Button>Cancel</Button>\\n<Button defaultAction variant="primary">Apply</Button>\\n<Button variant="destructive">Delete</Button>'
                }
              >''',
    '''              intro='Compact beveled buttons. Button defaults to type="button"; defaultAction only adds the default-action outline.'
            >
              <Demo title="Variants">''',
)

replace_once(
    main_path,
    '''              <Guidance title="Choose the field">
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
              </Guidance>''',
    '''              <Guidance title="Choose the field">
                <p>
                  <code>Select</code> is fixed-list; <code>Combobox</code> searches and selects listed
                  values; <code>Autocomplete</code> keeps free-form text valid.
                </p>
              </Guidance>''',
)

replace_once(
    main_path,
    '''                <Demo
                  title="Select"
                  code={
                    '<Select\\n  label="Theme"\\n  options={[\\n    { value: "beos", label: "BeOS R5" },\\n    { value: "haiku", label: "Haiku" },\\n  ]}\\n/>'
                  }
                >''',
    '''                <Demo title="Select">''',
)

replace_once(
    main_path,
    '''              <Guidance title="Composition choices">
                <ul>
                  <li>
                    <code>ToggleGroup</code> owns selected values. <code>SegmentedControl</code> is
                    a visual group for caller-controlled <code>ToggleButton</code> state.
                  </li>
                  <li>
                    <code>CheckboxGroup</code> owns checkbox values. <code>Fieldset</code> adds
                    native fieldset/legend semantics and propagates disabled state.
                  </li>
                  <li>
                    Use <code>Accordion</code> for related disclosure sections and
                    <code> Collapsible</code> for a single disclosure.
                  </li>
                </ul>
              </Guidance>''',
    '''              <Guidance title="Composition choices">
                <ul>
                  <li>
                    <code>ToggleGroup</code> owns values; <code>SegmentedControl</code> only groups
                    caller-controlled <code>ToggleButton</code>s.
                  </li>
                  <li>
                    <code>Fieldset</code> adds form semantics and shared disabled state.
                    <code> Accordion</code> groups disclosures; <code>Collapsible</code> handles one.
                  </li>
                </ul>
              </Guidance>''',
)

replace_once(
    main_path,
    '''              <Guidance
                title="Choose feedback"
                code={"<Toast.Provider>\\n  <App />\\n  <Toast.Toaster />\\n</Toast.Provider>"}
                codeLabel="Toast setup"
              >
                <ul>
                  <li>
                    <code>Progress</code> describes task completion or indeterminate work;
                    <code> Meter</code> describes a bounded measurement.
                  </li>
                  <li>
                    <code>Banner</code> is persistent inline feedback; <code>Toast</code> is
                    transient notification UI.
                  </li>
                  <li>
                    Toasts require a <code>Toast.Provider</code> and one <code>Toast.Toaster</code>{" "}
                    in the owning scope.
                  </li>
                </ul>
              </Guidance>''',
    '''              <Guidance
                title="Choose feedback"
                code={"<Toast.Provider>\\n  <App />\\n  <Toast.Toaster />\\n</Toast.Provider>"}
                codeLabel="Toast setup"
              >
                <p>
                  <code>Progress</code> tracks work; <code>Meter</code> measures a value.
                  <code> Banner</code> is inline; <code>Toast</code> is transient and requires a
                  provider/toaster pair.
                </p>
              </Guidance>''',
)

replace_once(
    main_path,
    '''              <GroupBox title="GroupBox component" className="docs-groupbox-guide">
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
              </GroupBox>''',
    '''              <GroupBox title="GroupBox component" className="docs-groupbox-guide">
                <p>
                  Visual grouping for related controls or content; use <code>Fieldset</code> instead
                  when form semantics or shared disabled state matter.
                </p>
              </GroupBox>''',
)

replace_once(
    main_path,
    '''              <Guidance
                title="Overlay contract"
                code={"<Layer.Provider>\\n  <App />\\n</Layer.Provider>"}
                codeLabel="Application setup"
              >
                <ul>
                  <li>
                    Mount one <code>Layer.Provider</code> near the application root when using
                    menus, popovers, dialogs, toasts, or tooltips; greyUI routes them into stable
                    top-level hosts.
                  </li>
                  <li>
                    Use <code>Dialog</code> for modal tasks and <code>AlertDialog</code> for
                    decisions that require explicit confirmation.
                  </li>
                  <li>
                    Context menus are enhancements: keep important actions reachable without
                    right-click.
                  </li>
                </ul>
              </Guidance>''',
    '''              <Guidance
                title="Overlay contract"
                code={"<Layer.Provider>\\n  <App />\\n</Layer.Provider>"}
                codeLabel="Application setup"
              >
                <p>
                  Mount one <code>Layer.Provider</code> near the app root. Use
                  <code> AlertDialog</code> for confirmation decisions; context menus should not be
                  the only path to important actions.
                </p>
              </Guidance>''',
)

replace_once(
    main_path,
    '''              <Demo
                title="Active and inactive windows"
                code={
                  '<Window title="Preferences" collapsible responsive="stacked">\\n  …\\n</Window>'
                }
              >''',
    '''              <Demo title="Active and inactive windows">''',
)

replace_once(
    main_path,
    '''                <p>
                  Override tokens at a theme boundary rather than targeting component internals.
                  Keep document/editing surfaces distinct from neutral panel surfaces.
                </p>''',
    '''                <p>Override tokens at a theme boundary; avoid styling component internals.</p>''',
)

# Trim README to the same level of detail.
readme_path = "README.md"
readme = read(readme_path)
readme = readme.replace(
    '''## API conventions

- Simple controls accept the corresponding native element props. Compound controls use `Root` plus named parts and preserve Base UI keyboard, focus, positioning, and ARIA behavior.
- The greyUI docs describe greyUI-specific defaults, composition, and visual behavior. Use the [Base UI component reference](https://base-ui.com/react/components) for exhaustive primitive props.
- Consumers still provide accessible names and visible labels where appropriate; compound controls follow Base UI's controlled and uncontrolled conventions.
- `Button` defaults to `type="button"`; opt into submit behavior explicitly.
- Wrap applications that use menus, popovers, dialogs, toasts, or tooltips in `Layer.Provider` so overlays share stable top-level hosts.

## Choosing components

- `Select` is for a fixed list; `Combobox` is for searchable selection; `Autocomplete` keeps free-form text valid while offering suggestions.
- `GroupBox` is visual grouping. Use `Fieldset` when related form controls need fieldset/legend semantics or shared disabled state.
- `Progress` reports task completion or indeterminate work. `Meter` reports a bounded measurement.
- `Accordion` groups related disclosures; `Collapsible` handles a single disclosure.
''',
    '''## API conventions

- Simple controls accept native props; compound controls use `Root` plus named parts and Base UI behavior. Use the [Base UI reference](https://base-ui.com/react/components) for exhaustive primitive props.
- Consumers provide labels and accessible names. Wrap overlay-heavy apps in `Layer.Provider`.

## Common distinctions

- `Select` is fixed-list; `Combobox` searches listed values; `Autocomplete` keeps free-form text valid.
- `GroupBox` is visual grouping; `Fieldset` adds form semantics. `Progress` tracks work; `Meter` measures a value.
''',
    1,
)
readme = readme.replace(
    '''`Window` supports controlled or uncontrolled collapse state and two responsive modes. Existing
windows default to `responsive="stacked"`; map and dashboard overlays can opt into
`responsive="floating"`. `Popover.Popup` accepts `positionerProps`, including Base UI virtual
anchors created with `createVirtualAnchor()`. Its backward-compatible shorthand now shares the
same implementation as `Window.Root`, `Window.TitleBar`, `Window.Title`, `Window.Controls`,
`Window.Collapse`, `Window.Body`, and `Window.StatusBar`.

Wrap an application in `Layer.Provider` to route menus, popovers, app-owned overlays, dialogs,
toasts, and tooltips into stable top-level hosts. `Layer.Portal` gives map POIs and other custom
content the same stacking contract; tooltips intentionally remain the highest default layer.
''',
    '''`Window` supports controlled/uncontrolled collapse and `responsive="stacked"` or `"floating"`. `Popover.Popup.positionerProps` accepts Base UI positioning options such as virtual anchors.

`Layer.Provider` routes overlays into stable top-level hosts; `Layer.Portal` exposes the same contract for custom content.
''',
    1,
)
readme = readme.replace(
    '`npm run check` runs Oxfmt, Oxlint with the vendored anti-slop rules, TypeScript, and Vitest. `npm run perf:package` checks package entrypoints and reports component and consumer-bundle costs. CI also validates the package tarball and docs deployment configuration.',
    '`npm run check` runs Oxfmt, Oxlint + anti-slop, TypeScript, and Vitest. `npm run perf:package` checks package entrypoints and bundle costs; CI also validates the tarball and docs deployment.',
    1,
)
write(readme_path, readme)

print("Trimmed technical docs to non-obvious contracts only")
