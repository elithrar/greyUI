import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  AlertDialog,
  Button,
  Collapsible,
  Combobox,
  ContextMenu,
  Dialog,
  Field,
  InputGroup,
  Meter,
  NumberField,
  Progress,
  ScrollArea,
  Select,
  Separator,
  Slider,
  Tabs,
  Toast,
  Toolbar,
  Window,
  WindowWidget,
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
