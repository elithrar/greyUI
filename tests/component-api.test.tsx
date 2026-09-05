import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Empty, Fieldset, Select, Switch, type SelectProps, type SwitchProps } from "../src";

afterEach(cleanup);

describe("component API regressions", () => {
  it("renders Empty children and preserves the explicit contents slot", () => {
    const { rerender } = render(<Empty title="Nothing here">Create a file</Empty>);
    expect(screen.getByText("Create a file").closest(".greyui-empty-contents")).not.toBeNull();
    rerender(
      <Empty title="Nothing here" contents="Open a file">
        Create a file
      </Empty>,
    );
    expect(screen.getByText("Open a file")).not.toBeNull();
    expect(screen.queryByText("Create a file")).toBeNull();
  });

  it("disables Switch interaction and labels inside nested disabled fieldsets", () => {
    const onCheckedChange = vi.fn<NonNullable<SwitchProps["onCheckedChange"]>>();
    const { rerender } = render(
      <Fieldset.Root disabled>
        <Fieldset.Root disabled={false}>
          <Switch label="Autosave" disabled={false} onCheckedChange={onCheckedChange} />
        </Fieldset.Root>
      </Fieldset.Root>,
    );
    const control = screen.getByRole("switch", { name: "Autosave" });
    fireEvent.click(control);
    fireEvent.keyDown(control, { key: " " });
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(control.hasAttribute("data-disabled")).toBe(true);
    expect(control.closest("label")?.hasAttribute("data-disabled")).toBe(true);
    rerender(<Switch label="Autosave" onCheckedChange={onCheckedChange} />);
    fireEvent.click(screen.getByRole("switch", { name: "Autosave" }));
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("returns string arrays for multiple Select and submits each selected value", () => {
    const onValueChange = vi.fn<NonNullable<SelectProps<true>["onValueChange"]>>();
    const { container } = render(
      <form>
        <Select
          aria-label="Themes"
          name="themes"
          multiple
          defaultOpen
          defaultValue={["beos"]}
          onValueChange={onValueChange}
          options={[
            { value: "beos", label: "BeOS" },
            { value: "haiku", label: "Haiku" },
          ]}
        />
      </form>,
    );
    const option = screen.getByRole("option", { name: "Haiku" });
    fireEvent.pointerDown(option, { pointerType: "mouse", button: 0 });
    fireEvent.click(option);
    expect(onValueChange).toHaveBeenCalledWith(["beos", "haiku"], expect.anything());
    const form = container.querySelector("form");
    if (!form) throw new Error("Expected form");
    expect(new FormData(form).getAll("themes")).toEqual(["beos", "haiku"]);
  });
});
