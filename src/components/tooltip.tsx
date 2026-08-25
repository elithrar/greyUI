import type { ComponentProps, ReactNode } from "react";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";

export const TooltipProvider = TooltipPrimitive.Provider;
export const TooltipRoot = TooltipPrimitive.Root;

type TriggerProps = Omit<ComponentProps<typeof TooltipPrimitive.Trigger>, "className"> & {
  className?: string;
};
export function TooltipTrigger({ className = "", ...props }: TriggerProps) {
  return <TooltipPrimitive.Trigger className={className} {...props} />;
}

export function TooltipPopup({ children }: { children: ReactNode }) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner sideOffset={6}>
        <TooltipPrimitive.Popup className="greyui-tooltip">{children}</TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export const Tooltip = {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Popup: TooltipPopup,
};
