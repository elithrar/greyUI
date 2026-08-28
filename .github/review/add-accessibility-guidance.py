from pathlib import Path

path = Path("docs/src/main.tsx")
source = path.read_text()
old = '''                  <li>
                    These docs cover greyUI-specific defaults and composition. Use the
                    <a href={BASE_UI_COMPONENTS_URL}> Base UI component reference</a> for exhaustive
                    primitive props.
                  </li>'''
new = '''                  <li>
                    Consumers still provide accessible names and visible labels where appropriate;
                    compound controls follow Base UI's controlled and uncontrolled conventions.
                  </li>
                  <li>
                    These docs cover greyUI-specific defaults and composition. Use the
                    <a href={BASE_UI_COMPONENTS_URL}> Base UI component reference</a> for exhaustive
                    primitive props.
                  </li>'''
if source.count(old) != 1:
    raise RuntimeError(f"Expected one API convention block, found {source.count(old)}")
path.write_text(source.replace(old, new, 1))
