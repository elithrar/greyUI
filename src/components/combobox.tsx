import type { ComponentProps, ReactNode } from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";

export const ComboboxRoot = ComboboxPrimitive.Root;

type WithClassName<T> = Omit<T, "className"> & { className?: string };

export function ComboboxInputGroup({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ComboboxPrimitive.InputGroup>>) {
  return (
    <ComboboxPrimitive.InputGroup
      data-greyui-component="combobox"
      className={`greyui-combobox-input-group ${className}`.trim()}
      {...props}
    />
  );
}

export function ComboboxInput({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ComboboxPrimitive.Input>>) {
  return <ComboboxPrimitive.Input className={`greyui-combobox-input ${className}`.trim()} {...props} />;
}

export function ComboboxTrigger({
  "aria-label": ariaLabel = "Show options",
  className = "",
  children,
  ...props
}: WithClassName<ComponentProps<typeof ComboboxPrimitive.Trigger> & { children?: ReactNode }>) {
  return (
    <ComboboxPrimitive.Trigger
      aria-label={ariaLabel}
      className={`greyui-combobox-trigger ${className}`.trim()}
      {...props}
    >
      {children ?? <span className="greyui-select-arrow" aria-hidden="true" />}
    </ComboboxPrimitive.Trigger>
  );
}

export function ComboboxClear({
  "aria-label": ariaLabel = "Clear selection",
  className = "",
  children = "×",
  ...props
}: WithClassName<ComponentProps<typeof ComboboxPrimitive.Clear> & { children?: ReactNode }>) {
  return (
    <ComboboxPrimitive.Clear
      aria-label={ariaLabel}
      className={`greyui-combobox-clear ${className}`.trim()}
      {...props}
    >
      {children}
    </ComboboxPrimitive.Clear>
  );
}

export function ComboboxPopup({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ComboboxPrimitive.Popup>>) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        className="greyui-combobox-positioner"
        align="start"
        sideOffset={2}
      >
        <ComboboxPrimitive.Popup
          className={`greyui-combobox-popup ${className}`.trim()}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

export function ComboboxList({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ComboboxPrimitive.List>>) {
  return <ComboboxPrimitive.List className={`greyui-combobox-list ${className}`.trim()} {...props} />;
}

export function ComboboxItem({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ComboboxPrimitive.Item>>) {
  return <ComboboxPrimitive.Item className={`greyui-combobox-item ${className}`.trim()} {...props} />;
}

export function ComboboxItemIndicator({
  className = "",
  children = "✓",
  ...props
}: WithClassName<
  ComponentProps<typeof ComboboxPrimitive.ItemIndicator> & { children?: ReactNode }
>) {
  return (
    <ComboboxPrimitive.ItemIndicator
      className={`greyui-combobox-item-indicator ${className}`.trim()}
      {...props}
    >
      {children}
    </ComboboxPrimitive.ItemIndicator>
  );
}

export function ComboboxEmpty({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ComboboxPrimitive.Empty>>) {
  return <ComboboxPrimitive.Empty className={`greyui-combobox-empty ${className}`.trim()} {...props} />;
}

export function ComboboxSeparator({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ComboboxPrimitive.Separator>>) {
  return (
    <ComboboxPrimitive.Separator
      className={`greyui-menu-separator ${className}`.trim()}
      {...props}
    />
  );
}

export const ComboboxGroup = ComboboxPrimitive.Group;
export const ComboboxGroupLabel = ComboboxPrimitive.GroupLabel;
export const ComboboxValue = ComboboxPrimitive.Value;

export const Combobox = {
  Root: ComboboxRoot,
  InputGroup: ComboboxInputGroup,
  Input: ComboboxInput,
  Trigger: ComboboxTrigger,
  Clear: ComboboxClear,
  Popup: ComboboxPopup,
  List: ComboboxList,
  Item: ComboboxItem,
  ItemIndicator: ComboboxItemIndicator,
  Empty: ComboboxEmpty,
  Separator: ComboboxSeparator,
  Group: ComboboxGroup,
  GroupLabel: ComboboxGroupLabel,
  Value: ComboboxValue,
};
