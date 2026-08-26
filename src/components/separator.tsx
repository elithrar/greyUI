import type { ComponentProps } from "react";
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";

export type SeparatorProps = Omit<ComponentProps<typeof SeparatorPrimitive>, "className"> & {
  className?: string;
};

export function Separator({ className = "", ...props }: SeparatorProps) {
  return <SeparatorPrimitive className={`greyui-separator ${className}`.trim()} {...props} />;
}
