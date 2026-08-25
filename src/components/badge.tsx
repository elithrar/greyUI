import type { HTMLAttributes } from "react";

export type BadgeTone = "default" | "accent" | "warning" | "success" | "danger";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ className = "", tone = "default", ...props }: BadgeProps) {
  return (
    <span
      data-greyui-component="badge"
      data-tone={tone}
      className={`greyui-badge ${className}`.trim()}
      {...props}
    />
  );
}
