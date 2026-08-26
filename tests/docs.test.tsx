import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CopyCommand } from "../docs/src/CopyCommand";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
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
});
