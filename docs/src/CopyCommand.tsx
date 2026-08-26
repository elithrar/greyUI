import { useEffect, useState } from "react";

interface CopyCommandProps {
  value: string;
  label: string;
}

export function CopyCommand({ value, label }: CopyCommandProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = window.setTimeout(() => setCopied(false), 1200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copyCommand() {
    let success = false;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(value);
        success = true;
      } else {
        success = copyWithTemporaryField(value);
      }
    } catch {
      success = copyWithTemporaryField(value);
    }

    if (success) {
      setCopied(true);
    }
  }

  return (
    <button
      type="button"
      className="docs-copy-command"
      title={copied ? "Copied" : `Copy ${label}: ${value}`}
      aria-label={`Copy ${label}`}
      data-copied={copied ? "true" : "false"}
      onClick={() => void copyCommand()}
    >
      <code className="docs-copy-command-text">{value}</code>
      <span className="docs-copy-command-icon" aria-hidden="true" />
      <span className="docs-sr-only">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

function copyWithTemporaryField(value: string) {
  if (typeof document.execCommand !== "function") {
    return false;
  }

  const field = document.createElement("textarea");
  field.value = value;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.left = "-9999px";
  document.body.append(field);
  field.select();
  const copied = document.execCommand("copy");
  field.remove();
  return copied;
}
