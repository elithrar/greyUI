from pathlib import Path

main_path = Path("docs/src/main.tsx")
main = main_path.read_text()
main = main.replace(
    'const BASE_UI_COMPONENTS_URL = "https://base-ui.com/react/components";\n',
    'const BASE_UI_COMPONENTS_URL = "https://base-ui.com/react/components";\nconst GITHUB_URL = "https://github.com/elithrar/greyUI";\n',
    1,
)
main = main.replace(
    '''            <div className="docs-deskbar-top">\n              <strong>greyUI</strong>\n              <Badge tone="accent">{GREYUI_VERSION}</Badge>\n            </div>''',
    '''            <div className="docs-deskbar-top">\n              <strong>greyUI</strong>\n              <div className="docs-deskbar-actions">\n                <Badge tone="accent">{GREYUI_VERSION}</Badge>\n                <a\n                  className="docs-github-link"\n                  href={GITHUB_URL}\n                  aria-label="greyUI on GitHub"\n                  title="greyUI on GitHub"\n                >\n                  <svg viewBox="0 0 16 16" aria-hidden="true">\n                    <path d="m8 1.25 2.08 4.22 4.66.68-3.37 3.28.8 4.64L8 11.88l-4.17 2.19.8-4.64L1.26 6.15l4.66-.68L8 1.25Z" />\n                  </svg>\n                </a>\n              </div>\n            </div>''',
    1,
)
main_path.write_text(main)

css_path = Path("docs/src/docs.css")
css = css_path.read_text()
needle = '''.docs-deskbar-top {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  min-height: 28px;\n  padding: 4px 6px;\n  border-bottom: 1px solid #444;\n}\n'''
addition = needle + '''.docs-deskbar-actions {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n}\n.docs-deskbar .docs-github-link {\n  display: inline-grid;\n  place-items: center;\n  width: 18px;\n  min-height: 18px;\n  padding: 0;\n  border: 0;\n  color: #fff;\n}\n.docs-deskbar .docs-github-link svg {\n  width: 13px;\n  height: 13px;\n  fill: currentColor;\n}\n.docs-deskbar .docs-github-link:hover,\n.docs-deskbar .docs-github-link:focus-visible {\n  background: transparent;\n  color: var(--greyui-tab-active);\n  outline: 1px solid currentColor;\n}\n'''
css = css.replace(needle, addition, 1)
css_path.write_text(css)
