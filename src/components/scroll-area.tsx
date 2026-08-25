import type { ComponentProps, ReactNode } from "react";
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";

type RootProps = Omit<ComponentProps<typeof ScrollAreaPrimitive.Root>, "className" | "children"> & {
  className?: string;
  children?: ReactNode;
};

export interface ScrollAreaProps extends RootProps {
  stableGutter?: boolean;
}

export function ScrollArea({
  className = "",
  children,
  stableGutter = false,
  ...props
}: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root
      data-greyui-component="scroll-area"
      data-stable-gutter={stableGutter ? "true" : undefined}
      className={`greyui-scroll-area ${className}`.trim()}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport className="greyui-scroll-viewport">
        <ScrollAreaPrimitive.Content className="greyui-scroll-content">
          {children}
        </ScrollAreaPrimitive.Content>
      </ScrollAreaPrimitive.Viewport>
    </ScrollAreaPrimitive.Root>
  );
}
