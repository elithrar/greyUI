import type { ComponentProps, ReactNode } from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

type RootProps = Omit<ComponentProps<typeof SelectPrimitive.Root>, "items" | "children">;

export interface SelectProps extends RootProps {
  className?: string;
  label?: ReactNode;
  options: readonly SelectOption[];
  placeholder?: ReactNode;
  triggerProps?: Omit<ComponentProps<typeof SelectPrimitive.Trigger>, "className" | "children">;
}

export function Select({
  className = "",
  label,
  options,
  placeholder = "Choose…",
  triggerProps,
  ...rootProps
}: SelectProps) {
  return (
    <SelectPrimitive.Root items={options} {...rootProps}>
      <div data-greyui-component="select" className={`greyui-select-field ${className}`.trim()}>
        {label !== undefined ? <SelectPrimitive.Label className="greyui-field-label">{label}</SelectPrimitive.Label> : null}
        <SelectPrimitive.Trigger className="greyui-select-trigger" {...triggerProps}>
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon className="greyui-select-icon">▾</SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
      </div>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner className="greyui-select-positioner" alignItemWithTrigger={false} sideOffset={2}>
          <SelectPrimitive.Popup className="greyui-select-popup">
            <SelectPrimitive.List className="greyui-select-list">
              {options.map((option) => (
                <SelectPrimitive.Item
                  className="greyui-select-item"
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  <SelectPrimitive.ItemIndicator className="greyui-select-item-indicator">✓</SelectPrimitive.ItemIndicator>
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
