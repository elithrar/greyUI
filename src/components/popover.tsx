import type { ComponentProps, ReactNode } from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";

export const PopoverRoot = PopoverPrimitive.Root;

type TriggerProps = Omit<ComponentProps<typeof PopoverPrimitive.Trigger>, "className"> & {
  className?: string;
};
export function PopoverTrigger({ className = "", ...props }: TriggerProps) {
  return <PopoverPrimitive.Trigger className={`greyui-button ${className}`.trim()} {...props} />;
}

type PopupProps = Omit<ComponentProps<typeof PopoverPrimitive.Popup>, "className" | "children"> & {
  className?: string;
  children?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
};
export function PopoverPopup({
  className = "",
  title,
  description,
  children,
  ...props
}: PopupProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner sideOffset={5} className="greyui-popover-positioner">
        <PopoverPrimitive.Popup className={`greyui-popover ${className}`.trim()} {...props}>
          {title !== undefined ? (
            <PopoverPrimitive.Title className="greyui-popover-title">
              {title}
            </PopoverPrimitive.Title>
          ) : null}
          {description !== undefined ? (
            <PopoverPrimitive.Description className="greyui-popover-description">
              {description}
            </PopoverPrimitive.Description>
          ) : null}
          {children}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Popup: PopoverPopup,
  Close: PopoverPrimitive.Close,
};
