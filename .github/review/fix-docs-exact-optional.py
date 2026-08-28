from pathlib import Path

path = Path("docs/src/main.tsx")
source = path.read_text()
old = '{code ? <CodeDetails code={code} label={codeLabel} /> : null}'
new = '''{code ? (
        codeLabel ? (
          <CodeDetails code={code} label={codeLabel} />
        ) : (
          <CodeDetails code={code} />
        )
      ) : null}'''
if source.count(old) != 1:
    raise RuntimeError(f"Expected one Guidance CodeDetails call, found {source.count(old)}")
path.write_text(source.replace(old, new, 1))
