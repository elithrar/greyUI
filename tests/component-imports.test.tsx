import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { COMPONENT_IMPORTS, ComponentImport, granularImport } from "../docs/src/component-imports";

afterEach(cleanup);

describe("component import documentation", () => {
  it("covers every public component module with a granular import", () => {
    const componentsDirectory = resolve(process.cwd(), "src/components");
    const sourceModules = readdirSync(componentsDirectory)
      .filter((name) => name.endsWith(".ts") || name.endsWith(".tsx"))
      .map((name) => name.replace(/\.tsx?$/, ""))
      .sort();
    const documentedModules = [...new Set(COMPONENT_IMPORTS.map((spec) => spec.path))].sort();

    expect(documentedModules).toEqual(sourceModules);
  });

  it("renders and copies the granular import", async () => {
    const writeText = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(<ComponentImport name="Accordion" path="accordion" />);
    const statement = 'import { Accordion } from "greyui/components/accordion";';
    expect(screen.getByText(statement)).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Copy Accordion import" }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(statement));
    expect(granularImport({ name: "Accordion", path: "accordion" })).toBe(statement);
  });
});
