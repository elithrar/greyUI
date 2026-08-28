from pathlib import Path
import runpy

prepare = Path(__file__).with_name("prepare-simplify-import-guidance.py")
runpy.run_path(str(prepare))
