import type { ComponentProps } from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";

type WithClassName<T> = Omit<T, "className"> & { className?: string };

export function SliderRoot({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof SliderPrimitive.Root>>) {
  return (
    <SliderPrimitive.Root
      data-greyui-component="slider"
      className={`greyui-slider ${className}`.trim()}
      {...props}
    />
  );
}

export function SliderLabel({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof SliderPrimitive.Label>>) {
  return <SliderPrimitive.Label className={`greyui-slider-label ${className}`.trim()} {...props} />;
}

export function SliderValue({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof SliderPrimitive.Value>>) {
  return <SliderPrimitive.Value className={`greyui-slider-value ${className}`.trim()} {...props} />;
}

export function SliderControl({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof SliderPrimitive.Control>>) {
  return (
    <SliderPrimitive.Control className={`greyui-slider-control ${className}`.trim()} {...props} />
  );
}

export function SliderTrack({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof SliderPrimitive.Track>>) {
  return <SliderPrimitive.Track className={`greyui-slider-track ${className}`.trim()} {...props} />;
}

export function SliderIndicator({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof SliderPrimitive.Indicator>>) {
  return (
    <SliderPrimitive.Indicator
      className={`greyui-slider-indicator ${className}`.trim()}
      {...props}
    />
  );
}

export function SliderThumb({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof SliderPrimitive.Thumb>>) {
  return <SliderPrimitive.Thumb className={`greyui-slider-thumb ${className}`.trim()} {...props} />;
}

export const Slider = {
  Root: SliderRoot,
  Label: SliderLabel,
  Value: SliderValue,
  Control: SliderControl,
  Track: SliderTrack,
  Indicator: SliderIndicator,
  Thumb: SliderThumb,
};
