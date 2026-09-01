from pathlib import Path

path = Path("docs/src/main.tsx")
source = path.read_text()

marker = '''function Demo({ title, children }: { title: string; children: ReactNode }) {'''
helper = '''function GitHubMark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.65 7.65 0 0 1 8 3.95c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

'''
if marker not in source:
    raise RuntimeError("Demo marker not found")
source = source.replace(marker, helper + marker, 1)

old_star = '''                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="m8 1.25 2.08 4.22 4.66.68-3.37 3.28.8 4.64L8 11.88l-4.17 2.19.8-4.64L1.26 6.15l4.66-.68L8 1.25Z" />
                  </svg>'''
if source.count(old_star) != 1:
    raise RuntimeError("Expected one star placeholder")
source = source.replace(old_star, "                  <GitHubMark />", 1)

old_heading = '''                  <h1>greyUI</h1>
                  <p>'''
new_heading = '''                  <h1>greyUI</h1>
                  <a className="docs-hero-github-link" href={GITHUB_URL}>
                    <GitHubMark />
                    <span>GitHub</span>
                  </a>
                  <p>'''
if source.count(old_heading) != 1:
    raise RuntimeError("Expected one hero heading")
source = source.replace(old_heading, new_heading, 1)
path.write_text(source)

css_path = Path("docs/src/docs.css")
css = css_path.read_text()
needle = '''.docs-hero h1 {
  margin: 1px 0 7px;
  font-size: 38px;
  line-height: 1;
  letter-spacing: -1px;
}
'''
addition = needle + '''.docs-hero-github-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin: -1px 0 8px;
  color: var(--greyui-text-muted);
  font-size: 11px;
  text-decoration: none;
}
.docs-hero-github-link svg {
  width: 13px;
  height: 13px;
  fill: currentColor;
}
.docs-hero-github-link:hover,
.docs-hero-github-link:focus-visible {
  color: var(--greyui-text);
  text-decoration: underline;
  text-underline-offset: 2px;
}
'''
if css.count(needle) != 1:
    raise RuntimeError("Expected one hero h1 style block")
css_path.write_text(css.replace(needle, addition, 1))
