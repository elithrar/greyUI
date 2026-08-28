import type { ComponentProps } from "react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";

type WithClassName<T> = Omit<T, "className"> & { className?: string };

export function AccordionRoot({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof AccordionPrimitive.Root>>) {
  return (
    <AccordionPrimitive.Root
      data-greyui-component="accordion"
      className={`greyui-accordion ${className}`.trim()}
      {...props}
    />
  );
}

export function AccordionItem({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof AccordionPrimitive.Item>>) {
  return (
    <AccordionPrimitive.Item className={`greyui-accordion-item ${className}`.trim()} {...props} />
  );
}

export function AccordionHeader({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof AccordionPrimitive.Header>>) {
  return (
    <AccordionPrimitive.Header
      className={`greyui-accordion-header ${className}`.trim()}
      {...props}
    />
  );
}

export function AccordionTrigger({
  className = "",
  children,
  ...props
}: WithClassName<ComponentProps<typeof AccordionPrimitive.Trigger>>) {
  return (
    <AccordionPrimitive.Trigger
      className={`greyui-accordion-trigger ${className}`.trim()}
      {...props}
    >
      <span className="greyui-accordion-arrow" aria-hidden="true" />
      <span className="greyui-accordion-trigger-label">{children}</span>
    </AccordionPrimitive.Trigger>
  );
}

export function AccordionPanel({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof AccordionPrimitive.Panel>>) {
  return (
    <AccordionPrimitive.Panel className={`greyui-accordion-panel ${className}`.trim()} {...props} />
  );
}

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Panel: AccordionPanel,
};
