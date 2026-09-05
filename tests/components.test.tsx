import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useState } from "react";
import {
  AlertDialog,
  Autocomplete,
  Banner,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Checkbox,
  Combobox,
  createVirtualAnchor,
  DatePicker,
  Dialog,
  Empty,
  Field,
  Fieldset,
  InputGroup,
  IconButton,
  Layer,
  Loader,
  Menu,
  NumberField,
  Pagination,
  ScrollArea,
  SegmentedMeter,
  Select,
  Tabs,
  Toast,
  Window,
} from "../src";
import * as GreyUI from "../src";

afterEach(cleanup);

describe("window compound API", () => {
  it("scopes window chrome under Window without standalone aliases", () => {
    expect(GreyUI).not.toHaveProperty("MenuBar");
    expect(GreyUI).not.toHaveProperty("StatusBar");
    expect(GreyUI).not.toHaveProperty("StatusBarItem");
    expect(GreyUI).not.toHaveProperty("StatusBarSeparator");
    expect(GreyUI).not.toHaveProperty("StatusLight");
    expect(GreyUI).not.toHaveProperty("WindowWidget");

    expect(Window).toHaveProperty("Widget");
    expect(Window).toHaveProperty("MenuBar");
    expect(Window.StatusBar).toHaveProperty("Item");
    expect(Window.StatusBar).toHaveProperty("Separator");
    expect(Window.StatusBar).toHaveProperty("Light");
  });

  it("routes styled menu composition through its configured layer and positioner", () => {
    render(
      <Layer.Provider>
        <Menu.Root defaultOpen>
          <Menu.Trigger>View</Menu.Trigger>
          <Menu.Popup positionerProps={{ className: "custom-positioner", side: "top" }}>
            <Menu.Group>
              <Menu.GroupLabel>Panels</Menu.GroupLabel>
              <Menu.CheckboxItem defaultChecked>
                <Menu.CheckboxItemIndicator keepMounted />
                Toolbar
              </Menu.CheckboxItem>
            </Menu.Group>
            <Menu.LinkItem href="#window">Window help</Menu.LinkItem>
          </Menu.Popup>
        </Menu.Root>
      </Layer.Provider>,
    );

    const popup = document.querySelector(".greyui-menu-popup");
    expect(popup?.closest("[data-greyui-layer='menu']")).not.toBeNull();
    expect(
      document
        .querySelector(".greyui-menu-positioner.custom-positioner")
        ?.getAttribute("data-side"),
    ).toBe("top");
    expect(screen.getByRole("menuitem", { name: "Window help" }).classList).toContain(
      "greyui-menu-item",
    );
    expect(
      document.querySelector(".greyui-menu-checkbox-indicator")?.getAttribute("aria-hidden"),
    ).toBe("true");
  });
});

describe("native control safety", () => {
  it("applies non-submitting defaults and accessible labels across button wrappers", () => {
    render(
      <form aria-label="Controls">
        <Button variant="primary" defaultAction>
          Apply
        </Button>
        <Window.Widget label="Close" />
        <InputGroup.Root>
          <InputGroup.Input aria-label="Path" />
          <InputGroup.Button>Browse</InputGroup.Button>
        </InputGroup.Root>
        <ButtonGroup aria-label="Map zoom" orientation="vertical">
          <IconButton label="Zoom in">+</IconButton>
        </ButtonGroup>
      </form>,
    );

    const button = screen.getByRole("button", { name: "Apply" });
    expect(button.getAttribute("type")).toBe("button");
    expect(button.getAttribute("data-variant")).toBe("primary");
    expect(button.getAttribute("data-default")).toBe("true");

    const widget = screen.getByRole("button", { name: "Close" });
    expect(widget.getAttribute("type")).toBe("button");
    expect(widget.getAttribute("data-kind")).toBe("close");

    expect(screen.getByRole("button", { name: "Browse" }).getAttribute("type")).toBe("button");
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
  it("provides visible and aria-only labels for Select", () => {
    render(
      <>
        <Select label="Theme" defaultValue="beos" options={[{ value: "beos", label: "BeOS R5" }]} />
        <Select
          aria-label="Workspace"
          defaultValue="desktop"
          options={[{ value: "desktop", label: "Desktop" }]}
        />
      </>,
    );

    expect(screen.getByRole<HTMLInputElement>("combobox", { name: "Theme" })).not.toBeNull();
    expect(screen.getByRole<HTMLInputElement>("combobox", { name: "Workspace" })).not.toBeNull();
  });

  it("renders greyUI Select chrome and forwards popup layout options", () => {
    const { container } = render(
      <Select
        aria-label="Theme"
        defaultOpen
        popupWidth="content"
        options={[{ value: "long", label: "A deliberately long operating system option" }]}
        positionerProps={{ id: "select-positioner", side: "top" }}
      />,
    );

    const icon = container.querySelector(".greyui-select-icon");
    expect(icon?.textContent).toBe("");
    expect(icon?.querySelectorAll(".greyui-select-arrow")).toHaveLength(1);
    const popup = document.querySelector(".greyui-select-popup");
    expect(popup?.getAttribute("data-greyui-popup-width")).toBe("content");
    expect(document.querySelector("#select-positioner")?.getAttribute("data-side")).toBe("top");
    expect(
      screen
        .getByRole("option", { name: /deliberately long/ })
        .querySelector(".greyui-select-item-text"),
    ).not.toBeNull();
  });

  it("applies Autocomplete defaults and popup composition owned by greyUI", () => {
    render(
      <Autocomplete.Root defaultOpen items={["A deliberately long operating system name"]}>
        <Autocomplete.InputGroup>
          <Autocomplete.Input aria-label="Operating system" />
          <Autocomplete.Trigger />
        </Autocomplete.InputGroup>
        <Autocomplete.Popup
          width="content"
          positionerProps={{ id: "auto-positioner", side: "top" }}
        >
          <Autocomplete.List>
            {(item: string) => (
              <Autocomplete.Item key={item} value={item}>
                <Autocomplete.ItemText>{item}</Autocomplete.ItemText>
                <Autocomplete.ItemIndicator />
              </Autocomplete.Item>
            )}
          </Autocomplete.List>
        </Autocomplete.Popup>
      </Autocomplete.Root>,
    );

    const option = screen.getByRole("option", { name: /deliberately long/ });
    expect(option.querySelector(".greyui-autocomplete-item-text")).not.toBeNull();
    expect(option.querySelector(".greyui-autocomplete-item-indicator")).not.toBeNull();
    expect(
      document.querySelector(".greyui-autocomplete-popup")?.getAttribute("data-greyui-popup-width"),
    ).toBe("content");
    expect(document.querySelector("#auto-positioner")?.getAttribute("data-side")).toBe("top");
    expect(document.querySelector(".greyui-autocomplete-trigger")?.getAttribute("aria-label")).toBe(
      "Show suggestions",
    );
  });

  it("supports borderless fieldset semantics without a visible legend", () => {
    render(
      <Fieldset.Root variant="plain" aria-label="Transmission gears">
        <input name="first-gear" />
      </Fieldset.Root>,
    );

    const fieldset = screen.getByRole("group", { name: "Transmission gears" });
    expect(fieldset.getAttribute("data-variant")).toBe("plain");
    expect(fieldset.querySelector("legend")).toBeNull();
  });

  it("propagates disabled Fieldset state to greyUI Checkbox controls", () => {
    render(
      <Fieldset.Root disabled>
        <Fieldset.Legend>Managed settings</Fieldset.Legend>
        <Checkbox value="policy" label="Enforce policy" />
      </Fieldset.Root>,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Enforce policy" });
    expect(checkbox.hasAttribute("data-disabled")).toBe(true);
    fireEvent.click(checkbox);
    expect(checkbox.getAttribute("aria-checked")).toBe("false");
  });

  it("provides a stable action row for labeled controls and adjacent buttons", () => {
    render(
      <Field.ActionRow>
        <Field.Root>
          <Field.Label>Preset</Field.Label>
          <Field.Control />
        </Field.Root>
        <Button>Apply</Button>
      </Field.ActionRow>,
    );

    const row = screen.getByText("Preset").closest('[data-greyui-component="field-action-row"]');
    expect(row?.classList.contains("greyui-field-action-row")).toBe(true);
    expect(row?.getAttribute("data-layout")).toBe("auto");
    expect(row?.querySelector(".greyui-field-action-row-layout")?.children).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Apply" })).not.toBeNull();
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

  it("applies Combobox controls and forwards popup layout options", () => {
    render(
      <Combobox.Root
        defaultOpen
        defaultValue="A deliberately long theme name"
        items={["A deliberately long theme name"]}
      >
        <Combobox.InputGroup>
          <Combobox.Input aria-label="Theme" />
          <Combobox.Clear />
          <Combobox.Trigger />
        </Combobox.InputGroup>
        <Combobox.Popup width="content" positionerProps={{ id: "combo-positioner", side: "top" }}>
          <Combobox.List>
            {(theme: string) => (
              <Combobox.Item key={theme} value={theme}>
                <Combobox.ItemText>{theme}</Combobox.ItemText>
                <Combobox.ItemIndicator />
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Root>,
    );

    const popup = document.querySelector(".greyui-combobox-popup");
    expect(popup?.getAttribute("data-greyui-popup-width")).toBe("content");
    expect(document.querySelector("#combo-positioner")?.getAttribute("data-side")).toBe("top");
    const option = screen.getByRole("option", { name: /deliberately long/ });
    expect(option.querySelector(".greyui-combobox-item-text")).not.toBeNull();
    expect(option.querySelector(".greyui-combobox-item-indicator")).not.toBeNull();
    expect(document.querySelector(".greyui-combobox-trigger")?.getAttribute("aria-label")).toBe(
      "Show options",
    );
    expect(document.querySelector(".greyui-combobox-clear")?.getAttribute("aria-label")).toBe(
      "Clear selection",
    );
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

  it("maps the Tabs shorthand API into styled tabs and panels", () => {
    const { container } = render(
      <Tabs
        defaultValue="general"
        items={[
          { value: "general", label: "General", content: <p>General content</p> },
          {
            value: "advanced",
            label: "Advanced",
            content: <p>Advanced content</p>,
            disabled: true,
          },
        ]}
      />,
    );

    expect(screen.getAllByRole("tab")).toHaveLength(2);
    expect(screen.getByRole("tab", { name: "General" }).classList).toContain("greyui-tab");
    expect(screen.getByRole("tab", { name: "Advanced" }).hasAttribute("data-disabled")).toBe(true);
    expect(container.querySelector(".greyui-tabs")?.getAttribute("data-greyui-component")).toBe(
      "tabs",
    );
    expect(container.querySelector(".greyui-tab-panel")).not.toBeNull();
    expect(screen.getByText("General content")).not.toBeNull();
  });

  it("does not reuse the native HTML title attribute for window chrome", () => {
    const { container } = render(<Window title={<span>Preferences</span>}>Content</Window>);

    expect(screen.getByText("Preferences")).not.toBeNull();
    expect(container.querySelector('[data-greyui-component="window"]')?.hasAttribute("title")).toBe(
      false,
    );
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
    expect(body.closest("section")?.getAttribute("data-chrome")).toBe("floating");
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
    const root = body.closest('[data-greyui-component="window"]');
    const frame = body.closest('[data-greyui-component="window-frame"]');
    expect(frame?.parentElement).toBe(root);
    expect(frame?.querySelector(":scope > .greyui-window-tab")).not.toBeNull();
    expect(frame?.querySelector(":scope > .greyui-window-body")).toBe(body);
    expect(body.getAttribute("id")).toBe("compound-body");
    fireEvent.click(screen.getByRole("button", { name: "Minimize window" }));
    expect(body.hasAttribute("hidden")).toBe(true);
  });

  it("uses the same frame structure for shorthand and inactive windows", () => {
    const { container, rerender } = render(<Window title="Preferences">Content</Window>);

    const activeRoot = container.querySelector('[data-greyui-component="window"]');
    const activeFrame = activeRoot?.querySelector(
      ':scope > [data-greyui-component="window-frame"]',
    );
    expect(activeFrame?.children).toHaveLength(2);
    expect(activeFrame?.querySelector(":scope > .greyui-window-tab")).not.toBeNull();
    expect(activeFrame?.querySelector(":scope > .greyui-window-body")).not.toBeNull();

    rerender(
      <Window title="Preferences" active={false}>
        Content
      </Window>,
    );

    const inactiveRoot = container.querySelector('[data-greyui-component="window"]');
    const inactiveFrame = inactiveRoot?.querySelector(
      ':scope > [data-greyui-component="window-frame"]',
    );
    expect(inactiveRoot?.getAttribute("data-active")).toBe("false");
    expect(inactiveFrame?.children).toHaveLength(2);
  });

  it("provides stable content-rail, header, description, and action slots", () => {
    render(
      <Window title="Gearset">
        <Window.Content density="compact">
          <Window.Header layout="stacked">
            <Window.Description>Configure the transmission.</Window.Description>
            <Window.Actions>
              <Field.ActionRow layout="inline">
                <Button>Copy link</Button>
              </Field.ActionRow>
            </Window.Actions>
          </Window.Header>
        </Window.Content>
      </Window>,
    );

    const content = screen
      .getByText("Configure the transmission.")
      .closest('[data-greyui-component="window-content"]');
    expect(content?.getAttribute("data-density")).toBe("compact");
    expect(content?.querySelector(".greyui-window-header")).not.toBeNull();
    expect(content?.querySelector(".greyui-window-header")?.getAttribute("data-layout")).toBe(
      "stacked",
    );
    expect(content?.querySelector(".greyui-window-header-layout")).not.toBeNull();
    expect(content?.querySelector(".greyui-window-description")).not.toBeNull();
    expect(content?.querySelector(".greyui-window-actions")).not.toBeNull();
    expect(content?.querySelector(".greyui-field-action-row")?.getAttribute("data-layout")).toBe(
      "inline",
    );
    expect(content?.querySelector(".greyui-field-action-row-layout")).not.toBeNull();
  });

  it("maps legacy responsive window modes to the container-aware chrome contract", () => {
    const { rerender } = render(<Window title="Legacy">Content</Window>);
    const root = screen.getByText("Legacy").closest('[data-greyui-component="window"]');

    expect(root?.getAttribute("data-chrome")).toBe("auto");
    expect(root?.getAttribute("data-responsive")).toBe("stacked");

    rerender(
      <Window title="Legacy" responsive="stacked">
        Content
      </Window>,
    );
    expect(root?.getAttribute("data-chrome")).toBe("auto");

    rerender(
      <Window title="Legacy" chrome="stacked" responsive="floating">
        Content
      </Window>,
    );
    expect(root?.getAttribute("data-chrome")).toBe("stacked");
    expect(root?.getAttribute("data-responsive")).toBe("stacked");
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
      <Window.StatusBar>
        <Window.StatusBar.Light state="ready" label="Connected" />
        <Window.StatusBar.Item grow>Ready</Window.StatusBar.Item>
        <Window.StatusBar.Separator />
        <Window.StatusBar.Item>34.0 mi</Window.StatusBar.Item>
      </Window.StatusBar>,
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

  it("uses dedicated chrome for dialogs and alert dialogs", () => {
    const dialogRender = render(
      <Dialog.Root defaultOpen>
        <Dialog.Popup title={<span>Enable edit mode</span>}>Content</Dialog.Popup>
      </Dialog.Root>,
    );

    const dialog = screen.getByRole("dialog", { name: "Enable edit mode" });
    expect(dialog.classList.contains("greyui-window")).toBe(false);
    expect(dialog.querySelector(".greyui-dialog-tabbar")).not.toBeNull();
    expect(dialog.querySelector(".greyui-window-widget")).toBeNull();
    dialogRender.unmount();

    render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Popup title={<span>Discard changes?</span>}>Content</AlertDialog.Popup>
      </AlertDialog.Root>,
    );

    const alertDialog = screen.getByRole("alertdialog", { name: "Discard changes?" });
    expect(alertDialog.classList.contains("greyui-window")).toBe(false);
    expect(alertDialog.querySelector(".greyui-dialog-tabbar")).not.toBeNull();
  });
});
