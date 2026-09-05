import type { ComponentProps } from "react";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";

type WithClassName<T> = Omit<T, "className"> & { className?: string };

export function ToggleGroupRoot<Value extends string>({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ToggleGroupPrimitive<Value>>>) {
  return (
    <ToggleGroupPrimitive<Value>
      data-greyui-component="toggle-group"
      className={`greyui-toggle-group ${className}`.trim()}
      {...props}
    />
  );
}

export function ToggleGroupItem({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof TogglePrimitive>>) {
  return (
    <TogglePrimitive
      className={`greyui-button greyui-toggle-group-item ${className}`.trim()}
      {...props}
    />
  );
}

export const ToggleGroup = {
  Root: ToggleGroupRoot,
  Item: ToggleGroupItem,
};
