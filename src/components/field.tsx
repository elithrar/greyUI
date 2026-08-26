import type { ComponentProps } from "react";
import { Field as FieldPrimitive } from "@base-ui/react/field";

type WithClassName<T> = Omit<T, "className"> & { className?: string };

export function FieldRoot({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof FieldPrimitive.Root>>) {
  return (
    <FieldPrimitive.Root
      data-greyui-component="field"
      className={`greyui-field ${className}`.trim()}
      {...props}
    />
  );
}

export function FieldLabel({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof FieldPrimitive.Label>>) {
  return <FieldPrimitive.Label className={`greyui-field-label ${className}`.trim()} {...props} />;
}

export function FieldControl({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof FieldPrimitive.Control>>) {
  return <FieldPrimitive.Control className={`greyui-input ${className}`.trim()} {...props} />;
}

export function FieldDescription({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof FieldPrimitive.Description>>) {
  return (
    <FieldPrimitive.Description
      className={`greyui-field-description ${className}`.trim()}
      {...props}
    />
  );
}

export function FieldError({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof FieldPrimitive.Error>>) {
  return <FieldPrimitive.Error className={`greyui-field-error ${className}`.trim()} {...props} />;
}

export function FieldItem({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof FieldPrimitive.Item>>) {
  return <FieldPrimitive.Item className={`greyui-field-item ${className}`.trim()} {...props} />;
}

export const FieldValidity = FieldPrimitive.Validity;

export const Field = {
  Root: FieldRoot,
  Label: FieldLabel,
  Control: FieldControl,
  Description: FieldDescription,
  Error: FieldError,
  Item: FieldItem,
  Validity: FieldValidity,
};
