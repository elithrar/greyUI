from pathlib import Path
from textwrap import dedent, indent


def read(path: str) -> str:
    return Path(path).read_text()


def write(path: str, source: str) -> None:
    Path(path).write_text(source)


main_path = "docs/src/main.tsx"
main = read(main_path)
start_marker = '                <GroupBox title="GroupBox component" className="docs-import-guide">'
end_marker = '                </GroupBox>\n'
start = main.index(start_marker)
end = main.index(end_marker, start) + len(end_marker)
block = main[start:end]
main = main[:start] + main[end:]
moved_block = indent(dedent(block).rstrip(), "              ")
target = "              <KumoPatternDemos />"
if main.count(target) != 1:
    raise RuntimeError(f"Expected one Application patterns demo target, found {main.count(target)}")
main = main.replace(target, f"{moved_block}\n{target}", 1)
write(main_path, main)

css_path = "docs/src/docs.css"
css = read(css_path)
old_css = """.docs-import-guide {
  grid-column: 1 / -1;
}"""
new_css = """.docs-import-guide {
  grid-column: 1 / -1;
  margin-bottom: 14px;
}"""
if css.count(old_css) != 1:
    raise RuntimeError(f"Expected one docs-import-guide rule, found {css.count(old_css)}")
write(css_path, css.replace(old_css, new_css, 1))

test_path = "tests/docs.test.tsx"
tests = read(test_path)
tests = tests.replace(
    'it("keeps imports in one explicit GroupBox guide", () => {',
    'it("keeps imports in one explicit GroupBox guide under Application patterns", () => {',
    1,
)
old_assertion = """    expect(componentDocs).not.toContain("ComponentImport");
    expect(main).toContain('title="GroupBox component"');
    expect(main).toContain('import { Button, GroupBox, Select, Window } from "greyui";');"""
new_assertion = """    const principlesSection = main.slice(
      main.indexOf('id="principles"'),
      main.indexOf('id="buttons"'),
    );
    const patternsSection = main.slice(
      main.indexOf('id="patterns"'),
      main.indexOf('id="integration"'),
    );

    expect(componentDocs).not.toContain("ComponentImport");
    expect(principlesSection).not.toContain('title="GroupBox component"');
    expect(patternsSection).toContain('title="GroupBox component"');
    expect(main).toContain('import { Button, GroupBox, Select, Window } from "greyui";');"""
if tests.count(old_assertion) != 1:
    raise RuntimeError(f"Expected one docs assertion block, found {tests.count(old_assertion)}")
write(test_path, tests.replace(old_assertion, new_assertion, 1))

print("Moved GroupBox documentation to Application patterns")
