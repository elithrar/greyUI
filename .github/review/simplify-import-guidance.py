from pathlib import Path
import re


def read(path: str) -> str:
    return Path(path).read_text()


def write(path: str, source: str) -> None:
    Path(path).write_text(source)


def replace_once(path: str, old: str, new: str) -> None:
    source = read(path)
    count = source.count(old)
    if count != 1:
        raise RuntimeError(f"Expected one match in {path}, found {count}: {old[:100]!r}")
    write(path, source.replace(old, new, 1))


# Remove per-demo import chrome. Import guidance belongs in one explicit,
# compact GroupBox under Principles instead of masquerading as component UI.
main_path = "docs/src/main.tsx"
main = read(main_path)
main = main.replace('import { ComponentImport } from "./component-imports";\n', "", 1)
main = main.replace(
    'const WORKBENCH_URL = "https://workbench.questionable.services/";\n',
    'const WORKBENCH_URL = "https://workbench.questionable.services/";\n'
    'const CLONE_COMMAND = "git clone https://github.com/elithrar/greyUI.git";\n'
    'const COMPONENT_IMPORT_EXAMPLE =\n'
    '  \'import { Button, GroupBox, Select, Window } from "greyui";\';\n',
    1,
)
replace_once(
    main_path,
    '''function Demo({
  title,
  children,
  code,
  imports,
}: {
  title: string;
  children: ReactNode;
  code?: string;
  imports?: readonly string[];
}) {
  return (
    <div className="docs-demo">
      <div className="docs-demo-title">{title}</div>
      {imports ? <ComponentImport imports={imports} label={title} /> : null}
      <div className="docs-demo-canvas">{children}</div>
      {code ? (
        <pre className="docs-code">
          <code>{code}</code>
        </pre>
      ) : null}
    </div>
  );
}''',
    '''function Demo({ title, children, code }: { title: string; children: ReactNode; code?: string }) {
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
}''',
)
main = read(main_path)
main, import_props = re.subn(r'\s+imports=\{\[[\s\S]*?\]\}', '', main)
if import_props < 8:
    raise RuntimeError(f"Expected to remove at least 8 import props from main.tsx, removed {import_props}")
main, component_imports = re.subn(r'\n\s*<ComponentImport[\s\S]*?\/>', '', main)
if component_imports != 2:
    raise RuntimeError(f"Expected two standalone ComponentImport nodes, removed {component_imports}")
write(main_path, main)

replace_once(
    main_path,
    '''              <div className="docs-hero">
                <div>
                  <div className="docs-eyebrow">BeOS / Haiku UI for React</div>
                  <h1>greyUI</h1>
                  <p>
                    React components styled after BeOS R5 and Haiku. Compound controls use Base UI
                    for keyboard, focus, and ARIA behavior.
                  </p>
                  <div className="docs-install">
                    <span className="docs-install-label">Install with npm</span>
                    <CopyCommand value="npm install greyui" label="npm install command" />
                  </div>
                  <p className="docs-stylesheet-note">
                    Import <code>greyui/styles.css</code> once in your application.
                  </p>
                </div>
                <GroupBox title="Clone source">
                  <code>git clone https://github.com/elithrar/greyUI.git</code>
                </GroupBox>
              </div>''',
    '''              <div className="docs-hero">
                <div>
                  <div className="docs-eyebrow">BeOS / Haiku UI for React</div>
                  <h1>greyUI</h1>
                  <p>
                    React components styled after BeOS R5 and Haiku. Compound controls use Base UI
                    for keyboard, focus, and ARIA behavior.
                  </p>
                  <div className="docs-install">
                    <span className="docs-install-label">Install with npm</span>
                    <CopyCommand value="npm install greyui" label="npm install command" />
                    <span className="docs-install-label">Clone source</span>
                    <CopyCommand value={CLONE_COMMAND} label="git clone command" />
                  </div>
                  <p className="docs-stylesheet-note">
                    Import <code>greyui/styles.css</code> once in your application.
                  </p>
                </div>
              </div>''',
)

replace_once(
    main_path,
    '''                <GroupBox title="Component model">
                  <ul>
                    <li>Native HTML for simple controls.</li>
                    <li>Base UI for compound-control behavior and positioning.</li>
                    <li>Component state is exposed through data attributes.</li>
                    <li>
                      <a href={WORKBENCH_URL}>WorkbenchOS</a>-specific application components are
                      not included.
                    </li>
                  </ul>
                </GroupBox>
              </div>''',
    '''                <GroupBox title="Component model">
                  <ul>
                    <li>Native HTML for simple controls.</li>
                    <li>Base UI for compound-control behavior and positioning.</li>
                    <li>Component state is exposed through data attributes.</li>
                    <li>
                      <a href={WORKBENCH_URL}>WorkbenchOS</a>-specific application components are
                      not included.
                    </li>
                  </ul>
                </GroupBox>
                <GroupBox title="GroupBox component" className="docs-import-guide">
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
                </GroupBox>
              </div>''',
)

# High-value demos no longer carry import banners.
high_path = "docs/src/high-value-components.tsx"
high = read(high_path)
high = high.replace('import { ComponentImport } from "./component-imports";\n', "", 1)
replace_once(
    high_path,
    '''function ComponentDemo({
  name,
  imports,
  children,
}: {
  name: string;
  imports: readonly string[];
  children: React.ReactNode;
}) {
  return (
    <article className="docs-high-value-demo">
      <div className="docs-high-value-demo-header">
        <h3>{name}</h3>
      </div>
      <ComponentImport imports={imports} label={name} />
      <div className="docs-high-value-demo-canvas">{children}</div>
    </article>
  );
}''',
    '''function ComponentDemo({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <article className="docs-high-value-demo">
      <div className="docs-high-value-demo-header">
        <h3>{name}</h3>
      </div>
      <div className="docs-high-value-demo-canvas">{children}</div>
    </article>
  );
}''',
)
high = read(high_path)
high, count = re.subn(r'\s+imports=\{\[[\s\S]*?\]\}', '', high)
if count != 5:
    raise RuntimeError(f"Expected five high-value import props, removed {count}")
write(high_path, high)

# Remaining component demos likewise render only the component itself.
next_path = "docs/src/next-components.tsx"
next_source = read(next_path)
next_source = next_source.replace('import { ComponentImport } from "./component-imports";\n', "", 1)
replace_once(
    next_path,
    '''function Demo({
  title,
  children,
  imports,
}: {
  title: string;
  children: React.ReactNode;
  imports: readonly string[];
}) {
  return (
    <div className="docs-demo">
      <div className="docs-demo-title">{title}</div>
      <ComponentImport imports={imports} label={title} />
      <div className="docs-demo-canvas">{children}</div>
    </div>
  );
}''',
    '''function Demo({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="docs-demo">
      <div className="docs-demo-title">{title}</div>
      <div className="docs-demo-canvas">{children}</div>
    </div>
  );
}''',
)
next_source = read(next_path)
next_source, count = re.subn(r'\s+imports=\{\[[\s\S]*?\]\}', '', next_source)
if count < 20:
    raise RuntimeError(f"Expected at least 20 helper import props, removed {count}")
write(next_path, next_source)

# Remove the now-unused import catalog and its dedicated tests. Package endpoint
# coverage remains in scripts/package-audit.mjs.
Path("docs/src/component-imports.tsx").unlink()
Path("tests/component-imports.test.tsx").unlink()

# Docs layout: stack install/clone commands, keep the GroupBox guidance slim,
# and remove all styling for the discarded per-demo import banners.
css_path = "docs/src/docs.css"
css = read(css_path)
css = css.replace(
    '''.docs-hero {
  display: grid;
  grid-template-columns: 1.7fr 1fr;
  gap: 26px;
  align-items: center;
  padding: 30px 26px 28px;
}''',
    '''.docs-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  padding: 30px 26px 28px;
}
.docs-hero > div {
  width: min(100%, 680px);
}''',
    1,
)
css = css.replace('  width: min(100%, 260px);', '  width: min(100%, 440px);', 1)
css = css.replace(
    '''.docs-install-label {
  font-size: 11px;
  font-weight: 700;
}''',
    '''.docs-install-label {
  font-size: 11px;
  font-weight: 700;
}
.docs-install-label:not(:first-child) {
  margin-top: 3px;
}''',
    1,
)
css = re.sub(
    r'\n\.docs-hero \.greyui-groupbox code \{[\s\S]*?\n\}',
    '',
    css,
    count=1,
)
start = css.index("/* Contextual component imports */")
end = css.index(".docs-high-value-grid", start)
css = css[:start] + css[end:]
css = css.replace(
    '''.docs-principles ul {
  margin: 2px 0 0;
  padding-left: 18px;
  line-height: 1.55;
}''',
    '''.docs-principles ul {
  margin: 2px 0 0;
  padding-left: 18px;
  line-height: 1.55;
}
.docs-import-guide {
  grid-column: 1 / -1;
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
}''',
    1,
)
css = css.replace(
    '''  .docs-demo-canvas {
    padding: 12px;
  }''',
    '''  .docs-demo-canvas {
    padding: 12px;
  }
  .docs-import-guide .greyui-groupbox-body {
    grid-template-columns: minmax(0, 1fr);
  }''',
    1,
)
write(css_path, css)

# Paint body-row fills on cells rather than rows. This avoids Safari seams at
# collapsed row borders while preserving WorkbenchOS' panel-light/panel rhythm.
replace_once(
    "src/styles.css",
    '''.greyui-table {
  width: 100%;
  border-collapse: collapse;
  color: var(--greyui-text);
  font-size: 0.8rem;
}''',
    '''.greyui-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--greyui-panel-light);
  color: var(--greyui-text);
  font-size: 0.8rem;
}''',
)
replace_once(
    "src/styles.css",
    '''.greyui-table tbody tr:nth-child(even) {
  background: var(--greyui-panel);
}''',
    '''.greyui-table tbody td {
  background: var(--greyui-panel-light);
}

.greyui-table tbody tr:nth-child(even) td {
  background: var(--greyui-panel);
}''',
)
replace_once(
    "src/styles.css",
    '''.greyui-table tbody tr[aria-selected="true"] {
  background: var(--greyui-selection);
  color: var(--greyui-selection-text);
}''',
    '''.greyui-table tbody tr[aria-selected="true"] td {
  background: var(--greyui-selection);
  color: var(--greyui-selection-text);
}''',
)

# Source-level regression checks for the deliberately small import guide and
# cell-painted table rows.
docs_tests = read("tests/docs.test.tsx")
docs_tests = docs_tests.replace(
    '''describe("documentation version", () => {
  it("uses the package version injected by the build", () => {
    expect(GREYUI_VERSION).toBe(packageVersion);
  });
});''',
    '''describe("documentation structure", () => {
  it("keeps imports in one explicit GroupBox guide", () => {
    const main = readFileSync(resolve(process.cwd(), "docs/src/main.tsx"), "utf8");
    const highValue = readFileSync(
      resolve(process.cwd(), "docs/src/high-value-components.tsx"),
      "utf8",
    );
    const nextComponents = readFileSync(
      resolve(process.cwd(), "docs/src/next-components.tsx"),
      "utf8",
    );
    const componentDocs = `${main}\n${highValue}\n${nextComponents}`;

    expect(componentDocs).not.toContain("ComponentImport");
    expect(main).toContain('title="GroupBox component"');
    expect(main).toContain('import { Button, GroupBox, Select, Window } from "greyui";');
    expect(main).toContain('label="git clone command"');
  });
});

describe("documentation version", () => {
  it("uses the package version injected by the build", () => {
    expect(GREYUI_VERSION).toBe(packageVersion);
  });
});''',
    1,
)
write("tests/docs.test.tsx", docs_tests)

style_tests = read("tests/styles.test.ts")
style_tests = style_tests.replace(
    '''  it("uses standard panel surfaces for grouped controls", () => {
    const css = readFileSync(resolve(process.cwd(), "src/components-v2.css"), "utf8");

    expect(css).toMatch(/\\.greyui-fieldset\\s*\\{[\\s\\S]*?background:\\s*var\\(--greyui-panel\\)/);
    expect(css).toMatch(/\\.greyui-accordion-panel\\s*\\{[\\s\\S]*?background:\\s*var\\(--greyui-panel\\)/);
  });''',
    '''  it("uses standard panel surfaces for grouped controls", () => {
    const css = readFileSync(resolve(process.cwd(), "src/components-v2.css"), "utf8");

    expect(css).toMatch(/\\.greyui-fieldset\\s*\\{[\\s\\S]*?background:\\s*var\\(--greyui-panel\\)/);
    expect(css).toMatch(/\\.greyui-accordion-panel\\s*\\{[\\s\\S]*?background:\\s*var\\(--greyui-panel\\)/);
  });

  it("paints table row fills through every cell edge", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");

    expect(css).toMatch(/\\.greyui-table\\s*\\{[\\s\\S]*?background:\\s*var\\(--greyui-panel-light\\)/);
    expect(css).toMatch(/\\.greyui-table tbody td\\s*\\{[\\s\\S]*?background:\\s*var\\(--greyui-panel-light\\)/);
    expect(css).toMatch(
      /\\.greyui-table tbody tr:nth-child\\(even\\) td\\s*\\{[\\s\\S]*?background:\\s*var\\(--greyui-panel\\)/,
    );
    expect(css).toMatch(
      /\\.greyui-table tbody tr\\[aria-selected="true"\\] td\\s*\\{[\\s\\S]*?background:\\s*var\\(--greyui-selection\\)/,
    );
  });''',
    1,
)
write("tests/styles.test.ts", style_tests)

print("Applied simplified import guidance, clone command, GroupBox docs, and table edge fills")
