import type { ComponentProps, ReactNode } from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

export interface TabItem {
  value: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

type RootProps = Omit<ComponentProps<typeof TabsPrimitive.Root>, "className" | "children">;

export interface TabsProps extends RootProps {
  className?: string;
  items: readonly TabItem[];
}

export function Tabs({ className = "", items, ...props }: TabsProps) {
  return (
    <TabsPrimitive.Root
      data-greyui-component="tabs"
      className={`greyui-tabs ${className}`.trim()}
      {...props}
    >
      <TabsPrimitive.List className="greyui-tabs-list">
        {items.map((item) => (
          <TabsPrimitive.Tab
            className="greyui-tab"
            key={item.value}
            value={item.value}
            disabled={item.disabled}
          >
            {item.label}
          </TabsPrimitive.Tab>
        ))}
      </TabsPrimitive.List>
      {items.map((item) => (
        <TabsPrimitive.Panel className="greyui-tab-panel" key={item.value} value={item.value}>
          {item.content}
        </TabsPrimitive.Panel>
      ))}
    </TabsPrimitive.Root>
  );
}
