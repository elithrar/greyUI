import type { ComponentProps, ReactNode } from "react";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

type RootProps = Omit<ComponentProps<typeof SwitchPrimitive.Root>, "className"> & {
  className?: string;
};

export interface SwitchProps extends RootProps {
  label?: ReactNode;
}

export function Switch({ className = "", disabled = false, label, ...props }: SwitchProps) {
  const control = (
    <SwitchPrimitive.Root
      data-greyui-component="switch"
      className={`greyui-switch ${className}`.trim()}
      disabled={disabled}
      {...props}
    >
      <SwitchPrimitive.Thumb className="greyui-switch-thumb" />
    </SwitchPrimitive.Root>
  );

  if (label === undefined) return control;
  return (
    <label className="greyui-control-label" data-disabled={disabled ? "" : undefined}>
      {control}
      <span>{label}</span>
    </label>
  );
}
