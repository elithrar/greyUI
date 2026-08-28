from pathlib import Path


main_path = Path("docs/src/main.tsx")
main = main_path.read_text()
main = main.replace('import { ComponentImport } from "./component-imports";\n', "", 1)
main = main.replace(
    'const WORKBENCH_URL = "https://workbench.questionable.services/";\n',
    'const WORKBENCH_URL = "https://workbench.questionable.services/";\n'
    'const CLONE_COMMAND = "git clone https://github.com/elithrar/greyUI.git";\n'
    'const COMPONENT_IMPORT_EXAMPLE =\n'
    '  \'import { Button, GroupBox, Select, Window } from "greyui";\';\n',
    1,
)
main_path.write_text(main)

for path in [
    Path("docs/src/high-value-components.tsx"),
    Path("docs/src/next-components.tsx"),
]:
    source = path.read_text()
    source = source.replace('import { ComponentImport } from "./component-imports";\n', "", 1)
    path.write_text(source)

print("Prepared docs sources for the main patch")
