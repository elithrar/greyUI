import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useState } from "react";
import {
  AlertDialog,
  Banner,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Collapsible,
  Combobox,
  ContextMenu,
  createVirtualAnchor,
  DatePicker,
  Dialog,
  Empty,
  Field,
  InputGroup,
  IconButton,
  Layer,
  Loader,
  Meter,
  NumberField,
  Pagination,
  Progress,
  ScrollArea,
  SegmentedMeter,
  Select,
  Separator,
  Slider,
  Tabs,
  Toast,
  Toolbar,
  Window,
  WindowWidget,
  StatusBar,
  StatusBarItem,
  StatusBarSeparator,
  StatusLight,
} from "../src";

afterEach(cleanup);

describe("native control safety", () => {
  it("keeps Button non-submitting by default", () => {
    render(
      <form>
        <Button>Apply</Button>
      </form>,
    );

    expect(screen.getByRole("button", { name: "Apply" }).getAttribute("type")).toBe("button");
  });

  it("marks a default action without leaking styling internals into call sites", () => {
    render(<Button defaultAction>Apply</Button>);

    expect(screen.getByRole("button", { name: "Apply" }).getAttribute("data-default")).toBe("true");
  });

  it("keeps WindowWidget non-submitting and labeled", () => {
    render(<WindowWidget label="Close" />);

    const widget = screen.getByRole("button", { name: "Close" });
    expect(widget.getAttribute("type")).toBe("button");
    expect(widget.getAttribute("aria-label")).toBe("Close");
    expect(widget.getAttribute("data-kind")).toBe("close");
  });

  it("keeps InputGroup action buttons non-submitting", () => {
    render(
      <form>
        <InputGroup.Root>
          <InputGroup.Input aria-label="Path" />
          <InputGroup.Button>Browse</InputGroup.Button>
        </InputGroup.Root>
      </form>,
    );

    expect(screen.getByRole("button", { name: "Browse" }).getAttribute("type")).toBe("button");
  });

  it("labels compact icon buttons and groups them by orientation", () => {
    render(
      <ButtonGroup aria-label="Map zoom" orientation="vertical">
        <IconButton label="Zoom in">+</IconButton>
        <IconButton label="Zoom out">−</IconButton>
      </ButtonGroup>,
    );

    expect(screen.getByRole("group", { name: "Map zoom" }).getAttribute("data-orientation")).toBe(
      "vertical",
    );
    expect(screen.getByRole("button", { name: "Zoom in" }).getAttribute("type")).toBe("button");
  });

  it("keeps ScrollArea behavior props and supports a stable scrollbar gutter", () => {
    render(<ScrollArea stableGutter>Rows</ScrollArea>);

    const region = screen.getByText("Rows").closest('[data-greyui-component="scroll-area"]');
    if (region === null) {
      throw new Error("Expected ScrollArea root");
    }
    expect(region.getAttribute("data-greyui-component")).toBe("scroll-area");
    expect(region.getAttribute("data-stable-gutter")).toBe("true");
    expect(region.querySelector(".greyui-scroll-viewport")).not.toBeNull();
    expect(region.querySelector(".greyui-scrollbar")).toBeNull();
  });
});

describe("accessibility contracts", () => {
  it("associates Select's visible label with its combobox", () => {
    render(
      <Select
        label="Theme"
        defaultValue="beos"
        options={[
          { value: "beos", label: "BeOS R5" },
          { value: "haiku", label: "Haiku" },
        ]}
      />,
    );

    expect(screen.getByRole("combobox", { name: "Theme" })).not.toBeNull();
  });

  it("supports an aria-only Select label", () => {
    render(
      <Select
        aria-label="Theme"
        defaultValue="beos"
        options={[{ value: "beos", label: "BeOS R5" }]}
      />,
    );

    expect(screen.getByRole("combobox", { name: "Theme" })).not.toBeNull();
  });

  it("renders one explicit Select arrow without Base UI fallback text", () => {
    const { container } = render(
      <Select
        aria-label="Theme"
        defaultValue="beos"
        options={[{ value: "beos", label: "BeOS R5" }]}
      />,
    );

    const icon = container.querySelector(".greyui-select-icon");
    expect(icon?.textContent).toBe("");
    expect(icon?.querySelectorAll(".greyui-select-arrow")).toHaveLength(1);
  });

  it("associates Field labels with Field controls", () => {
    render(
      <Field.Root>
        <Field.Label>Filename</Field.Label>
        <Field.Control />
        <Field.Description>Output filename</Field.Description>
      </Field.Root>,
    );

    expect(screen.getByRole("textbox", { name: "Filename" })).not.toBeNull();
    expect(screen.getByText("Output filename")).not.toBeNull();
  });

  it("keeps NumberField editable and steps values", () => {
    render(
      <NumberField.Root defaultValue={10}>
        <NumberField.Group>
          <NumberField.Input aria-label="Count" />
          <NumberField.Increment />
          <NumberField.Decrement />
        </NumberField.Group>
      </NumberField.Root>,
    );

    const input = screen.getByRole("textbox", { name: "Count" });
    expect(input.getAttribute("aria-roledescription")).toBe("Number field");
    expect((input as HTMLInputElement).value).toBe("10");
    fireEvent.click(screen.getByRole("button", { name: "Increase" }));
    expect((input as HTMLInputElement).value).toBe("11");
  });

  it("renders matched NumberField step icons without font glyphs", () => {
    const { container } = render(
      <NumberField.Root defaultValue={10}>
        <NumberField.Group>
          <NumberField.Input aria-label="Count" />
          <NumberField.Increment />
          <NumberField.Decrement />
        </NumberField.Group>
      </NumberField.Root>,
    );

    const incrementIcon = screen
      .getByRole("button", { name: "Increase" })
      .querySelector(".greyui-number-field-step-icon");
    const decrementIcon = screen
      .getByRole("button", { name: "Decrease" })
      .querySelector(".greyui-number-field-step-icon");

    expect(incrementIcon?.textContent).toBe("");
    expect(decrementIcon?.textContent).toBe("");
    expect(incrementIcon?.getAttribute("data-direction")).toBe("increment");
    expect(decrementIcon?.getAttribute("data-direction")).toBe("decrement");
    expect(container.querySelectorAll(".greyui-number-field-step-icon")).toHaveLength(2);
  });

  it("labels Slider thumbs through Slider.Label", () => {
    render(
      <Slider.Root defaultValue={50}>
        <Slider.Label>Volume</Slider.Label>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
          </Slider.Track>
          <Slider.Thumb />
        </Slider.Control>
      </Slider.Root>,
    );

    expect(screen.getByRole("slider", { name: "Volume" }).getAttribute("aria-valuenow")).toBe("50");
  });

  it("exposes progress and meter semantics", () => {
    render(
      <>
        <Progress.Root value={64}>
          <Progress.Label>Write progress</Progress.Label>
          <Progress.Track>
            <Progress.Indicator />
          </Progress.Track>
        </Progress.Root>
        <Meter.Root value={72}>
          <Meter.Label>Storage</Meter.Label>
          <Meter.Track>
            <Meter.Indicator />
          </Meter.Track>
        </Meter.Root>
      </>,
    );

    expect(
      screen.getByRole("progressbar", { name: "Write progress" }).getAttribute("aria-valuenow"),
    ).toBe("64");
    expect(screen.getByRole("meter", { name: "Storage" }).getAttribute("aria-valuenow")).toBe("72");
  });

  it("exposes segmented meter totals and segment detail", () => {
    render(
      <SegmentedMeter
        label="Trail surface"
        max={20}
        segments={[
          { label: "Paved", value: 12 },
          { label: "Gravel", value: 6 },
        ]}
      />,
    );

    const meter = screen.getByRole("meter", { name: "Trail surface" });
    expect(meter.getAttribute("aria-valuenow")).toBe("18");
    expect(meter.getAttribute("aria-valuemax")).toBe("20");
    expect(meter.getAttribute("aria-valuetext")).toBe("Paved 12, Gravel 6");
  });

  it("marks separators semantically", () => {
    render(<Separator orientation="vertical" />);

    expect(screen.getByRole("separator").getAttribute("data-orientation")).toBe("vertical");
  });

  it("keeps Toolbar as one keyboard-navigation group", () => {
    render(
      <Toolbar.Root aria-label="Document toolbar">
        <Toolbar.Button>New</Toolbar.Button>
        <Toolbar.Button>Open</Toolbar.Button>
      </Toolbar.Root>,
    );

    expect(screen.getByRole("toolbar", { name: "Document toolbar" })).not.toBeNull();
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("opens ContextMenu from a context-menu interaction", () => {
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger>Tracker row</ContextMenu.Trigger>
        <ContextMenu.Popup>
          <ContextMenu.Item>Open</ContextMenu.Item>
          <ContextMenu.Item>Rename</ContextMenu.Item>
        </ContextMenu.Popup>
      </ContextMenu.Root>,
    );

    fireEvent.contextMenu(screen.getByText("Tracker row"));
    expect(screen.getByRole("menuitem", { name: "Open" })).not.toBeNull();
    expect(screen.getByRole("menuitem", { name: "Rename" })).not.toBeNull();
  });

  it("filters and selects Combobox items", () => {
    render(
      <Combobox.Root items={["BeOS R5", "Haiku"]}>
        <Combobox.InputGroup>
          <Combobox.Input aria-label="Theme" />
          <Combobox.Clear />
          <Combobox.Trigger />
        </Combobox.InputGroup>
        <Combobox.Popup>
          <Combobox.List>
            {(theme: string) => (
              <Combobox.Item key={theme} value={theme}>
                {theme}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Root>,
    );

    const input = screen.getByRole("combobox", { name: "Theme" });
    fireEvent.click(screen.getByRole("button", { name: "Show options" }));
    fireEvent.change(input, { target: { value: "Hai" } });

    expect(screen.queryByRole("option", { name: "BeOS R5" })).toBeNull();
    fireEvent.click(screen.getByRole("option", { name: "Haiku" }));
    expect((input as HTMLInputElement).value).toBe("Haiku");

    fireEvent.click(screen.getByRole("button", { name: "Clear selection" }));
    expect((input as HTMLInputElement).value).toBe("");
  });

  it("toggles Collapsible panels through the Base UI trigger", () => {
    render(
      <Collapsible.Root>
        <Collapsible.Trigger>Advanced</Collapsible.Trigger>
        <Collapsible.Panel>Advanced options</Collapsible.Panel>
      </Collapsible.Root>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Advanced" }));
    expect(screen.getByText("Advanced options")).not.toBeNull();
  });

  it("creates toast notifications through the shared manager", () => {
    function CreateToast() {
      const toastManager = Toast.useToastManager();
      return (
        <button
          type="button"
          onClick={() => toastManager.add({ title: "Saved", description: "ROM saved" })}
        >
          Notify
        </button>
      );
    }

    render(
      <Toast.Provider>
        <CreateToast />
        <Toast.Toaster />
      </Toast.Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Notify" }));
    expect(screen.getByText("Saved")).not.toBeNull();
    expect(screen.getByText("ROM saved")).not.toBeNull();
  });

  it("switches tab panels without custom keyboard code", () => {
    render(
      <Tabs
        defaultValue="general"
        items={[
          { value: "general", label: "General", content: <p>General content</p> },
          { value: "advanced", label: "Advanced", content: <p>Advanced content</p> },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole("tab", { name: "Advanced" }));
    expect(screen.getByText("Advanced content")).not.toBeNull();
  });

  it("does not reuse the native HTML title attribute for window chrome", () => {
    render(<Window title={<span>Preferences</span>}>Content</Window>);

    expect(screen.getByText("Preferences")).not.toBeNull();
  });

  it("manages optional collapse state and keeps the body addressable", () => {
    render(
      <Window
        as="section"
        title="Route"
        collapsible
        responsive="floating"
        bodyProps={{ id: "route-body", "aria-label": "Route details" }}
      >
        Trail details
      </Window>,
    );

    const body = screen.getByLabelText("Route details");
    const toggle = screen.getByRole("button", { name: "Minimize window" });
    expect(body.closest("section")?.getAttribute("data-responsive")).toBe("floating");
    expect(toggle.getAttribute("aria-controls")).toBe("route-body");
    fireEvent.click(toggle);
    expect(body.hasAttribute("hidden")).toBe(true);
    expect(screen.getByRole("button", { name: "Restore window" })).not.toBeNull();
  });

  it("composes Window parts against the same collapse state", () => {
    render(
      <Window.Root bodyId="compound-body">
        <Window.TitleBar>
          <Window.Title>Tracker</Window.Title>
          <Window.Controls>
            <Window.Collapse />
          </Window.Controls>
        </Window.TitleBar>
        <Window.Body aria-label="Tracker body">Files</Window.Body>
      </Window.Root>,
    );

    const body = screen.getByLabelText("Tracker body");
    expect(body.getAttribute("id")).toBe("compound-body");
    fireEvent.click(screen.getByRole("button", { name: "Minimize window" }));
    expect(body.hasAttribute("hidden")).toBe(true);
  });

  it("does not allow body props to expose a collapsed Window body", () => {
    const { container } = render(
      <Window.Root defaultCollapsed>
        <Window.Body hidden={false} aria-label="Collapsed body">
          Hidden files
        </Window.Body>
      </Window.Root>,
    );

    expect(container.querySelector('[aria-label="Collapsed body"]')?.hasAttribute("hidden")).toBe(
      true,
    );
  });

  it("routes custom overlays through ordered Layer hosts", () => {
    render(
      <Layer.Provider>
        <Layer.Portal layer="overlay">
          <button type="button">Map POI</button>
        </Layer.Portal>
      </Layer.Provider>,
    );

    const hosts = Array.from(document.querySelectorAll("[data-greyui-layer]")).map((node) =>
      node.getAttribute("data-greyui-layer"),
    );
    expect(hosts).toEqual(["menu", "popover", "overlay", "dialog", "toast", "tooltip"]);
    expect(
      screen
        .getByRole("button", { name: "Map POI" })
        .closest("[data-greyui-layer]")
        ?.getAttribute("data-greyui-layer"),
    ).toBe("overlay");
  });

  it("renders structured Banner content and actions", () => {
    render(
      <Banner
        variant="alert"
        title="Unsaved changes"
        description="Review before closing."
        action={<Banner.Action>Review</Banner.Action>}
      />,
    );

    expect(
      screen.getByText("Unsaved changes").closest("[data-variant]")?.getAttribute("data-variant"),
    ).toBe("alert");
    expect(
      screen.getByText("Unsaved changes").closest("[data-has-icon]")?.getAttribute("data-has-icon"),
    ).toBe("false");
    expect(screen.getByRole("button", { name: "Review" }).getAttribute("type")).toBe("button");
  });

  it("uses navigation semantics for Breadcrumbs", () => {
    render(
      <Breadcrumbs>
        <Breadcrumbs.Link href="/boot">boot</Breadcrumbs.Link>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Current>home</Breadcrumbs.Current>
      </Breadcrumbs>,
    );

    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).not.toBeNull();
    expect(screen.getByText("home").getAttribute("aria-current")).toBe("page");
  });

  it("exposes useful Empty and Loader semantics", () => {
    render(
      <>
        <Empty title="No ROM loaded" commandLine="open chip.bin" />
        <Loader label="Loading ROM" size="sm" />
      </>,
    );

    expect(screen.getByRole("heading", { name: "No ROM loaded" })).not.toBeNull();
    expect(screen.getByText("$ open chip.bin")).not.toBeNull();
    expect(screen.getByRole("status", { name: "Loading ROM" }).getAttribute("data-size")).toBe(
      "sm",
    );
  });

  it("clamps Pagination navigation and supports compound controls", () => {
    function PaginationExample() {
      const [page, setPage] = useState(2);
      return (
        <Pagination page={page} setPage={setPage} perPage={10} totalCount={25}>
          <Pagination.Info />
          <Pagination.Separator />
          <Pagination.Controls />
        </Pagination>
      );
    }

    render(<PaginationExample />);
    expect(screen.getByText("Showing 11–20 of 25")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByText("Showing 21–25 of 25")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Next page" }).hasAttribute("disabled")).toBe(true);
  });

  it("keeps input pagination bounded for very large result sets", () => {
    render(
      <Pagination page={1} setPage={() => undefined} perPage={1} totalCount={1_000_000_000} />,
    );

    expect(screen.getByRole("spinbutton", { name: "Page number" })).not.toBeNull();
    expect(document.querySelectorAll("option")).toHaveLength(0);
  });

  it("provides structured status bar primitives", () => {
    render(
      <StatusBar>
        <StatusLight state="ready" label="Connected" />
        <StatusBarItem grow>Ready</StatusBarItem>
        <StatusBarSeparator />
        <StatusBarItem>34.0 mi</StatusBarItem>
      </StatusBar>,
    );

    expect(screen.getByLabelText("Connected").getAttribute("data-state")).toBe("ready");
    expect(screen.getByRole("separator").getAttribute("aria-orientation")).toBe("vertical");
    expect(screen.getByText("Ready").getAttribute("data-grow")).toBe("true");
  });

  it("builds a stable virtual anchor rectangle for positioned overlays", () => {
    const anchor = createVirtualAnchor({ x: 80, y: 120, width: 12, height: 16 });
    const rect = anchor.getBoundingClientRect();

    expect(rect.left).toBe(80);
    expect(rect.bottom).toBe(136);
    expect(rect.width).toBe(12);
  });

  it("selects an in-range date from the compact calendar", () => {
    render(
      <DatePicker
        label="Ride date"
        locale="en-US"
        defaultValue="2026-09-05"
        min="2026-09-01"
        max="2026-09-16"
        name="ride-date"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Ride date/ }));
    expect(screen.getAllByRole("row")).toHaveLength(7);
    const nextDate = screen.getByRole("gridcell", { name: "Sep 6, 2026" });
    fireEvent.click(nextDate);

    expect(document.querySelector('input[name="ride-date"]')?.getAttribute("value")).toBe(
      "2026-09-06",
    );
  });

  it("preserves the day when paging between calendar months", () => {
    render(
      <DatePicker
        label="Billing date"
        locale="en-US"
        defaultValue="2026-01-31"
        min="2026-01-01"
        max="2026-03-31"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Billing date/ }));
    fireEvent.keyDown(screen.getByRole("gridcell", { name: "Jan 31, 2026" }), {
      key: "PageDown",
    });

    expect(screen.getByRole("gridcell", { name: "Feb 28, 2026" }).getAttribute("tabindex")).toBe(
      "0",
    );
  });

  it("uses dedicated dialog chrome instead of a window tab and widget", () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Popup title="Enable edit mode">Content</Dialog.Popup>
      </Dialog.Root>,
    );

    const dialog = screen.getByRole("dialog", { name: "Enable edit mode" });
    expect(dialog.classList.contains("greyui-window")).toBe(false);
    expect(dialog.querySelector(".greyui-dialog-tabbar")).not.toBeNull();
    expect(dialog.querySelector(".greyui-window-widget")).toBeNull();
  });

  it("uses the same dedicated chrome for alert dialogs", () => {
    render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Popup title="Discard changes?">Content</AlertDialog.Popup>
      </AlertDialog.Root>,
    );

    const dialog = screen.getByRole("alertdialog", { name: "Discard changes?" });
    expect(dialog.classList.contains("greyui-window")).toBe(false);
    expect(dialog.querySelector(".greyui-dialog-tabbar")).not.toBeNull();
  });
});
