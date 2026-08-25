import type { ComponentProps } from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";

export const MenuRoot = MenuPrimitive.Root;

type TriggerProps = Omit<ComponentProps<typeof MenuPrimitive.Trigger>, "className"> & { className?: string };
export function MenuTrigger({ className = "", ...props }: TriggerProps) {
  return <MenuPrimitive.Trigger className={`greyui-menu-trigger ${className}`.trim()} {...props} />;
}

type ItemProps = Omit<ComponentProps<typeof MenuPrimitive.Item>, "className"> & { className?: string };
export function MenuItem({ className = "", ...props }: ItemProps) {
  return <MenuPrimitive.Item className={`greyui-menu-item ${className}`.trim()} {...props} />;
}

export function MenuSeparator(props: Omit<ComponentProps<typeof MenuPrimitive.Separator>, "className">) {
  return <MenuPrimitive.Separator className="greyui-menu-separator" {...props} />;
}

export function MenuPopup({ className = "", ...props }: Omit<ComponentProps<typeof MenuPrimitive.Popup>, "className"> & { className?: string }) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner className="greyui-menu-positioner" sideOffset={1} align="start">
        <MenuPrimitive.Popup className={`greyui-menu-popup ${className}`.trim()} {...props} />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Popup: MenuPopup,
  Item: MenuItem,
  Separator: MenuSeparator,
};
