import type { ComponentProps, ReactElement, ReactNode } from "react";
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import { useLayerContainer } from "./layer";

type AutocompleteRootImplementation = <ItemValue>(
  props: AutocompletePrimitive.Root.Props<ItemValue>,
) => ReactElement;

// SAFETY: Base UI 1.7 implements Root with Root.Props<ItemValue>; its public
// overloads narrow `items` only to improve flat/grouped inference at call sites.
const renderAutocompleteRoot = AutocompletePrimitive.Root as AutocompleteRootImplementation;

export function AutocompleteRoot<ItemValue>({
  openOnInputClick = true,
  ...props
}: AutocompletePrimitive.Root.Props<ItemValue>) {
  return renderAutocompleteRoot({ openOnInputClick, ...props });
}

type WithClassName<T> = Omit<T, "className"> & { className?: string };

export function AutocompleteInputGroup({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof AutocompletePrimitive.InputGroup>>) {
  return (
    <AutocompletePrimitive.InputGroup
      data-greyui-component="autocomplete"
      className={`greyui-combobox-input-group greyui-autocomplete-input-group ${className}`.trim()}
      {...props}
    />
  );
}

export function AutocompleteInput({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof AutocompletePrimitive.Input>>) {
  return (
    <AutocompletePrimitive.Input
      className={`greyui-combobox-input greyui-autocomplete-input ${className}`.trim()}
      {...props}
    />
  );
}

export function AutocompleteTrigger({
  "aria-label": ariaLabel = "Show suggestions",
  className = "",
  children,
  ...props
}: WithClassName<ComponentProps<typeof AutocompletePrimitive.Trigger> & { children?: ReactNode }>) {
  return (
    <AutocompletePrimitive.Trigger
      aria-label={ariaLabel}
      className={`greyui-combobox-trigger greyui-autocomplete-trigger ${className}`.trim()}
      {...props}
    >
      {children ?? <span className="greyui-select-arrow" aria-hidden="true" />}
    </AutocompletePrimitive.Trigger>
  );
}

export function AutocompleteClear({
  "aria-label": ariaLabel = "Clear input",
  className = "",
  children = "×",
  ...props
}: WithClassName<ComponentProps<typeof AutocompletePrimitive.Clear> & { children?: ReactNode }>) {
  return (
    <AutocompletePrimitive.Clear
      aria-label={ariaLabel}
      className={`greyui-combobox-clear greyui-autocomplete-clear ${className}`.trim()}
      {...props}
    >
      {children}
    </AutocompletePrimitive.Clear>
  );
}

export function AutocompletePopup({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof AutocompletePrimitive.Popup>>) {
  const container = useLayerContainer("menu");
  return (
    <AutocompletePrimitive.Portal container={container}>
      <AutocompletePrimitive.Positioner
        className="greyui-combobox-positioner greyui-autocomplete-positioner"
        align="start"
        sideOffset={2}
      >
        <AutocompletePrimitive.Popup
          className={`greyui-combobox-popup greyui-autocomplete-popup ${className}`.trim()}
          {...props}
        />
      </AutocompletePrimitive.Positioner>
    </AutocompletePrimitive.Portal>
  );
}

export function AutocompleteList({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof AutocompletePrimitive.List>>) {
  return (
    <AutocompletePrimitive.List
      className={`greyui-combobox-list greyui-autocomplete-list ${className}`.trim()}
      {...props}
    />
  );
}

export function AutocompleteItem({
  className = "",
  children,
  ...props
}: WithClassName<ComponentProps<typeof AutocompletePrimitive.Item>>) {
  return (
    <AutocompletePrimitive.Item
      className={`greyui-combobox-item greyui-autocomplete-item ${className}`.trim()}
      {...props}
    >
      <span className="greyui-autocomplete-item-label">{children}</span>
      <span
        className="greyui-combobox-item-indicator greyui-autocomplete-item-indicator"
        aria-hidden="true"
      >
        ✓
      </span>
    </AutocompletePrimitive.Item>
  );
}

export function AutocompleteEmpty({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof AutocompletePrimitive.Empty>>) {
  return (
    <AutocompletePrimitive.Empty
      className={`greyui-combobox-empty greyui-autocomplete-empty ${className}`.trim()}
      {...props}
    />
  );
}

export function AutocompleteGroup({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof AutocompletePrimitive.Group>>) {
  return (
    <AutocompletePrimitive.Group
      className={`greyui-autocomplete-group ${className}`.trim()}
      {...props}
    />
  );
}

export function AutocompleteGroupLabel({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof AutocompletePrimitive.GroupLabel>>) {
  return (
    <AutocompletePrimitive.GroupLabel
      className={`greyui-autocomplete-group-label ${className}`.trim()}
      {...props}
    />
  );
}

export function AutocompleteSeparator({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof AutocompletePrimitive.Separator>>) {
  return (
    <AutocompletePrimitive.Separator
      className={`greyui-menu-separator ${className}`.trim()}
      {...props}
    />
  );
}

export const AutocompleteValue = AutocompletePrimitive.Value;
export const AutocompleteCollection = AutocompletePrimitive.Collection;
export const AutocompleteStatus = AutocompletePrimitive.Status;
export const useAutocompleteFilter = AutocompletePrimitive.useFilter;
export const useFilteredAutocompleteItems = AutocompletePrimitive.useFilteredItems;

export const Autocomplete = {
  Root: AutocompleteRoot,
  Value: AutocompleteValue,
  InputGroup: AutocompleteInputGroup,
  Input: AutocompleteInput,
  Trigger: AutocompleteTrigger,
  Clear: AutocompleteClear,
  Popup: AutocompletePopup,
  List: AutocompleteList,
  Item: AutocompleteItem,
  Empty: AutocompleteEmpty,
  Group: AutocompleteGroup,
  GroupLabel: AutocompleteGroupLabel,
  Separator: AutocompleteSeparator,
  Collection: AutocompleteCollection,
  Status: AutocompleteStatus,
  useFilter: useAutocompleteFilter,
  useFilteredItems: useFilteredAutocompleteItems,
};
