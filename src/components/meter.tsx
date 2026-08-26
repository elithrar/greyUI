import type { ComponentProps } from "react";
import { Meter as MeterPrimitive } from "@base-ui/react/meter";

type WithClassName<T> = Omit<T, "className"> & { className?: string };

export function MeterRoot({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof MeterPrimitive.Root>>) {
  return (
    <MeterPrimitive.Root
      data-greyui-component="meter"
      className={`greyui-meter ${className}`.trim()}
      {...props}
    />
  );
}

export function MeterLabel({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof MeterPrimitive.Label>>) {
  return <MeterPrimitive.Label className={`greyui-meter-label ${className}`.trim()} {...props} />;
}

export function MeterValue({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof MeterPrimitive.Value>>) {
  return <MeterPrimitive.Value className={`greyui-meter-value ${className}`.trim()} {...props} />;
}

export function MeterTrack({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof MeterPrimitive.Track>>) {
  return <MeterPrimitive.Track className={`greyui-meter-track ${className}`.trim()} {...props} />;
}

export function MeterIndicator({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof MeterPrimitive.Indicator>>) {
  return (
    <MeterPrimitive.Indicator
      className={`greyui-meter-indicator ${className}`.trim()}
      {...props}
    />
  );
}

export const Meter = {
  Root: MeterRoot,
  Label: MeterLabel,
  Value: MeterValue,
  Track: MeterTrack,
  Indicator: MeterIndicator,
};
