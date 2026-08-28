from pathlib import Path

path = Path("docs/src/next-components.tsx")
source = path.read_text()

source = source.replace(
    "import {\n  Banner,\n",
    "import {\n  Badge,\n  Banner,\n",
    1,
)

needle = '''export function FeedbackDemos() {
  return (
    <div className="docs-grid-2 docs-component-grid">
      <Demo title="Progress">'''
replacement = '''export function FeedbackDemos() {
  return (
    <div className="docs-grid-2 docs-component-grid">
      <Demo title="Badges">
        <div className="docs-row">
          <Badge>Default</Badge>
          <Badge tone="accent">Accent</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Danger</Badge>
          <Badge tone="edit">Edit</Badge>
          <Badge tone="experimental">Experimental</Badge>
        </div>
      </Demo>

      <Demo title="Progress">'''

if needle not in source:
    raise RuntimeError("Could not find FeedbackDemos insertion point")

path.write_text(source.replace(needle, replacement, 1))
