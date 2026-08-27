import type { ComponentProps } from "react";
import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { useLayerContainer } from "./layer";

export const ContextMenuRoot = ContextMenuPrimitive.Root;
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

type WithClassName<T> = Omit<T, "className"> & { className?: string };

export function ContextMenuItem({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ContextMenuPrimitive.Item>>) {
  return (
    <ContextMenuPrimitive.Item className={`greyui-menu-item ${className}`.trim()} {...props} />
  );
}

export function ContextMenuSeparator({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ContextMenuPrimitive.Separator>>) {
  return (
    <ContextMenuPrimitive.Separator
      className={`greyui-menu-separator ${className}`.trim()}
      {...props}
    />
  );
}

export function ContextMenuPopup({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ContextMenuPrimitive.Popup>>) {
  const container = useLayerContainer("menu");
  return (
    <ContextMenuPrimitive.Portal container={container}>
      <ContextMenuPrimitive.Positioner className="greyui-context-menu-positioner">
        <ContextMenuPrimitive.Popup
          className={`greyui-menu-popup greyui-context-menu-popup ${className}`.trim()}
          {...props}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
}

export const ContextMenu = {
  Root: ContextMenuRoot,
  Trigger: ContextMenuTrigger,
  Popup: ContextMenuPopup,
  Item: ContextMenuItem,
  Separator: ContextMenuSeparator,
};
