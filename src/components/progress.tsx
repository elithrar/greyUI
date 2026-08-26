import type { ComponentProps } from "react";
import { Progress as ProgressPrimitive } from "@base-ui/react/progress";

type WithClassName<T> = Omit<T, "className"> & { className?: string };

export function ProgressRoot({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ProgressPrimitive.Root>>) {
  return (
    <ProgressPrimitive.Root
      data-greyui-component="progress"
      className={`greyui-progress ${className}`.trim()}
      {...props}
    />
  );
}

export function ProgressLabel({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ProgressPrimitive.Label>>) {
  return (
    <ProgressPrimitive.Label className={`greyui-progress-label ${className}`.trim()} {...props} />
  );
}

export function ProgressValue({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ProgressPrimitive.Value>>) {
  return (
    <ProgressPrimitive.Value className={`greyui-progress-value ${className}`.trim()} {...props} />
  );
}

export function ProgressTrack({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ProgressPrimitive.Track>>) {
  return (
    <ProgressPrimitive.Track className={`greyui-progress-track ${className}`.trim()} {...props} />
  );
}

export function ProgressIndicator({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ProgressPrimitive.Indicator>>) {
  return (
    <ProgressPrimitive.Indicator
      className={`greyui-progress-indicator ${className}`.trim()}
      {...props}
    />
  );
}

export const Progress = {
  Root: ProgressRoot,
  Label: ProgressLabel,
  Value: ProgressValue,
  Track: ProgressTrack,
  Indicator: ProgressIndicator,
};
