from pathlib import Path

path = Path(".github/review/apply-anti-slop-fixes.py")
source = path.read_text()
old = '''function createLayerRecord<Value>(createValue: (name: LayerName) => Value): Record<LayerName, Value> {
  return {
    menu: createValue("menu"),
    popover: createValue("popover"),
    overlay: createValue("overlay"),
    dialog: createValue("dialog"),
    toast: createValue("toast"),
    tooltip: createValue("tooltip"),
  };
}'''
new = '''function createLayerRecord<Value>(createValue: (name: LayerName) => Value) {
  return {
    menu: createValue("menu"),
    popover: createValue("popover"),
    overlay: createValue("overlay"),
    dialog: createValue("dialog"),
    toast: createValue("toast"),
    tooltip: createValue("tooltip"),
  } satisfies Record<LayerName, Value>;
}'''
if source.count(old) != 1:
    raise RuntimeError("Expected one Layer record helper in remediation script")
path.write_text(source.replace(old, new, 1))
