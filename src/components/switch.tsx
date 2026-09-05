import type { ComponentProps, ReactNode } from "react";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { useFieldsetDisabled } from "../fieldset-context";

type RootProps = Omit<ComponentProps<typeof SwitchPrimitive.Root>, "className"> & {
  className?: string;
};

export interface SwitchProps extends RootProps {
  label?: ReactNode;
}

export function Switch({ className = "", disabled = false, label, ...props }: SwitchProps) {
  const fieldsetDisabled = useFieldsetDisabled();
  const resolvedDisabled = fieldsetDisabled || disabled;
  const control = (
    <SwitchPrimitive.Root
      data-greyui-component="switch"
      className={`greyui-switch ${className}`.trim()}
      disabled={resolvedDisabled}
      {...props}
    >
      <SwitchPrimitive.Thumb className="greyui-switch-thumb" />
    </SwitchPrimitive.Root>
  );

  if (label === undefined) return control;
  return (
    <label className="greyui-control-label" data-disabled={resolvedDisabled ? "" : undefined}>
      {control}
      <span>{label}</span>
    </label>
  );
}
