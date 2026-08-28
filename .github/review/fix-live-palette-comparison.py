from pathlib import Path

path = Path(".github/review/visual-import-guidance-table.mjs")
source = path.read_text()

source = source.replace("let localTokens;", "let localPalette;")
source = source.replace(
    "  localTokens ??= tokens;",
    '''  localPalette ??= Object.fromEntries(
    ["panel", "panel-light", "panel-dark", "control-border", "border-dark", "document"].map(
      (name) => [name, colors[name]],
    ),
  );''',
)
source = source.replace(
    '''  const tokens = await tokenReport(page, "beos");
  for (const [name, value] of Object.entries(localTokens)) {
    assert.ok(tokens[name], `Live WorkbenchOS token --beos-${name} is missing`);
    assert.equal(value, tokens[name], `Palette mismatch for ${name}`);
  }
''',
    '''  const tokens = await tokenReport(page, "beos");
  const colors = await resolvedTokenColors(page, "beos");
  for (const [name, value] of Object.entries(localPalette)) {
    assert.ok(colors[name], `Live WorkbenchOS token --beos-${name} is missing`);
    assert.equal(value, colors[name], `Resolved palette mismatch for ${name}`);
  }
''',
)
source = source.replace(
    "  report.live.push({ width, tokens, tableRules, groupBoxCount });",
    "  report.live.push({ width, tokens, colors, tableRules, groupBoxCount });",
)

if "localTokens" in source:
    raise RuntimeError("Stale raw-token comparison remains")
if "Resolved palette mismatch" not in source:
    raise RuntimeError("Resolved palette comparison was not installed")

path.write_text(source)
print("Updated WorkbenchOS comparison to resolved neutral colors")
