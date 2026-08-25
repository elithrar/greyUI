import { forwardRef, type HTMLAttributes } from "react";
import { Button, type ButtonProps } from "./button";

export interface ToggleButtonProps extends Omit<ButtonProps, "aria-pressed"> {
  pressed: boolean;
}

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(function ToggleButton(
  { pressed, ...props },
  ref,
) {
  return <Button ref={ref} aria-pressed={pressed} {...props} />;
});

export interface SegmentedControlProps extends HTMLAttributes<HTMLDivElement> {
  "aria-label": string;
}

export function SegmentedControl({ className = "", ...props }: SegmentedControlProps) {
  return (
    <div
      role="group"
      data-greyui-component="segmented-control"
      className={`greyui-segmented-control ${className}`.trim()}
      {...props}
    />
  );
}
