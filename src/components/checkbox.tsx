import type { ComponentProps, ReactNode } from "react";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";

type RootProps = Omit<ComponentProps<typeof CheckboxPrimitive.Root>, "className" | "children"> & {
  className?: string;
  children?: ReactNode;
};

export interface CheckboxProps extends RootProps {
  label?: ReactNode;
}

export function Checkbox({
  className = "",
  disabled = false,
  label,
  children,
  ...props
}: CheckboxProps) {
  const control = (
    <CheckboxPrimitive.Root
      data-greyui-component="checkbox"
      className={`greyui-checkbox ${className}`.trim()}
      disabled={disabled}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="greyui-checkbox-indicator">
        ✓
      </CheckboxPrimitive.Indicator>
      {children}
    </CheckboxPrimitive.Root>
  );

  if (label === undefined) return control;
  return (
    <label className="greyui-control-label" data-disabled={disabled ? "" : undefined}>
      {control}
      <span>{label}</span>
    </label>
  );
}
