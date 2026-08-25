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
import "./docs.css";

const sections = [
  ["principles", "Principles"],
  ["buttons", "Buttons"],
  ["fields", "Fields"],
  ["selection", "Selection"],
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
            <Badge tone="accent">0.1.1</Badge>
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
                  <Menu.Separator />
                  <Menu.Item disabled>Publish 0.1.1…</Menu.Item>
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
                <div className="docs-eyebrow">WorkbenchOS visual system, standalone</div>
                <h1>greyUI</h1>
                <p>
                  Compact BeOS R5 / Haiku-inspired React components. The visual language comes from
                  WorkbenchOS; Base UI provides the behavior for compound interactive controls.
                </p>
              </div>
              <GroupBox title="Clone source">
                <code>git clone https://github.com/elithrar/greyUI.git</code>
              </GroupBox>
            </div>
            <StatusBar>0.1.1 · ESM · CSS tokens · WorkbenchOS-aligned controls</StatusBar>
          </Window>

          <Section
            id="principles"
            title="Principles"
            intro="System controls first. Neutral panels, inset document surfaces, compact sizing and quiet feedback—not a modern card system wearing a retro skin."
          >
            <div className="docs-principles">
              <GroupBox title="Visual language">
                <ul>
                  <li>Yellow active window tabs; grey inactive window tabs.</li>
                  <li>Outset bevels for controls, inset bevels for fields.</li>
                  <li>White only for documents, inputs, tables and source panes.</li>
                  <li>Swiss/Helvetica-style 12 px UI typography.</li>
                </ul>
              </GroupBox>
              <GroupBox title="Component model">
                <ul>
                  <li>Native elements for simple controls.</li>
                  <li>Base UI for focus, keyboard, ARIA and popup positioning.</li>
                  <li>Data attributes expose state to plain CSS.</li>
                  <li>Product-specific WorkbenchOS components stay out of core.</li>
                </ul>
              </GroupBox>
            </div>
          </Section>

          <Section
            id="buttons"
            title="Buttons"
            intro="Small, beveled system actions with a persistent primary/default-action treatment rather than filled brand buttons."
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
            intro="Editable content lives on white inset surfaces so form controls read as content, not panel chrome."
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
          </Section>

          <Section
            id="selection"
            title="Selection controls"
            intro="The library keeps compact native-system proportions while Base UI manages form state and keyboard behavior."
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
            id="tabs"
            title="Tabs"
            intro="WorkbenchOS view tabs are compact beveled buttons. The active view becomes an inset white document surface while window tabs keep the yellow/grey focus convention."
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
                    content: <p>Lower-level integration settings.</p>,
                  },
                ]}
              />
            </Demo>
          </Section>

          <Section
            id="overlays"
            title="Menus & overlays"
            intro="Menus stay terse and system-like. Popovers, tooltips and dialogs reuse the same panel and window vocabulary instead of introducing separate floating-card styling."
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
                    description="greyUI separates headless behavior from the WorkbenchOS-derived theme."
                  >
                    <Popover.Close className="greyui-button" type="button">
                      Close
                    </Popover.Close>
                  </Popover.Popup>
                </Popover.Root>

                <Dialog.Root>
                  <Dialog.Trigger>Open dialog…</Dialog.Trigger>
                  <Dialog.Popup
                    title="Enable edit mode"
                    description="Changes remain local until you explicitly apply them."
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
                      <AlertDialog.Close className="greyui-button">Keep editing</AlertDialog.Close>
                      <AlertDialog.Close className="greyui-button" data-variant="destructive">
                        Discard
                      </AlertDialog.Close>
                    </div>
                  </AlertDialog.Popup>
                </AlertDialog.Root>

                <Tooltip.Root>
                  <Tooltip.Trigger className="greyui-button">Hover me</Tooltip.Trigger>
                  <Tooltip.Popup>BeOS-style tooltip</Tooltip.Popup>
                </Tooltip.Root>
              </div>
            </Demo>
          </Section>

          <Section
            id="content"
            title="Content surfaces"
            intro="Tables and scroll areas are intentionally plain. They exist to display information densely, not to create decorative containers."
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
            intro="Window is deliberately a shell rather than a desktop manager. Apps can compose their own menu bar and status bar without pulling WorkbenchOS state or launcher logic into the package."
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
                    <Button size="sm">File</Button>
                    <Button size="sm">Edit</Button>
                  </MenuBar>
                  <div className="docs-window-example-body">Active window content</div>
                  <StatusBar>Ready</StatusBar>
                </Window>
                <Window
                  title="Tracker"
                  active={false}
                  controls={<WindowWidget kind="close" label="Close" />}
                >
                  <div className="docs-window-example-body">
                    Inactive chrome keeps the same geometry.
                  </div>
                </Window>
              </div>
            </Demo>
          </Section>

          <Section
            id="tokens"
            title="Design tokens"
            intro="The default theme mirrors WorkbenchOS’s canonical R5 palette. Override CSS custom properties at a theme boundary without changing component structure."
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

          <footer className="docs-footer">
            greyUI 0.1.1 · WorkbenchOS visual language · Base UI behavior
          </footer>
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
