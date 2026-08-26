import type { ComponentProps } from "react";
import { Toolbar as ToolbarPrimitive } from "@base-ui/react/toolbar";

type WithClassName<T> = Omit<T, "className"> & { className?: string };

export function ToolbarRoot({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ToolbarPrimitive.Root>>) {
  return (
    <ToolbarPrimitive.Root
      data-greyui-component="toolbar"
      className={`greyui-toolbar ${className}`.trim()}
      {...props}
    />
  );
}

export function ToolbarGroup({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ToolbarPrimitive.Group>>) {
  return <ToolbarPrimitive.Group className={`greyui-toolbar-group ${className}`.trim()} {...props} />;
}

export function ToolbarButton({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ToolbarPrimitive.Button>>) {
  return (
    <ToolbarPrimitive.Button
      className={`greyui-button greyui-toolbar-button ${className}`.trim()}
      {...props}
    />
  );
}

export function ToolbarInput({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ToolbarPrimitive.Input>>) {
  return (
    <ToolbarPrimitive.Input
      className={`greyui-input greyui-toolbar-input ${className}`.trim()}
      {...props}
    />
  );
}

export function ToolbarLink({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ToolbarPrimitive.Link>>) {
  return <ToolbarPrimitive.Link className={`greyui-toolbar-link ${className}`.trim()} {...props} />;
}

export function ToolbarSeparator({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ToolbarPrimitive.Separator>>) {
  return (
    <ToolbarPrimitive.Separator
      className={`greyui-toolbar-separator ${className}`.trim()}
      {...props}
    />
  );
}

export const Toolbar = {
  Root: ToolbarRoot,
  Group: ToolbarGroup,
  Button: ToolbarButton,
  Input: ToolbarInput,
  Link: ToolbarLink,
  Separator: ToolbarSeparator,
};
