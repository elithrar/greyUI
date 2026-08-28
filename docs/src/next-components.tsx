import {
  Badge,
  Banner,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Collapsible,
  Combobox,
  ContextMenu,
  createVirtualAnchor,
  DatePicker,
  Empty,
  Field,
  IconButton,
  Input,
  InputGroup,
  Loader,
  Meter,
  NumberField,
  Pagination,
  Progress,
  Popover,
  SegmentedMeter,
  Separator,
  Slider,
  Toast,
  Toolbar,
  StatusBar,
  StatusBarItem,
  StatusBarSeparator,
  StatusLight,
  Window,
} from "../../src";
import { useMemo, useRef, useState } from "react";

const themes = ["BeOS R5", "Haiku", "Workbench"];

function Demo({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="docs-demo">
      <div className="docs-demo-title">{title}</div>
      <div className="docs-demo-canvas">{children}</div>
    </div>
  );
}

export function FieldDemos() {
  return (
    <>
      <div className="docs-grid-2 docs-component-grid">
        <Demo title="Field">
          <Field.Root>
            <Field.Label>ROM name</Field.Label>
            <Field.Control defaultValue="89-911-28P-4K-SW.bin" />
            <Field.Description>Shown in exported file names.</Field.Description>
          </Field.Root>
        </Demo>

        <Demo title="Input group">
          <div className="docs-stack docs-control-fill">
            <InputGroup.Root>
              <InputGroup.Addon>Path</InputGroup.Addon>
              <InputGroup.Input defaultValue="/roms/911.bin" aria-label="ROM path" />
              <InputGroup.Button>Browse…</InputGroup.Button>
            </InputGroup.Root>
            <InputGroup.Root>
              <InputGroup.Input defaultValue="6500" aria-label="RPM value" />
              <InputGroup.Suffix>RPM</InputGroup.Suffix>
            </InputGroup.Root>
          </div>
        </Demo>

        <Demo title="Number field">
          <NumberField.Root defaultValue={6500} min={5000} max={8000} step={100}>
            <NumberField.ScrubArea>Rev limit</NumberField.ScrubArea>
            <NumberField.Group>
              <NumberField.Input aria-label="Rev limit" />
              <NumberField.Increment />
              <NumberField.Decrement />
            </NumberField.Group>
          </NumberField.Root>
        </Demo>

        <Demo title="Combobox">
          <Combobox.Root items={themes}>
            <Combobox.InputGroup>
              <Combobox.Input aria-label="Theme" placeholder="Find a theme…" />
              <Combobox.Clear />
              <Combobox.Trigger />
            </Combobox.InputGroup>
            <Combobox.Popup>
              <Combobox.Empty>No matches</Combobox.Empty>
              <Combobox.List>
                {(theme: string) => (
                  <Combobox.Item key={theme} value={theme}>
                    <Combobox.ItemIndicator />
                    <span>{theme}</span>
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Root>
        </Demo>
      </div>

      <Demo title="Form state matrix">
        <div className="docs-state-grid">
          <label className="docs-field">
            <span>Enabled input</span>
            <Input defaultValue="Editable" />
          </label>
          <label className="docs-field">
            <span>Disabled input</span>
            <Input disabled defaultValue="Unavailable" />
          </label>
          <NumberField.Root disabled defaultValue={6500}>
            <NumberField.ScrubArea>Disabled spinner</NumberField.ScrubArea>
            <NumberField.Group>
              <NumberField.Input aria-label="Disabled spinner" />
              <NumberField.Increment />
              <NumberField.Decrement />
            </NumberField.Group>
          </NumberField.Root>
        </div>
      </Demo>
    </>
  );
}

export function DesktopDemos() {
  return (
    <>
      <Demo title="Toolbar">
        <Toolbar.Root aria-label="Document toolbar">
          <Toolbar.Group>
            <Toolbar.Button>New</Toolbar.Button>
            <Toolbar.Button>Open…</Toolbar.Button>
            <Toolbar.Button>Save</Toolbar.Button>
          </Toolbar.Group>
          <Toolbar.Separator />
          <Toolbar.Group>
            <Toolbar.Button disabled>Print</Toolbar.Button>
            <Toolbar.Input aria-label="Find" placeholder="Find…" />
          </Toolbar.Group>
        </Toolbar.Root>
      </Demo>

      <div className="docs-grid-2 docs-component-grid">
        <Demo title="Slider">
          <div className="docs-stack docs-control-fill">
            <Slider.Root defaultValue={65}>
              <Slider.Label>Volume</Slider.Label>
              <Slider.Value />
              <Slider.Control>
                <Slider.Track>
                  <Slider.Indicator />
                </Slider.Track>
                <Slider.Thumb />
              </Slider.Control>
            </Slider.Root>
            <Slider.Root disabled defaultValue={35}>
              <Slider.Label>Disabled</Slider.Label>
              <Slider.Value />
              <Slider.Control>
                <Slider.Track>
                  <Slider.Indicator />
                </Slider.Track>
                <Slider.Thumb />
              </Slider.Control>
            </Slider.Root>
          </div>
        </Demo>

        <Demo title="Context menu">
          <ContextMenu.Root>
            <ContextMenu.Trigger className="docs-context-target" tabIndex={0}>
              Right-click this Tracker row
            </ContextMenu.Trigger>
            <ContextMenu.Popup>
              <ContextMenu.Item>Open</ContextMenu.Item>
              <ContextMenu.Item>Rename</ContextMenu.Item>
              <ContextMenu.Separator />
              <ContextMenu.Item>Move to Trash</ContextMenu.Item>
            </ContextMenu.Popup>
          </ContextMenu.Root>
        </Demo>

        <Demo title="Collapsible">
          <Collapsible.Root defaultOpen>
            <Collapsible.Trigger>Advanced settings</Collapsible.Trigger>
            <Collapsible.Panel>
              <div className="docs-stack">
                <span>Lower-level application options.</span>
                <Button size="sm">Reset</Button>
              </div>
            </Collapsible.Panel>
          </Collapsible.Root>
        </Demo>

        <Demo title="Separator">
          <div className="docs-stack docs-control-fill">
            <span>General</span>
            <Separator />
            <span>Advanced</span>
            <div className="docs-row">
              <Button size="sm">Left</Button>
              <Separator orientation="vertical" />
              <Button size="sm">Right</Button>
            </div>
          </div>
        </Demo>
      </div>
    </>
  );
}

function ToastButton() {
  const toastManager = Toast.useToastManager();

  return (
    <Button
      onClick={() =>
        toastManager.add({
          title: "ROM saved",
          description: "89-911-28P-4K-SW.bin was written successfully.",
        })
      }
    >
      Show notification
    </Button>
  );
}

function ToastDemo() {
  return (
    <Toast.Provider>
      <ToastButton />
      <Toast.Toaster />
    </Toast.Provider>
  );
}

export function FeedbackDemos() {
  return (
    <div className="docs-grid-2 docs-component-grid">
      <Demo title="Badges">
        <div className="docs-row">
          <Badge>Default</Badge>
          <Badge tone="accent">Accent</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Danger</Badge>
          <Badge tone="edit">Edit</Badge>
          <Badge tone="experimental">Experimental</Badge>
        </div>
      </Demo>

      <Demo title="Progress">
        <div className="docs-stack docs-control-fill">
          <Progress.Root value={64}>
            <Progress.Label>Writing ROM</Progress.Label>
            <Progress.Value />
            <Progress.Track>
              <Progress.Indicator />
            </Progress.Track>
          </Progress.Root>
          <Progress.Root value={null}>
            <Progress.Label>Detecting programmer</Progress.Label>
            <Progress.Track>
              <Progress.Indicator />
            </Progress.Track>
          </Progress.Root>
        </div>
      </Demo>

      <Demo title="Meter">
        <Meter.Root value={72}>
          <Meter.Label>Storage used</Meter.Label>
          <Meter.Value />
          <Meter.Track>
            <Meter.Indicator />
          </Meter.Track>
        </Meter.Root>
      </Demo>

      <Demo title="Toast">
        <ToastDemo />
      </Demo>
    </div>
  );
}

export function KumoPatternDemos() {
  const [page, setPage] = useState(3);

  return (
    <div className="docs-grid-2 docs-component-grid">
      <Demo title="Inline banners">
        <div className="docs-stack docs-control-fill">
          <Banner
            title="Update available"
            description="A new component build is ready."
            action={<Banner.Action>Install</Banner.Action>}
          />
          <Banner size="sm" variant="alert" description="Unsaved calibration changes remain." />
        </div>
      </Demo>

      <Demo title="Tracker breadcrumbs">
        <Breadcrumbs>
          <Breadcrumbs.Link href="#">boot</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Link href="#">home</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>calibrations</Breadcrumbs.Current>
        </Breadcrumbs>
      </Demo>

      <Demo title="Empty state">
        <Empty
          size="sm"
          icon={<span className="docs-empty-folder" />}
          title="No ROM loaded"
          description="Open a binary image to inspect its calibration tables."
          contents={<Button size="sm">Open ROM…</Button>}
        />
      </Demo>

      <Demo title="Loaders">
        <div className="docs-row">
          <Loader size="sm" label="Loading inline data" />
          <Loader label="Loading document" />
          <Loader size="lg" label="Loading application" />
        </div>
      </Demo>

      <Demo title="Pagination">
        <Pagination page={page} setPage={setPage} perPage={10} totalCount={86} />
      </Demo>
    </div>
  );
}

function VirtualAnchorDemo() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [anchor, setAnchor] = useState(() => createVirtualAnchor({ x: 0, y: 0 }));

  return (
    <Popover.Root>
      <Popover.Trigger
        ref={triggerRef}
        onClick={() => {
          const contextElement = triggerRef.current;
          const rect = contextElement?.getBoundingClientRect();
          if (rect && contextElement) {
            setAnchor(
              createVirtualAnchor({
                x: rect.right,
                y: rect.top,
                height: rect.height,
                contextElement,
              }),
            );
          }
        }}
      >
        Open at coordinate
      </Popover.Trigger>
      <Popover.Popup
        title="Virtual anchor"
        positionerProps={{ anchor, positionMethod: "fixed", side: "right" }}
      >
        Positioned from a runtime rectangle, with viewport collision handling.
      </Popover.Popup>
    </Popover.Root>
  );
}

export function IntegrationDemos() {
  const [date, setDate] = useState("2026-09-05");
  const routeSegments = useMemo(
    () => [
      { label: "Paved", value: 22, color: "var(--greyui-selection)" },
      { label: "Stone dust", value: 12, color: "var(--greyui-tab-active)" },
    ],
    [],
  );

  return (
    <div className="docs-grid-2 docs-component-grid">
      <Demo title="Compact date picker">
        <DatePicker
          label="Ride date"
          value={date}
          onValueChange={setDate}
          min="2026-09-01"
          max="2026-09-16"
        />
      </Demo>

      <Demo title="Icon button group">
        <ButtonGroup aria-label="Map zoom" orientation="vertical">
          <IconButton label="Zoom in">+</IconButton>
          <IconButton label="Zoom out">−</IconButton>
        </ButtonGroup>
      </Demo>

      <Demo title="Segmented meter">
        <div className="docs-stack docs-control-fill">
          <span>Trail surface · 34 mi</span>
          <SegmentedMeter label="Trail surface" max={34} segments={routeSegments} />
        </div>
      </Demo>

      <Demo title="Virtual-anchor popover">
        <VirtualAnchorDemo />
      </Demo>

      <Demo title="Floating, collapsible window">
        <Window title="Route" collapsible responsive="floating" className="docs-floating-window">
          <div className="docs-window-example-body">Map overlays keep their window geometry.</div>
          <StatusBar>
            <StatusLight state="ready" label="Route loaded" />
            <StatusBarItem grow>Ready</StatusBarItem>
            <StatusBarSeparator />
            <StatusBarItem>34.0 mi</StatusBarItem>
          </StatusBar>
        </Window>
      </Demo>
    </div>
  );
}
