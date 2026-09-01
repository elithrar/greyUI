import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CopyCommand } from "../docs/src/CopyCommand";
import { GREYUI_VERSION } from "../docs/src/version";
import {
  collectWindowRegressionGeometryFailures,
  WINDOW_REGRESSION_WIDTHS,
  WindowRegressionFixtures,
} from "../docs/src/window-regression-fixtures";
import { Layer } from "../src";

// SAFETY: package.json is repository-owned and npm requires `version` to be a string.
const { version: packageVersion } = JSON.parse(
  readFileSync(resolve(process.cwd(), "package.json"), "utf8"),
) as { version: string };

const clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, "clipboard");
const execCommandDescriptor = Object.getOwnPropertyDescriptor(document, "execCommand");

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  restoreProperty(navigator, "clipboard", clipboardDescriptor);
  restoreProperty(document, "execCommand", execCommandDescriptor);
});

describe("documentation copy command", () => {
  it("copies the full install command and reports success", async () => {
    const writeText = vi.fn<(value: string) => Promise<void>>().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(<CopyCommand value="npm install greyui" label="npm install command" />);
    const button = screen.getByRole("button", { name: "Copy npm install command" });

    fireEvent.click(button);

    await waitFor(() => expect(writeText).toHaveBeenCalledWith("npm install greyui"));
    expect(button.getAttribute("data-copied")).toBe("true");
    expect(button.getAttribute("title")).toBe("Copied");
    expect(screen.getByRole("status").textContent).toBe("Copied npm install command");
  });

  it("does not report success when clipboard copying fails", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: vi.fn<(commandId: string) => boolean>().mockReturnValue(false),
    });

    render(<CopyCommand value="npm install greyui" label="npm install command" />);
    const button = screen.getByRole("button", { name: "Copy npm install command" });

    fireEvent.click(button);

    await waitFor(() => expect(document.execCommand).toHaveBeenCalledWith("copy"));
    expect(button.getAttribute("data-copied")).toBe("false");
  });

  it("cleans up the fallback field when legacy copying throws", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
    const execCommand = vi.fn<(commandId: string) => boolean>().mockImplementation(() => {
      throw new Error("Copy unavailable");
    });
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: execCommand,
    });

    render(<CopyCommand value="npm install greyui" label="npm install command" />);
    const button = screen.getByRole("button", { name: "Copy npm install command" });

    fireEvent.click(button);

    await waitFor(() => expect(execCommand).toHaveBeenCalledTimes(1));
    expect(document.body.querySelector("textarea")).toBeNull();
    expect(button.getAttribute("data-copied")).toBe("false");
  });
});

describe("documentation structure", () => {
  it("keeps imports in one explicit GroupBox guide under Application patterns", () => {
    const main = readFileSync(resolve(process.cwd(), "docs/src/main.tsx"), "utf8");
    const highValue = readFileSync(
      resolve(process.cwd(), "docs/src/high-value-components.tsx"),
      "utf8",
    );
    const nextComponents = readFileSync(
      resolve(process.cwd(), "docs/src/next-components.tsx"),
      "utf8",
    );
    const componentDocs = `${main}\n${highValue}\n${nextComponents}`;
    const denseWindow = readFileSync(
      resolve(process.cwd(), "docs/src/dense-window-example.tsx"),
      "utf8",
    );

    const principlesSection = main.slice(
      main.indexOf('id="principles"'),
      main.indexOf('id="buttons"'),
    );
    const patternsSection = main.slice(
      main.indexOf('id="patterns"'),
      main.indexOf('id="integration"'),
    );

    expect(componentDocs).not.toContain("ComponentImport");
    expect(principlesSection).not.toContain('title="GroupBox component"');
    expect(principlesSection).toContain('title="API conventions"');
    expect(patternsSection).toContain('title="GroupBox component"');
    expect(patternsSection).toContain("<code>Fieldset</code> instead");
    expect(main).toContain('title="Choose the field"');
    expect(main).toContain('title="Composition choices"');
    expect(main).toContain('title="Choose feedback"');
    expect(main).toContain('title="Overlay contract"');
    expect(main).toContain('title="Theme overrides"');
    expect(main).toContain("href={BASE_UI_COMPONENTS_URL}");
    expect(main).toContain('import { Button, GroupBox, Select, Window } from "greyui";');
    expect(main).toContain('label="git clone command"');
    expect(main).toContain('title="Button state model"');
    expect(main).toContain('title="Complete dense application window"');
    expect(main).toContain("The root owns sizing while its frame owns the outer border");
    expect(main).toContain('popupWidth="content"');
    expect(main).toContain("<code>positionerProps</code>");
    expect(nextComponents).toContain("<Combobox.ItemText>{theme}</Combobox.ItemText>");
    expect(highValue).toContain("<Autocomplete.ItemText>{item}</Autocomplete.ItemText>");
    expect(highValue).toContain("<Autocomplete.ItemIndicator />");
    expect(denseWindow).toContain("<Window.Content>");
    expect(denseWindow).toContain(
      '<Fieldset.Root variant="plain" aria-label="Transmission gears">',
    );
    expect(denseWindow).toContain("<Field.ActionRow>");
  });

  it("adapts repeated layouts to their containing section or demo", () => {
    const docsStyles = readFileSync(resolve(process.cwd(), "docs/src/docs.css"), "utf8");

    expect(docsStyles).toMatch(/html\s*\{[\s\S]*?scrollbar-gutter:\s*stable/);
    expect(docsStyles).toContain("container: docs-section / inline-size");
    expect(docsStyles).toContain("container: docs-demo / inline-size");
    expect(docsStyles).toContain("repeat(auto-fit, minmax(min(18rem, 100%), 1fr))");
    expect(docsStyles).toContain("repeat(auto-fit, minmax(min(23rem, 100%), 1fr))");
    expect(docsStyles).toContain("@container docs-demo (max-width: 36rem)");
    expect(docsStyles).toContain("@container docs-section (max-width: 40rem)");
  });
});

describe("window container regression fixtures", () => {
  it("keeps representative widths and frame states in the permanent docs matrix", () => {
    const { container } = render(
      <Layer.Provider>
        <WindowRegressionFixtures />
      </Layer.Provider>,
    );

    const fixtures = Array.from(
      container.querySelectorAll<HTMLElement>("[data-regression-case='window']"),
    );
    expect(fixtures.map((fixture) => Number(fixture.dataset.regressionWidth))).toEqual(
      WINDOW_REGRESSION_WIDTHS,
    );
    expect(WINDOW_REGRESSION_WIDTHS).toEqual(expect.arrayContaining([280, 360, 520, 760]));
    expect(fixtures.map((fixture) => fixture.dataset.regressionState)).toEqual([
      "active",
      "collapsed",
      "active",
      "inactive",
      "active",
      "active",
      "active",
    ]);
    expect(fixtures[0]?.style.getPropertyValue("--docs-regression-width")).toBe("280px");
    expect(fixtures[1]?.querySelector("[data-collapsed='true']")).not.toBeNull();
    expect(fixtures[2]?.querySelector("[data-greyui-component='menu-bar']")).not.toBeNull();
    expect(fixtures[2]?.querySelector("[data-greyui-component='status-bar']")).not.toBeNull();
    expect(fixtures[3]?.querySelector("[data-active='false']")).not.toBeNull();
    expect(fixtures[3]?.querySelector("[data-layout='stacked']")).not.toBeNull();
    expect(fixtures[3]?.querySelector("[data-layout='inline']")).not.toBeNull();
    expect(fixtures[4]?.querySelector("[data-chrome='floating']")).not.toBeNull();
    expect(fixtures[5]?.querySelector("[data-chrome='stacked']")).not.toBeNull();
    expect(fixtures[5]?.querySelector("[data-layout='inline']")).not.toBeNull();
    expect(fixtures[5]?.querySelector("[data-layout='stacked']")).not.toBeNull();
    expect(fixtures[6]?.querySelector("[data-chrome='auto']")).not.toBeNull();
  });

  it("reports frame, document, and viewport overflow through one browser geometry probe", () => {
    const { container } = render(
      <Layer.Provider>
        <WindowRegressionFixtures />
      </Layer.Provider>,
    );
    const suite = container.querySelector<HTMLElement>("[data-regression-suite]");
    if (suite === null) throw new Error("Expected window regression suite");

    const activeFixture = suite.querySelector<HTMLElement>("[data-regression-state='active']");
    if (activeFixture === null) throw new Error("Expected an active fixture");
    const activeFrame = activeFixture.querySelector<HTMLElement>(
      "[data-regression-frame='window']",
    );
    const firstVisibleChild = activeFrame?.querySelector<HTMLElement>(
      "[data-regression-contained]",
    );
    if (activeFrame === null || firstVisibleChild === null || firstVisibleChild === undefined) {
      throw new Error("Expected measurable fixture nodes");
    }

    vi.spyOn(activeFrame, "getBoundingClientRect").mockReturnValue(rect(0, 360));
    vi.spyOn(firstVisibleChild, "getBoundingClientRect").mockReturnValue(rect(0, 362));

    expect(
      collectWindowRegressionGeometryFailures(suite, {
        documentClientWidth: 1280,
        documentScrollWidth: 1281,
        viewportWidth: 1280,
      }),
    ).toEqual(
      expect.arrayContaining([
        "document overflow: scroll width 1281px exceeds 1280px",
        expect.stringContaining("escapes the frame"),
      ]),
    );

    const overlay = document.createElement("div");
    overlay.dataset.regressionOverlay = "";
    vi.spyOn(overlay, "getBoundingClientRect").mockReturnValue(rect(1270, 20));
    document.body.append(overlay);
    expect(
      collectWindowRegressionGeometryFailures(suite, {
        documentClientWidth: 1280,
        documentScrollWidth: 1280,
        viewportWidth: 1280,
      }),
    ).toContain("DIV escapes the viewport");
    overlay.remove();
  });

  it("accepts contained window rows and portaled overlays that only exceed the frame", () => {
    const { container } = render(
      <Layer.Provider>
        <WindowRegressionFixtures />
      </Layer.Provider>,
    );
    const suite = container.querySelector<HTMLElement>("[data-regression-suite]");
    if (suite === null) throw new Error("Expected window regression suite");

    for (const fixture of suite.querySelectorAll<HTMLElement>("[data-regression-case='window']")) {
      const width = Number(fixture.dataset.regressionWidth);
      const frame = fixture.querySelector<HTMLElement>("[data-regression-frame='window']");
      if (frame === null) throw new Error(`Expected a frame for the ${width}px fixture`);
      vi.spyOn(frame, "getBoundingClientRect").mockReturnValue(rect(0, width));
      for (const child of frame.querySelectorAll<HTMLElement>("[data-regression-contained]")) {
        vi.spyOn(child, "getBoundingClientRect").mockReturnValue(rect(0, width));
      }
    }

    const overlay = document.createElement("div");
    overlay.dataset.regressionOverlay = "";
    vi.spyOn(overlay, "getBoundingClientRect").mockReturnValue(rect(300, 200));
    document.body.append(overlay);

    expect(
      collectWindowRegressionGeometryFailures(suite, {
        documentClientWidth: 1280,
        documentScrollWidth: 1280,
        viewportWidth: 1280,
      }),
    ).toEqual([]);
    overlay.remove();
  });
});

describe("documentation version", () => {
  it("uses the package version injected by the build", () => {
    expect(GREYUI_VERSION).toBe(packageVersion);
  });
});

function restoreProperty(
  target: Navigator | Document,
  property: PropertyKey,
  descriptor: PropertyDescriptor | undefined,
) {
  if (descriptor) {
    Object.defineProperty(target, property, descriptor);
  } else {
    Reflect.deleteProperty(target, property);
  }
}

function rect(left: number, width: number): DOMRect {
  return {
    bottom: 100,
    height: 100,
    left,
    right: left + width,
    top: 0,
    width,
    x: left,
    y: 0,
    toJSON: () => ({}),
  };
}
