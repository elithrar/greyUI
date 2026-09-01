import { StrictMode, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import {
  AlertDialog,
  Badge,
  Button,
  Checkbox,
  Dialog,
  GroupBox,
  Input,
  Layer,
  Menu,
  MenuBar,
  Popover,
  RadioGroup,
  ScrollArea,
  Select,
  StatusBar,
  Switch,
  Table,
  Tabs,
  ToggleButton,
  SegmentedControl,
  Textarea,
  Tooltip,
  Window,
} from "../../src";
import { CopyCommand } from "./CopyCommand";
import { DenseWindowExample, denseWindowCode } from "./dense-window-example";
import { HighValueComponentDemos } from "./high-value-components";
import {
  DesktopDemos,
  FeedbackDemos,
  FieldDemos,
  IntegrationDemos,
  KumoPatternDemos,
} from "./next-components";
import { GREYUI_VERSION } from "./version";
import "./docs.css";

const WORKBENCH_URL = "https://workbench.questionable.services/";
const BASE_UI_COMPONENTS_URL = "https://base-ui.com/react/components";
const CLONE_COMMAND = "git clone https://github.com/elithrar/greyUI.git";
const COMPONENT_IMPORT_EXAMPLE = 'import { Button, GroupBox, Select, Window } from "greyui";';

const sections = [
  ["principles", "Principles"],
  ["buttons", "Buttons"],
  ["fields", "Fields"],
  ["selection", "Selection"],
  ["high-value", "Grouped controls"],
  ["desktop", "Desktop controls"],
  ["feedback", "Feedback"],
  ["patterns", "Application patterns"],
  ["integration", "App primitives"],
  ["tabs", "Tabs"],
  ["overlays", "Menus & overlays"],
  ["content", "Content"],
  ["window", "Window shell"],
  ["tokens", "Tokens"],
] as const;

function CodeDetails({ code, label = "Usage" }: { code: string; label?: string }) {
  return (
    <details className="docs-code-details">
      <summary>{label}</summary>
      <pre className="docs-code">
        <code>{code}</code>
      </pre>
    </details>
  );
}

function Demo({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="docs-demo">
      <div className="docs-demo-title">{title}</div>
      <div className="docs-demo-canvas">{children}</div>
    </div>
  );
}

function Section({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="docs-section" id={id}>
      <h2>{title}</h2>
      <p className="docs-lede">{intro}</p>
      {children}
    </section>
  );
}

function Guidance({
  title,
  children,
  code,
  codeLabel,
}: {
  title: string;
  children: ReactNode;
  code?: string;
  codeLabel?: string;
}) {
  return (
    <aside className="docs-guidance" aria-label={title}>
      <strong className="docs-guidance-title">{title}</strong>
      <div className="docs-guidance-body">{children}</div>
      {code ? (
        codeLabel ? (
          <CodeDetails code={code} label={codeLabel} />
        ) : (
          <CodeDetails code={code} />
        )
      ) : null}
    </aside>
  );
}

function App() {
  const [viewMode, setViewMode] = useState<"list" | "icons">("list");

  return (
    <Layer.Provider>
      <Tooltip.Provider delay={350}>
        <div className="docs-desktop" data-greyui-theme="beos">
          <aside className="docs-deskbar" aria-label="Documentation navigation">
            <div className="docs-deskbar-top">
              <strong>greyUI</strong>
              <Badge tone="accent">{GREYUI_VERSION}</Badge>
            </div>
            <div className="docs-deskbar-handle" aria-hidden="true" />
            <nav>
              {sections.map(([id, label]) => (
                <a href={`#${id}`} key={id}>
                  {label}
                </a>
              ))}
            </nav>
            <div className="docs-deskbar-footer">
              React
              <br />
              Base UI
            </div>
          </aside>

          <main className="docs-main">
            <Window title="greyUI — Component Reference" collapsible className="docs-hero-window">
              <MenuBar>
                <Menu.Root>
                  <Menu.Trigger>File</Menu.Trigger>
                  <Menu.Popup>
                    <Menu.Item>Clone source</Menu.Item>
                    <Menu.Item>Copy clone command</Menu.Item>
                  </Menu.Popup>
                </Menu.Root>
                <Menu.Root>
                  <Menu.Trigger>View</Menu.Trigger>
                  <Menu.Popup>
                    <Menu.Item>Components</Menu.Item>
                    <Menu.Item>Design tokens</Menu.Item>
                  </Menu.Popup>
                </Menu.Root>
              </MenuBar>
              <div className="docs-hero">
                <div>
                  <div className="docs-eyebrow">BeOS / Haiku UI for React</div>
                  <h1>greyUI</h1>
                  <p>
                    React components styled after BeOS R5 and Haiku. Compound controls use Base UI
                    for keyboard, focus, and ARIA behavior.
                  </p>
                  <div className="docs-install">
                    <span className="docs-install-label">Install with npm</span>
                    <CopyCommand value="npm install greyui" label="npm install command" />
                    <span className="docs-install-label">Clone source</span>
                    <CopyCommand value={CLONE_COMMAND} label="git clone command" />
                  </div>
                  <p className="docs-stylesheet-note">
                    Import <code>greyui/styles.css</code> once in your application.
                  </p>
                </div>
              </div>
              <StatusBar>{GREYUI_VERSION} · ESM · CSS tokens</StatusBar>
            </Window>

            <Section
              id="principles"
              title="Principles"
              intro="Compact controls, neutral panels, white document surfaces, and BeOS-style window chrome."
            >
              <div className="docs-principles">
                <GroupBox title="Visual language">
                  <ul>
                    <li>Yellow tabs mark active windows; inactive tabs are grey.</li>
                    <li>Controls use outset bevels; fields use inset bevels.</li>
                    <li>White backgrounds are reserved for document and editable content.</li>
                    <li>12 px Helvetica/Arial system typography.</li>
                  </ul>
                </GroupBox>
                <GroupBox title="Component model">
                  <ul>
                    <li>Native HTML for simple controls.</li>
                    <li>Base UI for compound-control behavior and positioning.</li>
                    <li>Component state is exposed through data attributes.</li>
                    <li>
                      <a href={WORKBENCH_URL}>WorkbenchOS</a>-specific application components are
                      not included.
                    </li>
                  </ul>
                </GroupBox>
              </div>
              <Guidance title="API conventions">
                <p>
                  Import <code>greyui/styles.css</code> once. Simple controls accept native props;
                  compound controls use <code>Root</code> plus named parts and Base UI behavior.
                  Consumers still provide labels and accessible names. See the
                  <a href={BASE_UI_COMPONENTS_URL}> Base UI reference</a> for exhaustive primitive
                  props.
                </p>
                <CopyCommand value={COMPONENT_IMPORT_EXAMPLE} label="component import example" />
              </Guidance>
            </Section>

            <Section
              id="buttons"
              title="Buttons"
              intro='Compact beveled buttons. Button defaults to type="button". Primary, default action, selected, and focus are independent states.'
            >
              <Demo title="Variants">
                <div className="docs-row">
                  <Button>Cancel</Button>
                  <Button defaultAction variant="primary">
                    Apply
                  </Button>
                  <Button variant="destructive">Delete</Button>
                  <Button disabled>Disabled</Button>
                  <Button size="sm">Small</Button>
                  <SegmentedControl aria-label="View mode">
                    <ToggleButton
                      size="sm"
                      pressed={viewMode === "list"}
                      onClick={() => setViewMode("list")}
                    >
                      List
                    </ToggleButton>
                    <ToggleButton
                      size="sm"
                      pressed={viewMode === "icons"}
                      onClick={() => setViewMode("icons")}
                    >
                      Icons
                    </ToggleButton>
                  </SegmentedControl>
                </div>
              </Demo>
              <Guidance title="Button state model">
                <p>
                  Use <code>variant="primary"</code> for emphasis, <code>defaultAction</code> for
                  the action Enter should invoke, and <code>aria-pressed</code> (or
                  <code> ToggleButton</code>) for persistent selection. Pointer focus adds no sticky
                  cue; keyboard <code>:focus-visible</code> uses a neutral inset cue without
                  replacing the selected fill.
                </p>
              </Guidance>
              <Demo title="Interactive state matrix">
                <Table className="docs-button-state-table">
                  <thead>
                    <tr>
                      <th>State</th>
                      <th>Behavior</th>
                      <th>Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Normal / hover / active</td>
                      <td>Hover brightens; active reverses the bevel while held.</td>
                      <td>
                        <Button>Inspect</Button>
                      </td>
                    </tr>
                    <tr>
                      <td>Selected</td>
                      <td>Selection-blue fill and inset bevel persist independently of focus.</td>
                      <td>
                        <Button aria-pressed="true">Selected</Button>
                      </td>
                    </tr>
                    <tr>
                      <td>Primary</td>
                      <td>Emphasized action; does not imply selection or default behavior.</td>
                      <td>
                        <Button variant="primary">Apply</Button>
                      </td>
                    </tr>
                    <tr>
                      <td>Default action</td>
                      <td>Neutral outer designation for the action invoked by Enter.</td>
                      <td>
                        <Button defaultAction>Save</Button>
                      </td>
                    </tr>
                    <tr>
                      <td>Mouse focus</td>
                      <td>Clicking does not leave a focus-only border.</td>
                      <td>
                        <Button>Click me</Button>
                      </td>
                    </tr>
                    <tr>
                      <td>Keyboard focus</td>
                      <td>Tab here for the black inset cue; selected fill remains visible.</td>
                      <td>
                        <Button aria-pressed="true">Tab to me</Button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Demo>
            </Section>

            <Section
              id="fields"
              title="Fields"
              intro="Inputs, textareas, selects, number fields, and comboboxes use white inset editing surfaces."
            >
              <Guidance title="Choose the field">
                <p>
                  <code>Select</code> is fixed-list; <code>Combobox</code> searches and selects
                  listed values; <code>Autocomplete</code> keeps free-form text valid.
                </p>
              </Guidance>
              <div className="docs-grid-2">
                <Demo title="Input">
                  <label className="docs-field">
                    <span>ROM name</span>
                    <Input defaultValue="89-911-28P-4K-SW.bin" />
                  </label>
                </Demo>
                <Demo title="Textarea">
                  <label className="docs-field">
                    <span>Notes</span>
                    <Textarea defaultValue="Checked against stock image." />
                  </label>
                </Demo>
                <Demo title="Select">
                  <Select
                    label="Theme"
                    defaultValue="beos"
                    options={[
                      { value: "beos", label: "BeOS R5" },
                      { value: "haiku", label: "Haiku" },
                      { value: "inactive", label: "Inactive", disabled: true },
                    ]}
                  />
                </Demo>
              </div>
              <FieldDemos />
            </Section>

            <Section
              id="selection"
              title="Selection controls"
              intro="Checkboxes, radios, and switches use compact system-control sizing. Base UI handles state and keyboard behavior."
            >
              <Demo title="Checkbox, radio and switch">
                <div className="docs-selection-grid">
                  <div className="docs-stack">
                    <Checkbox defaultChecked label="Show decoded values" />
                    <Checkbox label="Show experimental tables" />
                    <Checkbox disabled label="Unavailable option" />
                  </div>
                  <RadioGroup
                    aria-label="Display mode"
                    defaultValue="hex"
                    options={[
                      { value: "hex", label: "Hex" },
                      { value: "decimal", label: "Decimal" },
                      { value: "binary", label: "Binary" },
                    ]}
                  />
                  <div className="docs-stack">
                    <Switch defaultChecked label="Autosave" />
                    <Switch label="Sounds" />
                  </div>
                </div>
              </Demo>
            </Section>

            <Section
              id="high-value"
              title="Grouped controls and suggestions"
              intro={
                <>
                  Stateful grouped controls and disclosures use Base UI behavior while retaining the
                  compact geometry used by <a href={WORKBENCH_URL}>WorkbenchOS</a>.
                </>
              }
            >
              <Guidance title="Composition choices">
                <ul>
                  <li>
                    <code>ToggleGroup</code> owns values; <code>SegmentedControl</code> only groups
                    caller-controlled <code>ToggleButton</code>s.
                  </li>
                  <li>
                    <code>Fieldset</code> adds form semantics and shared disabled state.
                    <code> Accordion</code> groups disclosures; <code>Collapsible</code> handles
                    one.
                  </li>
                  <li>
                    Use <code>Fieldset.Root variant="plain" aria-label="…"</code> when the
                    surrounding window already provides visual chrome and a visible legend would
                    repeat its heading.
                  </li>
                </ul>
              </Guidance>
              <HighValueComponentDemos />
            </Section>

            <Section
              id="desktop"
              title="Desktop controls"
              intro={
                <>
                  Toolbars, context menus, sliders, separators, and collapsible panels follow the
                  same compact control geometry used by <a href={WORKBENCH_URL}>WorkbenchOS</a>.
                </>
              }
            >
              <DesktopDemos />
            </Section>

            <Section
              id="feedback"
              title="Feedback"
              intro={
                <>
                  Progress and meter tracks use the same inset document trough and selection-blue
                  fill as <a href={WORKBENCH_URL}>WorkbenchOS</a>. Toasts use a small desktop
                  notification panel rather than card styling.
                </>
              }
            >
              <Guidance
                title="Choose feedback"
                code={"<Toast.Provider>\n  <App />\n  <Toast.Toaster />\n</Toast.Provider>"}
                codeLabel="Toast setup"
              >
                <p>
                  <code>Progress</code> tracks work; <code>Meter</code> measures a value.
                  <code> Banner</code> is inline; <code>Toast</code> is transient and requires a
                  provider/toaster pair.
                </p>
              </Guidance>
              <FeedbackDemos />
            </Section>

            <Section
              id="patterns"
              title="Application patterns"
              intro={
                <>
                  Kumo-inspired APIs adapted to <a href={WORKBENCH_URL}>WorkbenchOS</a>: compact
                  feedback, Tracker paths, empty states, busy indicators, and page controls without
                  modern card styling.
                </>
              }
            >
              <GroupBox title="GroupBox component" className="docs-groupbox-guide">
                <p>
                  Visual grouping for related controls or content; use <code>Fieldset</code> instead
                  when form semantics or shared disabled state matter.
                </p>
              </GroupBox>
              <KumoPatternDemos />
            </Section>

            <Section
              id="integration"
              title="Application primitives"
              intro="Compact, accessible pieces for map overlays, dashboards, and single-screen tools: responsive windows, grouped icon actions, structured status, dates, segmented values, and coordinate-driven popovers."
            >
              <IntegrationDemos />
            </Section>

            <Section
              id="tabs"
              title="Tabs"
              intro="Tabs use beveled triggers and an inset white panel for the active view. Window title tabs use the separate yellow/grey active state."
            >
              <Demo title="Related views">
                <Tabs
                  defaultValue="general"
                  items={[
                    {
                      value: "general",
                      label: "General",
                      content: <p>Compact controls and system defaults.</p>,
                    },
                    {
                      value: "appearance",
                      label: "Appearance",
                      content: <p>BeOS palette and bevel tokens.</p>,
                    },
                    {
                      value: "advanced",
                      label: "Advanced",
                      content: <p>Integration settings.</p>,
                    },
                  ]}
                />
              </Demo>
            </Section>

            <Section
              id="overlays"
              title="Menus & overlays"
              intro="Menus, popovers, tooltips, toasts, app-owned overlays, and dialogs use Layer.Provider to escape map and window stacking contexts in a stable order."
            >
              <Guidance
                title="Overlay contract"
                code={"<Layer.Provider>\n  <App />\n</Layer.Provider>"}
                codeLabel="Application setup"
              >
                <p>
                  Mount one <code>Layer.Provider</code> near the app root. Use
                  <code> AlertDialog</code> for confirmation decisions; context menus should not be
                  the only path to important actions.
                </p>
              </Guidance>
              <div className="docs-grid-2 docs-component-grid">
                <Demo title="Menu and tooltip">
                  <div className="docs-row">
                    <Menu.Root>
                      <Menu.Trigger>Actions</Menu.Trigger>
                      <Menu.Popup>
                        <Menu.Item>Open</Menu.Item>
                        <Menu.Item>Duplicate</Menu.Item>
                        <Menu.Separator />
                        <Menu.Item>Properties…</Menu.Item>
                      </Menu.Popup>
                    </Menu.Root>

                    <Tooltip.Root>
                      <Tooltip.Trigger className="greyui-button">Hover me</Tooltip.Trigger>
                      <Tooltip.Popup>Tooltip</Tooltip.Popup>
                    </Tooltip.Root>
                  </div>
                </Demo>

                <Demo title="Popover">
                  <Popover.Root>
                    <Popover.Trigger>Details…</Popover.Trigger>
                    <Popover.Popup
                      title="Build information"
                      description="Base UI handles popover behavior; greyUI supplies the theme."
                    >
                      <Popover.Close className="greyui-button" type="button">
                        Close
                      </Popover.Close>
                    </Popover.Popup>
                  </Popover.Root>
                </Demo>

                <Demo title="Dialogs">
                  <div className="docs-row">
                    <Dialog.Root>
                      <Dialog.Trigger>Open dialog…</Dialog.Trigger>
                      <Dialog.Popup
                        title="Enable edit mode"
                        description="Apply to save the changes."
                      >
                        <div className="docs-dialog-actions">
                          <Dialog.Close className="greyui-button">Cancel</Dialog.Close>
                          <Dialog.Close className="greyui-button" data-variant="primary">
                            Enable edits
                          </Dialog.Close>
                        </div>
                      </Dialog.Popup>
                    </Dialog.Root>

                    <AlertDialog.Root>
                      <AlertDialog.Trigger>Discard…</AlertDialog.Trigger>
                      <AlertDialog.Popup
                        title="Discard changes?"
                        description="This action cannot be undone."
                      >
                        <div className="docs-dialog-actions">
                          <AlertDialog.Close className="greyui-button">
                            Keep editing
                          </AlertDialog.Close>
                          <AlertDialog.Close className="greyui-button" data-variant="destructive">
                            Discard
                          </AlertDialog.Close>
                        </div>
                      </AlertDialog.Popup>
                    </AlertDialog.Root>
                  </div>
                </Demo>
              </div>
            </Section>

            <Section
              id="content"
              title="Content surfaces"
              intro="Tables and scroll areas use dense, undecorated layouts."
            >
              <div className="docs-grid-2">
                <Demo title="Table">
                  <Table>
                    <thead>
                      <tr>
                        <th>Component</th>
                        <th>Layer</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Button</td>
                        <td>native</td>
                        <td>
                          <Badge tone="success">stable</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td>Select</td>
                        <td>Base UI</td>
                        <td>
                          <Badge tone="success">stable</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td>Window</td>
                        <td>greyUI</td>
                        <td>
                          <Badge tone="accent">theme</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Demo>
                <Demo title="Scroll area">
                  <ScrollArea className="docs-scroll-demo" stableGutter>
                    <div className="docs-scroll-content">
                      {Array.from({ length: 18 }, (_, index) => (
                        <div key={index}>Tracker row {String(index + 1).padStart(2, "0")}</div>
                      ))}
                    </div>
                  </ScrollArea>
                </Demo>
              </div>
            </Section>

            <Section
              id="window"
              title="Window shell"
              intro="Window preserves its chrome while offering optional controlled or uncontrolled collapse state. Controls stay neutral after pointer or touch activation while retaining keyboard-visible focus. Stacked mode remains the responsive default; floating mode keeps compact overlay geometry on small screens."
            >
              <Demo title="Active and inactive windows">
                <div className="docs-window-pair">
                  <Window title="Preferences" collapsible>
                    <MenuBar>
                      <Menu.Root>
                        <Menu.Trigger>File</Menu.Trigger>
                        <Menu.Popup>
                          <Menu.Item>About Preferences</Menu.Item>
                          <Menu.Separator />
                          <Menu.Item>Close</Menu.Item>
                        </Menu.Popup>
                      </Menu.Root>
                      <Menu.Root>
                        <Menu.Trigger>Edit</Menu.Trigger>
                        <Menu.Popup>
                          <Menu.Item>Undo</Menu.Item>
                          <Menu.Item>Redo</Menu.Item>
                        </Menu.Popup>
                      </Menu.Root>
                    </MenuBar>
                    <div className="docs-window-example-body">Active window</div>
                    <StatusBar>Ready</StatusBar>
                  </Window>
                  <Window.Root active={false} defaultCollapsed>
                    <Window.TitleBar>
                      <Window.Title>Tracker</Window.Title>
                      <Window.Controls>
                        <Window.Collapse />
                      </Window.Controls>
                    </Window.TitleBar>
                    <Window.Body>
                      <div className="docs-window-example-body">Compound window API</div>
                      <Window.StatusBar>2 items</Window.StatusBar>
                    </Window.Body>
                  </Window.Root>
                </div>
              </Demo>
              <Guidance title="Dense application composition" code={denseWindowCode}>
                <p>
                  Put padded application content in <code>Window.Content</code>. Compose
                  <code> Window.Header</code>, <code>Window.Description</code>, and
                  <code> Window.Actions</code> for a shared content rail; keep menu and status bars
                  outside so their chrome remains full width. <code>Field.ActionRow</code> aligns a
                  labeled Select with adjacent buttons at the control edge. The header stacks below
                  520 px, while <code>responsive="stacked"</code> flattens the title chrome at the
                  standard responsive breakpoint.
                </p>
              </Guidance>
              <Demo title="Complete dense application window">
                <DenseWindowExample />
              </Demo>
            </Section>

            <Section
              id="tokens"
              title="Design tokens"
              intro={
                <>
                  The default theme uses the R5 palette from <a href={WORKBENCH_URL}>WorkbenchOS</a>
                  . Override these CSS custom properties at a theme boundary.
                </>
              }
            >
              <Guidance
                title="Theme overrides"
                code={
                  '[data-greyui-theme="custom"] {\n  --greyui-panel: #d4d4d4;\n  --greyui-selection: #356c9f;\n}'
                }
                codeLabel="CSS example"
              >
                <p>Override tokens at a theme boundary; avoid styling component internals.</p>
              </Guidance>
              <div className="docs-token-grid">
                {[
                  ["--greyui-tab-active", "#d8cb00"],
                  ["--greyui-panel", "#d8d8d8"],
                  ["--greyui-control", "#dedede"],
                  ["--greyui-document", "#ffffff"],
                  ["--greyui-selection", "#356c9f"],
                  ["--greyui-border-dark", "#808080"],
                ].map(([name, value]) => (
                  <div className="docs-token" key={name}>
                    <span className="docs-swatch" style={{ background: value }} />
                    <code>{name}</code>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </Section>

            <footer className="docs-footer">greyUI {GREYUI_VERSION} · React · Base UI</footer>
          </main>
        </div>
      </Tooltip.Provider>
    </Layer.Provider>
  );
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("greyUI docs root element is missing.");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
