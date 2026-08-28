import type { ComponentProps, ReactNode } from "react";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { useFieldsetDisabled } from "../fieldset-context";

type RootProps = Omit<ComponentProps<typeof CheckboxPrimitive.Root>, "className" | "children"> & {
  className?: string;
  children?: ReactNode;
};

export interface CheckboxProps extends RootProps {
  label?: ReactNode;
}

export function Checkbox({ className = "", disabled, label, children, ...props }: CheckboxProps) {
  const fieldsetDisabled = useFieldsetDisabled();
  const resolvedDisabled = fieldsetDisabled || disabled === true;

  const control = (
    <CheckboxPrimitive.Root
      data-greyui-component="checkbox"
      className={`greyui-checkbox ${className}`.trim()}
      disabled={resolvedDisabled}
      {...props}
    >
      <CheckboxPrimitive.Indicator aria-hidden="true" className="greyui-checkbox-indicator">
        ✓
      </CheckboxPrimitive.Indicator>
      {children}
    </CheckboxPrimitive.Root>
  );

  if (label === undefined) return control;
  return (
    <label className="greyui-control-label" data-disabled={resolvedDisabled ? "" : undefined}>
      {control}
      <span>{label}</span>
    </label>
  );
}
