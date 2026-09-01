import type { ComponentProps } from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { useLayerContainer } from "./layer";

export const MenuRoot = MenuPrimitive.Root;

type WithStringClassName<T extends { className?: unknown }> = Omit<T, "className"> & {
  className?: string;
};

export type MenuTriggerProps = WithStringClassName<ComponentProps<typeof MenuPrimitive.Trigger>>;
export function MenuTrigger({ className = "", ...props }: MenuTriggerProps) {
  return <MenuPrimitive.Trigger className={`greyui-menu-trigger ${className}`.trim()} {...props} />;
}

export type MenuItemProps = WithStringClassName<ComponentProps<typeof MenuPrimitive.Item>>;
export function MenuItem({ className = "", ...props }: MenuItemProps) {
  return <MenuPrimitive.Item className={`greyui-menu-item ${className}`.trim()} {...props} />;
}

export type MenuLinkItemProps = WithStringClassName<ComponentProps<typeof MenuPrimitive.LinkItem>>;
export function MenuLinkItem({ className = "", ...props }: MenuLinkItemProps) {
  return <MenuPrimitive.LinkItem className={`greyui-menu-item ${className}`.trim()} {...props} />;
}

export type MenuCheckboxItemProps = WithStringClassName<
  ComponentProps<typeof MenuPrimitive.CheckboxItem>
>;
export function MenuCheckboxItem({ className = "", ...props }: MenuCheckboxItemProps) {
  return (
    <MenuPrimitive.CheckboxItem
      className={`greyui-menu-item greyui-menu-choice-item ${className}`.trim()}
      {...props}
    />
  );
}

export type MenuCheckboxItemIndicatorProps = WithStringClassName<
  ComponentProps<typeof MenuPrimitive.CheckboxItemIndicator>
>;
export function MenuCheckboxItemIndicator({
  className = "",
  ...props
}: MenuCheckboxItemIndicatorProps) {
  return (
    <MenuPrimitive.CheckboxItemIndicator
      aria-hidden="true"
      className={`greyui-menu-item-indicator greyui-menu-checkbox-indicator ${className}`.trim()}
      {...props}
    />
  );
}

export type MenuRadioGroupProps = WithStringClassName<
  ComponentProps<typeof MenuPrimitive.RadioGroup>
>;
export function MenuRadioGroup({ className = "", ...props }: MenuRadioGroupProps) {
  return (
    <MenuPrimitive.RadioGroup
      className={`greyui-menu-radio-group ${className}`.trim()}
      {...props}
    />
  );
}

export type MenuRadioItemProps = WithStringClassName<
  ComponentProps<typeof MenuPrimitive.RadioItem>
>;
export function MenuRadioItem({ className = "", ...props }: MenuRadioItemProps) {
  return (
    <MenuPrimitive.RadioItem
      className={`greyui-menu-item greyui-menu-choice-item ${className}`.trim()}
      {...props}
    />
  );
}

export type MenuRadioItemIndicatorProps = WithStringClassName<
  ComponentProps<typeof MenuPrimitive.RadioItemIndicator>
>;
export function MenuRadioItemIndicator({ className = "", ...props }: MenuRadioItemIndicatorProps) {
  return (
    <MenuPrimitive.RadioItemIndicator
      aria-hidden="true"
      className={`greyui-menu-item-indicator greyui-menu-radio-indicator ${className}`.trim()}
      {...props}
    />
  );
}

export type MenuGroupProps = WithStringClassName<ComponentProps<typeof MenuPrimitive.Group>>;
export function MenuGroup({ className = "", ...props }: MenuGroupProps) {
  return <MenuPrimitive.Group className={`greyui-menu-group ${className}`.trim()} {...props} />;
}

export type MenuGroupLabelProps = WithStringClassName<
  ComponentProps<typeof MenuPrimitive.GroupLabel>
>;
export function MenuGroupLabel({ className = "", ...props }: MenuGroupLabelProps) {
  return (
    <MenuPrimitive.GroupLabel
      className={`greyui-menu-group-label ${className}`.trim()}
      {...props}
    />
  );
}

export const MenuSubmenuRoot = MenuPrimitive.SubmenuRoot;

export type MenuSubmenuTriggerProps = WithStringClassName<
  ComponentProps<typeof MenuPrimitive.SubmenuTrigger>
>;
export function MenuSubmenuTrigger({ className = "", ...props }: MenuSubmenuTriggerProps) {
  return (
    <MenuPrimitive.SubmenuTrigger
      className={`greyui-menu-item greyui-menu-submenu-trigger ${className}`.trim()}
      {...props}
    />
  );
}

export type MenuSeparatorProps = WithStringClassName<
  ComponentProps<typeof MenuPrimitive.Separator>
>;
export function MenuSeparator({ className = "", ...props }: MenuSeparatorProps) {
  return (
    <MenuPrimitive.Separator className={`greyui-menu-separator ${className}`.trim()} {...props} />
  );
}

export type MenuPositionerProps = WithStringClassName<
  Omit<ComponentProps<typeof MenuPrimitive.Positioner>, "children">
>;

export type MenuPopupProps = WithStringClassName<ComponentProps<typeof MenuPrimitive.Popup>> & {
  positionerProps?: MenuPositionerProps;
};

const EMPTY_MENU_POSITIONER_PROPS: MenuPositionerProps = {};

export function MenuPopup({
  className = "",
  positionerProps: {
    className: positionerClassName = "",
    ...positionerProps
  } = EMPTY_MENU_POSITIONER_PROPS,
  ...props
}: MenuPopupProps) {
  const container = useLayerContainer("menu");
  return (
    <MenuPrimitive.Portal container={container}>
      <MenuPrimitive.Positioner
        sideOffset={1}
        align="start"
        {...positionerProps}
        className={`greyui-menu-positioner ${positionerClassName}`.trim()}
      >
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
  LinkItem: MenuLinkItem,
  CheckboxItem: MenuCheckboxItem,
  CheckboxItemIndicator: MenuCheckboxItemIndicator,
  RadioGroup: MenuRadioGroup,
  RadioItem: MenuRadioItem,
  RadioItemIndicator: MenuRadioItemIndicator,
  Group: MenuGroup,
  GroupLabel: MenuGroupLabel,
  SubmenuRoot: MenuSubmenuRoot,
  SubmenuTrigger: MenuSubmenuTrigger,
  Separator: MenuSeparator,
};
