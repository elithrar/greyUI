import type { ComponentProps, ReactNode } from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { useLayerContainer } from "./layer";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

type RootProps<Multiple extends boolean | undefined = false> = Omit<
  SelectPrimitive.Root.Props<string, Multiple>,
  "items" | "children"
>;
type TriggerProps = Omit<
  ComponentProps<typeof SelectPrimitive.Trigger>,
  "aria-label" | "aria-labelledby" | "children" | "className"
>;
type PopupWidth = "anchor" | "content";
type PositionerProps = Omit<
  ComponentProps<typeof SelectPrimitive.Positioner>,
  "children" | "className"
>;

interface SelectCommonProps {
  className?: string;
  options: readonly SelectOption[];
  placeholder?: ReactNode;
  /** Controls whether the popup matches its trigger or expands to fit its options. */
  popupWidth?: PopupWidth;
  /** Forwards Base UI positioning options while preserving greyUI's layer host. */
  positionerProps?: PositionerProps;
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

export type SelectProps<Multiple extends boolean | undefined = boolean | undefined> =
  RootProps<Multiple> & SelectCommonProps & SelectAccessibleName;

export function Select<Multiple extends boolean | undefined = false>({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  className = "",
  label,
  options,
  placeholder = "Choose…",
  popupWidth = "anchor",
  positionerProps,
  triggerProps,
  ...rootProps
}: SelectProps<Multiple>) {
  const container = useLayerContainer("menu");
  const triggerAccessibleNameProps =
    ariaLabel !== undefined
      ? { "aria-label": ariaLabel }
      : ariaLabelledBy !== undefined
        ? { "aria-labelledby": ariaLabelledBy }
        : {};

  return (
    <SelectPrimitive.Root<string, Multiple> items={options} {...rootProps}>
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
          collisionPadding={8}
          {...positionerProps}
        >
          <SelectPrimitive.Popup
            className="greyui-select-popup"
            data-greyui-popup-width={popupWidth}
          >
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
