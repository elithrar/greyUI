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
  WindowWidget,
} from "../../src";
import { CopyCommand } from "./CopyCommand";
import { DesktopDemos, FeedbackDemos, FieldDemos } from "./next-components";
import "./docs.css";

const WORKBENCH_URL = "https://workbench.questionable.services/";

const sections = [
  ["principles", "Principles"],
  ["buttons", "Buttons"],
  ["fields", "Fields"],
  ["selection", "Selection"],
  ["desktop", "Desktop controls"],
  ["feedback", "Feedback"],
  ["tabs", "Tabs"],
  ["overlays", "Menus & overlays"],
  ["content", "Content"],
  ["window", "Window shell"],
  ["tokens", "Tokens"],
] as const;

function Demo({ title, children, code }: { title: string; children: ReactNode; code?: string }) {
  return (
    <div className="docs-demo">
      <div className="docs-demo-title">{title}</div>
      <div className="docs-demo-canvas">{children}</div>
      {code ? (
        <pre className="docs-code">
          <code>{code}</code>
        </pre>
      ) : null}
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

function App() {
  const [viewMode, setViewMode] = useState<"list" | "icons">("list");

  return (
    <Tooltip.Provider delay={350}>
      <div className="docs-desktop" data-greyui-theme="beos">
        <aside className="docs-deskbar" aria-label="Documentation navigation">
          <div className="docs-deskbar-top">
            <strong>greyUI</strong>
            <Badge tone="accent">0.2.0</Badge>
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
            React 19
            <br />
            Base UI 1.7
          </div>
        </aside>

        <main className="docs-main">
          <Window
            title="greyUI — Component Reference"
            controls={
              <>
                <WindowWidget kind="close" label="Close" />
                <WindowWidget kind="zoom" label="Zoom" />
              </>
            }
            className="docs-hero-window"
          >
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
                  React components styled after BeOS R5 and Haiku. Compound controls use Base UI for
                  keyboard, focus, and ARIA behavior.
                </p>
                <div className="docs-install">
                  <span className="docs-install-label">Install with npm</span>
                  <CopyCommand value="npm install greyui" label="npm install command" />
                </div>
              </div>
              <GroupBox title="Clone source">
                <code>git clone https://github.com/elithrar/greyUI.git</code>
              </GroupBox>
            </div>
            <StatusBar>0.2.0 · ESM · CSS tokens</StatusBar>
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
                    <a href={WORKBENCH_URL}>WorkbenchOS</a>-specific application components are not
                    included.
                  </li>
                </ul>
              </GroupBox>
            </div>
          </Section>

          <Section
            id="buttons"
            title="Buttons"
            intro="Compact beveled buttons. The defaultAction prop adds the default-action outline."
          >
            <Demo
              title="Variants"
              code={
                '<Button>Cancel</Button>\n<Button defaultAction variant="primary">Apply</Button>\n<Button variant="destructive">Delete</Button>'
              }
            >
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
          </Section>

          <Section
            id="fields"
            title="Fields"
            intro="Inputs, textareas, selects, number fields, and comboboxes use white inset editing surfaces."
          >
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
            id="desktop"
            title="Desktop controls"
            intro={
              <>
                Toolbars, context menus, sliders, separators, and collapsible panels follow the same
                compact control geometry used by <a href={WORKBENCH_URL}>WorkbenchOS</a>.
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
                Progress and meter tracks use the same inset document trough and selection-blue fill
                as <a href={WORKBENCH_URL}>WorkbenchOS</a>. Toasts use a small desktop notification
                panel rather than card styling.
              </>
            }
          >
            <FeedbackDemos />
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
            intro="Menus, popovers, tooltips, and dialogs share the same panel, border, and bevel styles."
          >
            <Demo title="Interactive overlays">
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

                <Dialog.Root>
                  <Dialog.Trigger>Open dialog…</Dialog.Trigger>
                  <Dialog.Popup title="Enable edit mode" description="Apply to save the changes.">
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
                      <AlertDialog.Close className="greyui-button">Keep editing</AlertDialog.Close>
                      <AlertDialog.Close className="greyui-button" data-variant="destructive">
                        Discard
                      </AlertDialog.Close>
                    </div>
                  </AlertDialog.Popup>
                </AlertDialog.Root>

                <Tooltip.Root>
                  <Tooltip.Trigger className="greyui-button">Hover me</Tooltip.Trigger>
                  <Tooltip.Popup>Tooltip</Tooltip.Popup>
                </Tooltip.Root>
              </div>
            </Demo>
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
            intro="Window provides chrome only: title tab, optional controls, menu bar, content, and status bar. It does not manage desktop state."
          >
            <Demo title="Active and inactive windows">
              <div className="docs-window-pair">
                <Window
                  title="Preferences"
                  controls={
                    <>
                      <WindowWidget kind="close" label="Close" />
                      <WindowWidget kind="zoom" label="Zoom" />
                    </>
                  }
                >
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
                <Window
                  title="Tracker"
                  active={false}
                  controls={<WindowWidget kind="close" label="Close" />}
                >
                  <div className="docs-window-example-body">Inactive window</div>
                </Window>
              </div>
            </Demo>
          </Section>

          <Section
            id="tokens"
            title="Design tokens"
            intro={
              <>
                The default theme uses the R5 palette from <a href={WORKBENCH_URL}>WorkbenchOS</a>.
                Override these CSS custom properties at a theme boundary.
              </>
            }
          >
            <div className="docs-token-grid">
              {[
                ["--greyui-tab-active", "#d8cb00"],
                ["--greyui-panel", "#d8d8d8"],
                ["--greyui-control", "#dedede"],
                ["--greyui-document", "#ffffff"],
                ["--greyui-selection", "#6698cb"],
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

          <footer className="docs-footer">greyUI 0.2.0 · React 19 · Base UI 1.7</footer>
        </main>
      </div>
    </Tooltip.Provider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
