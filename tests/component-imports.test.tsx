import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  COMPONENT_IMPORTS,
  ComponentImport,
  granularImport,
  groupedGranularImport,
  groupedGranularImports,
} from "../docs/src/component-imports";

afterEach(cleanup);

describe("component import documentation", () => {
  it("retains a granular import path for every public component module", () => {
    const componentsDirectory = resolve(process.cwd(), "src/components");
    const sourceModules = readdirSync(componentsDirectory)
      .filter((name) => name.endsWith(".ts") || name.endsWith(".tsx"))
      .map((name) => name.replace(/\.tsx?$/, ""))
      .sort();
    const documentedModules = [...new Set(COMPONENT_IMPORTS.map((spec) => spec.path))].sort();

    expect(documentedModules).toEqual(sourceModules);
  });

  it("groups exports that share a granular endpoint", () => {
    expect(
      groupedGranularImport([
        "Button",
        "ButtonGroup",
        "IconButton",
        "SegmentedControl",
        "ToggleButton",
      ]),
    ).toBe(
      'import { Button, ButtonGroup, IconButton } from "greyui/components/button";\n' +
        'import { SegmentedControl, ToggleButton } from "greyui/components/toggle-button";',
    );
    expect(groupedGranularImports(["Input", "Textarea", "Select"])).toEqual([
      'import { Input, Textarea } from "greyui/components/input";',
      'import { Select } from "greyui/components/select";',
    ]);
    expect(() => groupedGranularImport(["UnknownComponent"])).toThrow(
      "No granular import is documented for UnknownComponent.",
    );
  });

  it("renders and copies the grouped granular imports for a component section", async () => {
    const writeText = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    const imports = ["Button", "ButtonGroup", "IconButton"] as const;
    const statement = granularImport({ name: "Button", path: "button", imports });
    render(<ComponentImport imports={imports} label="Buttons" />);

    expect(screen.getByRole("note", { name: "Buttons imports" })).not.toBeNull();
    expect(screen.getByText(statement)).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Copy Buttons import" }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(statement));
    expect(groupedGranularImport(imports)).toBe(statement);
  });
});
