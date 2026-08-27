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
  positionerProps?: Omit<
    ComponentProps<typeof PopoverPrimitive.Positioner>,
    "className" | "children"
  >;
};
export function PopoverPopup({
  className = "",
  title,
  description,
  children,
  positionerProps,
  ...props
}: PopupProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        sideOffset={5}
        {...positionerProps}
        className="greyui-popover-positioner"
      >
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

export interface VirtualAnchorOptions {
  x: number;
  y: number;
  width?: number;
  height?: number;
  contextElement?: Element;
}

export function createVirtualAnchor({
  x,
  y,
  width = 0,
  height = 0,
  contextElement,
}: VirtualAnchorOptions) {
  return {
    contextElement,
    getBoundingClientRect() {
      return {
        x,
        y,
        top: y,
        left: x,
        right: x + width,
        bottom: y + height,
        width,
        height,
        toJSON() {
          return { x, y, top: y, left: x, right: x + width, bottom: y + height, width, height };
        },
      };
    },
  };
}

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Popup: PopoverPopup,
  Close: PopoverPrimitive.Close,
};
