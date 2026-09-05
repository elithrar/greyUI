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
  Popover,
  RadioGroup,
  ScrollArea,
  Select,
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
import {
  TabRenderingExamples,
  ToolbarRenderingExamples,
  MeterRenderingExamples,
} from "./rendering-examples";
import { GREYUI_VERSION } from "./version";
import { WindowRegressionFixtures } from "./window-regression-fixtures";
import "./docs.css";

const WORKBENCH_URL = "https://workbench.questionable.services/";
const BASE_UI_COMPONENTS_URL = "https://base-ui.com/react/components";
const GITHUB_URL = "https://github.com/elithrar/greyUI";
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

function GitHubMark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.65 7.65 0 0 1 8 3.95c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
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
              <div className="docs-deskbar-actions">
                <Badge tone="accent">{GREYUI_VERSION}</Badge>
                <a
                  className="docs-github-link"
                  href={GITHUB_URL}
                  aria-label="greyUI on GitHub"
                  title="greyUI on GitHub"
                >
                  <GitHubMark />
                </a>
              </div>
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
              <Window.MenuBar>
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
              </Window.MenuBar>
              <div className="docs-hero">
                <div>
                  <div className="docs-eyebrow">BeOS / Haiku UI for React</div>
                  <h1>greyUI</h1>
                  <a className="docs-hero-github-link" href={GITHUB_URL}>
                    <GitHubMark />
                    <span>GitHub</span>
                  </a>
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
              <Window.StatusBar>{GREYUI_VERSION} · ESM · CSS tokens</Window.StatusBar>
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
                <ul>
                  <li>
                    Import <code>greyui/styles.css</code> once at the application root.
                  </li>
                  <li>
                    Pass native props to simple controls; compose compound controls from
                    <code> Root</code> and their named parts.
                  </li>
                  <li>
                    Provide labels and accessible names. Use the
                    <a href={BASE_UI_COMPONENTS_URL}> Base UI reference</a> for primitive props.
                  </li>
                </ul>
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
                <ul>
                  <li>
                    Use <code>variant="primary"</code> for emphasis and <code>defaultAction</code>{" "}
                    to visually mark the form action associated with Enter.
                  </li>
                  <li>
                    Use <code>ToggleButton</code> or <code>aria-pressed</code> for persistent
                    selection—primary and selected are separate states.
                  </li>
                  <li>Keyboard focus is visible; pointer focus does not leave a sticky cue.</li>
                </ul>
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
                <ul>
                  <li>
                    Use <code>Select</code> for a fixed list, <code>Combobox</code> to filter listed
                    values, and <code>Autocomplete</code> for free-form input with suggestions.
                  </li>
                  <li>Popups match their control width and stay inside the viewport by default.</li>
                  <li>
                    Use <code>popupWidth="content"</code> or <code>width="content"</code> for long
                    options; pass <code>positionerProps</code> for custom placement.
                  </li>
                </ul>
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
                  <small>
                    Use a string value, or a string array with multiple. Callbacks follow that
                    choice.
                  </small>
                  <Select
                    label="Theme"
                    defaultValue="beos"
                    popupWidth="content"
                    options={[
                      { value: "beos", label: "BeOS R5" },
                      { value: "haiku", label: "Haiku" },
                      { value: "workbench", label: "Workbench with extended desktop tools" },
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
                <small>
                  Radio options and onValueChange use strings. Switch inherits disabled Fieldset
                  state.
                </small>
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
                    Use <code>ToggleGroup</code> when the group should own selection;
                    <code> SegmentedControl</code> only lays out controlled
                    <code> ToggleButton</code>s.
                  </li>
                  <li>
                    Use <code>Fieldset</code> for form semantics and shared disabled state;
                    <code> Accordion</code> for several disclosures; <code>Collapsible</code> for
                    one.
                  </li>
                  <li>
                    Use <code>Fieldset.Root variant="plain" aria-label="…"</code> when a window
                    already supplies the visible heading and border.
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
              <ToolbarRenderingExamples />
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
                <ul>
                  <li>
                    Use <code>Progress</code> for work toward completion and <code>Meter</code> for
                    a measured value.
                  </li>
                  <li>
                    Use <code>Banner</code> for persistent inline feedback and <code>Toast</code>{" "}
                    for transient feedback.
                  </li>
                  <li>
                    Mount one <code>Toast.Provider</code> and <code>Toast.Toaster</code> around your
                    application.
                  </li>
                </ul>
              </Guidance>
              <FeedbackDemos />
              <MeterRenderingExamples />
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
              <TabRenderingExamples />
            </Section>

            <Section
              id="overlays"
              title="Menus & overlays"
              intro="Window.MenuBar coordinates its Menu roots as one keyboard-navigable menubar. Menus, popovers, tooltips, toasts, app-owned overlays, and dialogs use Layer.Provider to escape map and window stacking contexts in a stable order."
            >
              <Guidance
                title="Overlay contract"
                code={"<Layer.Provider>\n  <App />\n</Layer.Provider>"}
                codeLabel="Application setup"
              >
                <ul>
                  <li>
                    Mount one <code>Layer.Provider</code> near the application root.
                  </li>
                  <li>
                    Use <code>AlertDialog</code> for confirmation; keep important actions available
                    outside context menus.
                  </li>
                  <li>
                    Put related menus in <code>Window.MenuBar</code>. Arrow keys switch menus,
                    Escape restores focus, and popups clamp to the viewport.
                  </li>
                </ul>
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
                  <small>Use React content in title for formatted headings.</small>
                  <Popover.Root>
                    <Popover.Trigger>Details…</Popover.Trigger>
                    <Popover.Popup
                      title={<span>Build information</span>}
                      description="Base UI handles popover behavior; greyUI supplies the theme."
                    >
                      <Popover.Close className="greyui-button" type="button">
                        Close
                      </Popover.Close>
                    </Popover.Popup>
                  </Popover.Root>
                </Demo>

                <Demo title="Dialogs">
                  <small>Popup titles accept React content and provide the accessible name.</small>
                  <div className="docs-row">
                    <Dialog.Root>
                      <Dialog.Trigger>Open dialog…</Dialog.Trigger>
                      <Dialog.Popup
                        title={<span>Enable edit mode</span>}
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
                        title={<span>Discard changes?</span>}
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
              intro="Window preserves its chrome while offering optional controlled or uncontrolled collapse state. Controls stay neutral after pointer or touch activation while retaining keyboard-visible focus. Auto chrome follows the window container; floating and stacked modes are explicit overrides."
            >
              <Demo title="Active and inactive windows">
                <div className="docs-window-pair">
                  <Window title="Preferences" collapsible>
                    <Window.MenuBar>
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
                    </Window.MenuBar>
                    <div className="docs-window-example-body">Active window</div>
                    <Window.StatusBar>Ready</Window.StatusBar>
                  </Window>
                  <Window.Root active={false}>
                    <Window.TitleBar>
                      <Window.Title>Tracker</Window.Title>
                      <Window.Controls>
                        <Window.Collapse />
                      </Window.Controls>
                    </Window.TitleBar>
                    <Window.Body>
                      <Window.MenuBar aria-label="Inactive window menu bar">
                        <Menu.Root>
                          <Menu.Trigger>File</Menu.Trigger>
                          <Menu.Popup>
                            <Menu.Item>Open Tracker</Menu.Item>
                            <Menu.Item>Close</Menu.Item>
                          </Menu.Popup>
                        </Menu.Root>
                        <Menu.Root>
                          <Menu.Trigger>View</Menu.Trigger>
                          <Menu.Popup>
                            <Menu.Item>Refresh</Menu.Item>
                          </Menu.Popup>
                        </Menu.Root>
                      </Window.MenuBar>
                      <div className="docs-window-example-body">Inactive compound window</div>
                      <Window.StatusBar>2 items</Window.StatusBar>
                    </Window.Body>
                  </Window.Root>
                </div>
              </Demo>
              <Guidance title="Build an application window" code={denseWindowCode}>
                <ul>
                  <li>
                    Put padded UI in <code>Window.Content</code>; keep <code>Window.MenuBar</code>{" "}
                    and
                    <code> Window.StatusBar</code> outside it for full-width chrome.
                  </li>
                  <li>
                    Compose <code>Window.Header</code>, <code>Window.Description</code>, and
                    <code> Window.Actions</code>; use <code>Field.ActionRow</code> for labeled
                    controls with adjacent actions.
                  </li>
                  <li>
                    Keep <code>chrome="auto"</code> and <code>layout="auto"</code> for
                    container-aware behavior; choose an explicit mode only when geometry must stay
                    fixed.
                  </li>
                </ul>
              </Guidance>
              <Demo title="Complete window example">
                <DenseWindowExample />
              </Demo>
              <Guidance title="Control responsive behavior">
                <ul>
                  <li>
                    <code>auto</code> follows each component container—not the page viewport.
                  </li>
                  <li>
                    Use explicit header, action-row, or chrome modes only when the layout should not
                    adapt.
                  </li>
                  <li>
                    Floating chrome joins its title tab to the frame rail. Stacked chrome keeps a
                    full-width title bar inside the outer frame.
                  </li>
                  <li>Menu popups clamp to the available viewport at narrow widths.</li>
                </ul>
              </Guidance>
              <Demo title="Responsive window examples">
                <WindowRegressionFixtures />
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
                <ul>
                  <li>Override shared tokens on a theme boundary.</li>
                  <li>Avoid targeting component internals.</li>
                </ul>
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
