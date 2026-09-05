# TypeScript and component API review

Reviewed all 43 component modules, the public barrel, declaration build, package exports,
fieldset context, store shims, docs examples, and validation configuration against
`c56271ce216bbd3d7603359869ad1c23ee127030` (0.6.2). The compiler already enables `strict`,
`noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes`; the actionable type defects
were in wrapper contracts and consumer coverage.

## Scope

| Area                     | Modules inspected                                                                                                     |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| Form controls            | checkbox, checkbox-group, date-picker, field, fieldset, input, input-group, number-field, radio-group, select, switch |
| Selection and disclosure | accordion, autocomplete, collapsible, combobox, slider, tabs, toggle-button, toggle-group                             |
| Overlays                 | alert-dialog, context-menu, dialog, layer, menu, popover, toast, tooltip                                              |
| Layout and composition   | breadcrumbs, button, group-box, scroll-area, separator, table, toolbar, window                                        |
| Status and content       | badge, banner, empty, loader, meter, pagination, progress, segmented-meter                                            |

The review examined generic inference, inherited native props, refs, slot forwarding,
controlled and uncontrolled state, disabled-state propagation, accessible names, portal
ownership, emitted declarations, and package consumption. Source inspection covered every
module; focused regressions target the confirmed findings below.

## Validated findings and fixes

| Finding                                                                  | Evidence before the fix                                                                                                                                                  | Change and regression coverage                                                                                                                                                                                                                               |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Select erases value and multiplicity types                               | String-only options still accept numeric values and single/array mismatches; callbacks receive `unknown`. A correctly annotated callback is rejected.                    | Instantiate Base UI with `string` and a multiplicity parameter. Compile positive and negative single/multiple cases, and check multiple-value form submission. Keep the default `SelectProps` prop bag compatible with existing multiple-select annotations. |
| RadioGroup erases its string option contract                             | Numeric selections compile although every rendered option has a string value; callbacks receive `unknown`.                                                               | Instantiate the primitive's string props. Compile callback inference and reject numeric selections.                                                                                                                                                          |
| Slider, Accordion, and ToggleGroup erase generic information             | A scalar Slider callback receives a number/array union; Accordion loses its item type; ToggleGroup widens literal unions to `string`.                                    | Carry the primitive type parameter through each wrapper. Compile number/range, string-array, literal-union, and Slider ref examples.                                                                                                                         |
| Grouped Autocomplete loses item inference and calls a component directly | Grouped object callbacks infer `unknown`. The wrapper invokes the Base UI root as an ordinary function.                                                                  | Restore grouped and flat overloads, retain the broad props overload for forwarding, and render the primitive through JSX. Compile grouped/flat consumers and exercise grouped filtering and selection in the docs.                                           |
| Popup titles accidentally intersect with the native `title` attribute    | React elements are rejected for Dialog, AlertDialog, and Popover titles despite the explicit `ReactNode` declaration.                                                    | Omit native `title` before declaring the content slot. Compile all three and verify dialog accessible names with React element titles.                                                                                                                       |
| Empty silently discards children                                         | `<Empty title="…">Create a file</Empty>` renders no action content.                                                                                                      | Render children in the existing contents slot when `contents` is undefined. Preserve explicit contents precedence. Check DOM output and the docs action button.                                                                                              |
| Switch ignores greyUI's disabled fieldset context                        | A switch inside nested disabled fieldsets fires its callback and lacks disabled state on the control and label. The docs reproduction fails at all four viewport widths. | Resolve inherited disabled state through the same context used by Checkbox. Test nested fieldsets, explicit `disabled={false}`, blocked interaction, and the enabled control.                                                                                |
| Package checks do not compile consumer contracts                         | The original declaration build and package audit pass despite the API type defects above.                                                                                | Compile the same consumer examples against source paths during `typecheck` and real root/subpath package exports during `pack:check`, with `skipLibCheck: false` for published declarations.                                                                 |
| Browser output contaminates subsequent checks                            | `npm run check` attempts to format generated Playwright JSON and trace HTML after browser tests.                                                                         | Ignore `test-results/` and `playwright-report/`, then run the normal checks after browser validation.                                                                                                                                                        |

Type parameter preservation follows the [TypeScript generics guidance](https://www.typescriptlang.org/docs/handbook/2/generics.html).
The Autocomplete rendering change follows React's rule to
[let React call components through JSX](https://react.dev/reference/rules/react-calls-components-and-hooks#never-call-component-functions-directly).
The existing, documented assertion bridging Base UI's overloads remains confined to that
implementation boundary.

## Validation

- Baseline `npm run check`: 51 tests pass. New consumer fixtures fail on the original
  value/callback/title/grouped-item contracts; the Empty and disabled Switch regressions
  fail before implementation changes.
- Final `npm run check`: formatting, lint, TypeScript, and 54 tests pass.
- `npm run build`, `npm run build:docs`, and `npm run pack:check` pass. Package validation
  covers strict consumer declaration checking, entrypoint existence, SSR imports, runtime
  externals, and bundle budgets.
- Browser suite: 11 tests pass, including existing window and overlay regressions and new
  component API flows at 1280, 768, 390, and 320 pixels.
- Reviewed rendered captures of grouped controls, open suggestions, Empty children, and a
  dialog with a React title. Compared original and fixed component code using the updated
  docs examples. The original code reproduces the missing disabled Switch state at all
  four widths; the fixed examples and document remain contained.

The interactive cloud browser could not open localhost and the standard Playwright browser
CDN timed out. Local browser tests used a temporary npm-distributed Chromium executable via
`PLAYWRIGHT_EXECUTABLE_PATH`; no browser dependency or executable is added to the package.
Validation emitted environment warnings about npm's `http-proxy` setting and conflicting
color-output variables. Cross-browser and assistive-technology testing were not performed.

## Compatibility notes

Select and RadioGroup now reject non-string selections that cannot match their string-valued
options. JSX Select usage also rejects mismatched single and multiple value shapes. For a
precisely typed prop bag, use `SelectProps<false>` or `SelectProps<true>`; the unparameterized
type continues to allow both modes. Existing string-valued controls, explicit Empty contents,
flat Autocomplete items, and popup string titles remain supported.
