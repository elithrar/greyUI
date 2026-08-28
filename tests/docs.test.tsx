import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CopyCommand } from "../docs/src/CopyCommand";
import { GREYUI_VERSION } from "../docs/src/version";

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
