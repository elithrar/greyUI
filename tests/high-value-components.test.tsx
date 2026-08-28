import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Accordion, Autocomplete, Checkbox, CheckboxGroup, Fieldset, ToggleGroup } from "../src";

afterEach(cleanup);

describe("high-value component behavior", () => {
  it("shares pressed state through ToggleGroup", () => {
    render(
      <ToggleGroup.Root aria-label="Editor options" defaultValue={["grid"]}>
        <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
        <ToggleGroup.Item value="snap">Snap</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );

    const grid = screen.getByRole("button", { name: "Grid" });
    const snap = screen.getByRole("button", { name: "Snap" });
    expect(grid.getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(snap);
    expect(snap.getAttribute("aria-pressed")).toBe("true");
  });

  it("keeps Autocomplete input free-form while filtering suggestions", () => {
    render(
      <Autocomplete.Root items={["BeOS R5", "Haiku"]}>
        <Autocomplete.InputGroup>
          <Autocomplete.Input aria-label="Operating system" />
          <Autocomplete.Clear />
          <Autocomplete.Trigger />
        </Autocomplete.InputGroup>
        <Autocomplete.Popup>
          <Autocomplete.List>
            {(item: string) => (
              <Autocomplete.Item key={item} value={item}>
                {item}
              </Autocomplete.Item>
            )}
          </Autocomplete.List>
        </Autocomplete.Popup>
      </Autocomplete.Root>,
    );

    const input = screen.getByRole("combobox", { name: "Operating system" });
    fireEvent.focus(input);
    fireEvent.input(input, { target: { value: "Hai" }, inputType: "insertText" });
    expect(screen.getByRole("option", { name: "Haiku" })).not.toBeNull();
    expect(screen.queryByRole("option", { name: "BeOS R5" })).toBeNull();

    fireEvent.change(input, { target: { value: "Custom OS" } });
    fireEvent.blur(input);
    expect((input as HTMLInputElement).value).toBe("Custom OS");
  });

  it("opens Accordion panels through their trigger", () => {
    render(
      <Accordion.Root>
        <Accordion.Item value="advanced">
          <Accordion.Header>
            <Accordion.Trigger>Advanced</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>Advanced settings</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>,
    );

    const trigger = screen.getByRole("button", { name: "Advanced" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Advanced settings")).not.toBeNull();
  });

  it("groups Checkbox values without polluting accessible names", () => {
    render(
      <CheckboxGroup aria-label="Build output" defaultValue={["symbols"]}>
        <Checkbox value="symbols" label="Debug symbols" />
        <Checkbox value="map" label="Source map" />
      </CheckboxGroup>,
    );

    const symbols = screen.getByRole("checkbox", { name: "Debug symbols" });
    const sourceMap = screen.getByRole("checkbox", { name: "Source map" });
    expect(symbols.getAttribute("aria-checked")).toBe("true");
    fireEvent.click(sourceMap);
    expect(sourceMap.getAttribute("aria-checked")).toBe("true");
  });

  it("propagates disabled Fieldset state to custom Checkbox controls", () => {
    render(
      <Fieldset.Root disabled>
        <Fieldset.Legend>Managed settings</Fieldset.Legend>
        <CheckboxGroup aria-label="Managed settings">
          <Checkbox value="policy" label="Enforce policy" />
        </CheckboxGroup>
      </Fieldset.Root>,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Enforce policy" });
    expect(checkbox.hasAttribute("data-disabled")).toBe(true);
    fireEvent.click(checkbox);
    expect(checkbox.getAttribute("aria-checked")).toBe("false");
  });
});
