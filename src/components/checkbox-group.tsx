import type { ComponentProps } from "react";
import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group";

type PrimitiveProps = Omit<ComponentProps<typeof CheckboxGroupPrimitive>, "className">;

export interface CheckboxGroupProps extends PrimitiveProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function CheckboxGroup({
  className = "",
  orientation = "vertical",
  ...props
}: CheckboxGroupProps) {
  return (
    <CheckboxGroupPrimitive
      data-greyui-component="checkbox-group"
      data-orientation={orientation}
      className={`greyui-checkbox-group ${className}`.trim()}
      {...props}
    />
  );
}
