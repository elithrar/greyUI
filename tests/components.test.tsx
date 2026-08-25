import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  AlertDialog,
  Button,
  Dialog,
  ScrollArea,
  Select,
  Tabs,
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
