from pathlib import Path

path = Path("tests/docs.test.tsx")
source = path.read_text()
start = source.index("    expect(main).toContain('title=\"Complete dense application window\"');")
end_marker = "    expect(denseWindow).not.toContain(\"<Field.ActionRow>\");"
end = source.index(end_marker, start) + len(end_marker)
replacement = '''    expect(main).toContain('title="Complete dense application window"');
    expect(denseWindow).toContain("<Window.MenuBar");
    expect(denseWindow).toContain("<Window.Content>");
    expect(denseWindow).toContain("<Window.Header>");
    expect(denseWindow).toContain("<Window.Actions>");
    expect(denseWindow).toContain("<Window.StatusBar>");
    expect(denseWindow).toContain(
      '<Fieldset.Root variant="plain" aria-label="Transmission gears">',
    );
    expect(denseWindow).not.toContain("<Field.ActionRow>");'''
path.write_text(source[:start] + replacement + source[end:])
