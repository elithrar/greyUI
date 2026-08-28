from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    file = Path(path)
    source = file.read_text()
    count = source.count(old)
    if count != 1:
        raise RuntimeError(f"Expected one match in {path}, found {count}: {old[:80]!r}")
    file.write_text(source.replace(old, new, 1))


replace_once(
    "src/styles.css",
    '''.greyui-select-list {
  min-width: max-content;
  padding: 0;
}''',
    '''.greyui-select-list {
  padding: 0;
}''',
)

replace_once(
    "src/styles.css",
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
    '''.greyui-select-item {
  display: grid;
  width: max-content;
  min-width: 100%;
  min-height: 24px;
  box-sizing: border-box;
  grid-template-columns: 1rem max-content;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.5rem;
  color: var(--greyui-text);
  outline: none;
  cursor: pointer;
  white-space: nowrap;
}

.greyui-select-item-text {
  white-space: nowrap;
}''',
)

replace_once(
    "tests/styles.test.ts",
    '''    expect(css).toMatch(/\\.greyui-select-list\\s*\\{[\\s\\S]*?min-width:\\s*max-content/);
    expect(css).toMatch(/\\.greyui-select-item-text\\s*\\{[\\s\\S]*?white-space:\\s*nowrap/);''',
    '''    expect(css).toMatch(/\\.greyui-select-item\\s*\\{[\\s\\S]*?width:\\s*max-content/);
    expect(css).toMatch(/\\.greyui-select-item\\s*\\{[\\s\\S]*?grid-template-columns:\\s*1rem max-content/);
    expect(css).toMatch(/\\.greyui-select-item-text\\s*\\{[\\s\\S]*?white-space:\\s*nowrap/);''',
)
