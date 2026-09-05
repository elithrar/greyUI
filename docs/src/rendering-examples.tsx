import { Meter, SegmentedMeter, Tabs, Toolbar } from "../../src";

const reviewTabs = [
  { value: "general", label: "General", content: "Compact controls and system defaults." },
  {
    value: "appearance",
    label: "Appearance",
    content: (
      <Tabs
        defaultValue="ui"
        items={[
          { value: "ui", label: "UI", content: "Interface colors." },
          { value: "text", label: "Text", content: "Text and font settings." },
        ]}
      />
    ),
  },
  {
    value: "advanced",
    label: "Advanced",
    content: "Advanced options are managed.",
    disabled: true,
  },
];

export function TabRenderingExamples() {
  return (
    <div className="docs-grid-2 docs-component-grid" data-rendering-review="tabs">
      <div className="docs-demo">
        <div className="docs-demo-title">Vertical tabs</div>
        <div className="docs-demo-canvas docs-stack docs-control-fill">
          <small>
            Use arrow keys to move focus and Enter to select. Appearance includes nested tabs.
          </small>
          <Tabs orientation="vertical" defaultValue="general" items={reviewTabs} />
        </div>
      </div>
      <div className="docs-demo">
        <div className="docs-demo-title">Long tab labels</div>
        <div className="docs-demo-canvas">
          <Tabs
            defaultValue="general"
            items={[
              {
                value: "general",
                label: "General preferences and application behavior",
                content: "Settings stay inside their panel.",
              },
              {
                value: "network",
                label: "NetworkConfigurationAndSynchronization",
                content: "Network settings.",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export function MeterRenderingExamples() {
  return (
    <div className="docs-grid-2 docs-component-grid" data-rendering-review="meters">
      <div className="docs-demo">
        <div className="docs-demo-title">Partial capacity</div>
        <div className="docs-demo-canvas docs-stack docs-control-fill">
          <small>Set max to the total capacity; the unfilled track shows the remainder.</small>
          <span>Storage allocation · 50 of 100 GB</span>
          <SegmentedMeter
            label="Storage allocation"
            max={100}
            segments={[
              { label: "System", value: 20 },
              { label: "Documents", value: 30, color: "var(--greyui-success)" },
            ]}
          />
          <Meter.Root value={50}>
            <Meter.Label>Total used</Meter.Label>
            <Meter.Value />
            <Meter.Track>
              <Meter.Indicator />
            </Meter.Track>
          </Meter.Root>
          <span>Empty capacity</span>
          <SegmentedMeter
            label="Empty capacity"
            max={100}
            segments={[
              { label: "System", value: 0 },
              { label: "Documents", value: 0 },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export function ToolbarRenderingExamples() {
  return (
    <div className="docs-grid-2 docs-component-grid" data-rendering-review="toolbars">
      <div className="docs-demo">
        <div className="docs-demo-title">Narrow toolbar</div>
        <div className="docs-demo-canvas docs-stack docs-control-fill" style={{ maxWidth: 240 }}>
          <small>Grouped controls wrap within the toolbar when space is limited.</small>
          <Toolbar.Root aria-label="Compact document toolbar">
            <Toolbar.Group>
              <Toolbar.Button>Open document…</Toolbar.Button>
              <Toolbar.Input aria-label="Search documents" placeholder="Search documents…" />
            </Toolbar.Group>
          </Toolbar.Root>
        </div>
      </div>

      <div className="docs-demo">
        <div className="docs-demo-title">Vertical toolbar</div>
        <div className="docs-demo-canvas">
          <Toolbar.Root orientation="vertical" aria-label="Vertical document toolbar">
            <Toolbar.Group>
              <Toolbar.Button>New</Toolbar.Button>
              <Toolbar.Button>Save</Toolbar.Button>
              <Toolbar.Button disabled>Print</Toolbar.Button>
            </Toolbar.Group>
          </Toolbar.Root>
        </div>
      </div>
    </div>
  );
}
