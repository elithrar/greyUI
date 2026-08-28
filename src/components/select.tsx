import type { ComponentProps, ReactNode } from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { useLayerContainer } from "./layer";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

type RootProps = Omit<ComponentProps<typeof SelectPrimitive.Root>, "items" | "children">;
type TriggerProps = Omit<
  ComponentProps<typeof SelectPrimitive.Trigger>,
  "aria-label" | "aria-labelledby" | "children" | "className"
>;

interface SelectCommonProps {
  className?: string;
  options: readonly SelectOption[];
  placeholder?: ReactNode;
  triggerProps?: TriggerProps;
}

type SelectAccessibleName =
  | {
      label: ReactNode;
      "aria-label"?: string;
      "aria-labelledby"?: string;
    }
  | {
      label?: undefined;
      "aria-label": string;
      "aria-labelledby"?: string;
    }
  | {
      label?: undefined;
      "aria-label"?: string;
      "aria-labelledby": string;
    };

export type SelectProps = RootProps & SelectCommonProps & SelectAccessibleName;

export function Select({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  className = "",
  label,
  options,
  placeholder = "Choose…",
  triggerProps,
  ...rootProps
}: SelectProps) {
  const container = useLayerContainer("menu");
  const triggerAccessibleNameProps =
    ariaLabel !== undefined
      ? { "aria-label": ariaLabel }
      : ariaLabelledBy !== undefined
        ? { "aria-labelledby": ariaLabelledBy }
        : {};

  return (
    <SelectPrimitive.Root items={options} {...rootProps}>
      <div data-greyui-component="select" className={`greyui-select-field ${className}`.trim()}>
        {label !== undefined ? (
          <SelectPrimitive.Label className="greyui-field-label">{label}</SelectPrimitive.Label>
        ) : null}
        <SelectPrimitive.Trigger
          className="greyui-select-trigger"
          {...triggerAccessibleNameProps}
          {...triggerProps}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon className="greyui-select-icon" aria-hidden="true">
            <span className="greyui-select-arrow" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
      </div>
      <SelectPrimitive.Portal container={container}>
        <SelectPrimitive.Positioner
          className="greyui-select-positioner"
          alignItemWithTrigger={false}
          sideOffset={2}
        >
          <SelectPrimitive.Popup className="greyui-select-popup">
            <SelectPrimitive.List className="greyui-select-list">
              {options.map((option) => (
                <SelectPrimitive.Item
                  className="greyui-select-item"
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  <SelectPrimitive.ItemIndicator className="greyui-select-item-indicator">
                    ✓
                  </SelectPrimitive.ItemIndicator>
                  <SelectPrimitive.ItemText className="greyui-select-item-text">
                    {option.label}
                  </SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
