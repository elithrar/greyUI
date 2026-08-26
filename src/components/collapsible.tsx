import type { ComponentProps } from "react";
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";

type WithClassName<T> = Omit<T, "className"> & { className?: string };

export function CollapsibleRoot({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof CollapsiblePrimitive.Root>>) {
  return (
    <CollapsiblePrimitive.Root
      data-greyui-component="collapsible"
      className={`greyui-collapsible ${className}`.trim()}
      {...props}
    />
  );
}

export function CollapsibleTrigger({
  className = "",
  children,
  ...props
}: WithClassName<ComponentProps<typeof CollapsiblePrimitive.Trigger>>) {
  return (
    <CollapsiblePrimitive.Trigger
      className={`greyui-collapsible-trigger ${className}`.trim()}
      {...props}
    >
      <span className="greyui-collapsible-arrow" aria-hidden="true" />
      <span>{children}</span>
    </CollapsiblePrimitive.Trigger>
  );
}

export function CollapsiblePanel({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof CollapsiblePrimitive.Panel>>) {
  return (
    <CollapsiblePrimitive.Panel
      className={`greyui-collapsible-panel ${className}`.trim()}
      {...props}
    />
  );
}

export const Collapsible = {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Panel: CollapsiblePanel,
};
