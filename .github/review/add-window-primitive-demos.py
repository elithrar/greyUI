from pathlib import Path

path = Path('docs/src/next-components.tsx')
source = path.read_text()

source = source.replace(
    '  Loader,\n  Meter,\n',
    '  Loader,\n  Menu,\n  MenuBar,\n  Meter,\n',
    1,
)

needle = '''  return (\n    <div className="docs-grid-2 docs-component-grid">\n      <Demo title="Compact date picker">'''
replacement = '''  return (\n    <div className="docs-grid-2 docs-component-grid">\n      <Demo title="Menu bar">\n        <MenuBar>\n          <Menu.Root>\n            <Menu.Trigger>File</Menu.Trigger>\n            <Menu.Popup>\n              <Menu.Item>Open…</Menu.Item>\n              <Menu.Item>Save</Menu.Item>\n              <Menu.Separator />\n              <Menu.Item>Close</Menu.Item>\n            </Menu.Popup>\n          </Menu.Root>\n          <Menu.Root>\n            <Menu.Trigger>Edit</Menu.Trigger>\n            <Menu.Popup>\n              <Menu.Item>Undo</Menu.Item>\n              <Menu.Item>Redo</Menu.Item>\n            </Menu.Popup>\n          </Menu.Root>\n        </MenuBar>\n      </Demo>\n\n      <Demo title="Status bar">\n        <StatusBar>\n          <StatusLight state="ready" label="Connected" />\n          <StatusBarItem grow>Ready</StatusBarItem>\n          <StatusBarSeparator />\n          <StatusBarItem>3 items</StatusBarItem>\n        </StatusBar>\n      </Demo>\n\n      <Demo title="Compact date picker">'''
if needle not in source:
    raise RuntimeError('IntegrationDemos insertion point not found')
source = source.replace(needle, replacement, 1)
path.write_text(source)
