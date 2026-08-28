import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  COMPONENT_IMPORTS,
  ComponentImport,
  granularImport,
  groupedImport,
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

  it("renders and copies one grouped import for a component section", async () => {
    const writeText = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    const imports = ["Button", "ButtonGroup", "IconButton"] as const;
    render(<ComponentImport imports={imports} label="Buttons" />);

    const statement = 'import { Button, ButtonGroup, IconButton } from "greyui";';
    expect(screen.getByText(statement)).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Copy Buttons import" }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(statement));
    expect(groupedImport(imports)).toBe(statement);
    expect(
      granularImport({
        name: "Button",
        path: "button",
        imports: ["Button", "ButtonGroup", "IconButton"],
      }),
    ).toBe('import { Button, ButtonGroup, IconButton } from "greyui/components/button";');
  });
});
