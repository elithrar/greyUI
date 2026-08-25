import type { ComponentProps, ReactNode } from "react";
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";

type RootProps = Omit<ComponentProps<typeof ScrollAreaPrimitive.Root>, "className" | "children"> & {
  className?: string;
  children?: ReactNode;
};

export function ScrollArea({ className = "", children, ...props }: RootProps) {
  return (
    <ScrollAreaPrimitive.Root
      data-greyui-component="scroll-area"
      className={`greyui-scroll-area ${className}`.trim()}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport className="greyui-scroll-viewport">
        <ScrollAreaPrimitive.Content className="greyui-scroll-content">{children}</ScrollAreaPrimitive.Content>
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar className="greyui-scrollbar" orientation="vertical">
        <ScrollAreaPrimitive.Thumb className="greyui-scrollbar-thumb" />
      </ScrollAreaPrimitive.Scrollbar>
      <ScrollAreaPrimitive.Scrollbar className="greyui-scrollbar" orientation="horizontal">
        <ScrollAreaPrimitive.Thumb className="greyui-scrollbar-thumb" />
      </ScrollAreaPrimitive.Scrollbar>
      <ScrollAreaPrimitive.Corner className="greyui-scrollbar-corner" />
    </ScrollAreaPrimitive.Root>
  );
}
