import type { ComponentProps, ReactNode } from "react";
import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field";

type WithClassName<T> = Omit<T, "className"> & { className?: string };

function NumberFieldStepIcon({ direction }: { direction: "increment" | "decrement" }) {
  return (
    <span aria-hidden="true" className="greyui-number-field-step-icon" data-direction={direction} />
  );
}

export function NumberFieldRoot({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof NumberFieldPrimitive.Root>>) {
  return (
    <NumberFieldPrimitive.Root
      data-greyui-component="number-field"
      className={`greyui-number-field ${className}`.trim()}
      {...props}
    />
  );
}

export function NumberFieldScrubArea({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof NumberFieldPrimitive.ScrubArea>>) {
  return (
    <NumberFieldPrimitive.ScrubArea
      className={`greyui-number-field-scrub-area ${className}`.trim()}
      {...props}
    />
  );
}

export const NumberFieldScrubAreaCursor = NumberFieldPrimitive.ScrubAreaCursor;

export function NumberFieldGroup({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof NumberFieldPrimitive.Group>>) {
  return (
    <NumberFieldPrimitive.Group
      className={`greyui-number-field-group ${className}`.trim()}
      {...props}
    />
  );
}

export function NumberFieldInput({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof NumberFieldPrimitive.Input>>) {
  return (
    <NumberFieldPrimitive.Input
      className={`greyui-number-field-input ${className}`.trim()}
      {...props}
    />
  );
}

type StepButtonProps = WithClassName<ComponentProps<typeof NumberFieldPrimitive.Decrement>> & {
  children?: ReactNode;
};

export function NumberFieldDecrement({
  "aria-label": ariaLabel = "Decrease",
  children,
  className = "",
  ...props
}: StepButtonProps) {
  return (
    <NumberFieldPrimitive.Decrement
      aria-label={ariaLabel}
      className={`greyui-number-field-step greyui-number-field-decrement ${className}`.trim()}
      {...props}
    >
      {children === undefined ? <NumberFieldStepIcon direction="decrement" /> : children}
    </NumberFieldPrimitive.Decrement>
  );
}

export function NumberFieldIncrement({
  "aria-label": ariaLabel = "Increase",
  children,
  className = "",
  ...props
}: StepButtonProps) {
  return (
    <NumberFieldPrimitive.Increment
      aria-label={ariaLabel}
      className={`greyui-number-field-step greyui-number-field-increment ${className}`.trim()}
      {...props}
    >
      {children === undefined ? <NumberFieldStepIcon direction="increment" /> : children}
    </NumberFieldPrimitive.Increment>
  );
}

export const NumberField = {
  Root: NumberFieldRoot,
  ScrubArea: NumberFieldScrubArea,
  ScrubAreaCursor: NumberFieldScrubAreaCursor,
  Group: NumberFieldGroup,
  Decrement: NumberFieldDecrement,
  Input: NumberFieldInput,
  Increment: NumberFieldIncrement,
};
