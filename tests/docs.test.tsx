import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CopyCommand } from "../docs/src/CopyCommand";
import {
  collectWindowRegressionGeometryFailures,
  WindowRegressionFixtures,
} from "../docs/src/window-regression-fixtures";
import { Layer } from "../src";

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

  it("cleans up and leaves success unset when fallback copying fails", async () => {
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
    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(document.body.querySelector("textarea")).toBeNull();
    expect(button.getAttribute("data-copied")).toBe("false");
  });
});

describe("window container regression fixtures", () => {
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
