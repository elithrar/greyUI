import type { ComponentProps, ReactNode } from "react";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";

export interface RadioOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

type PrimitiveProps = Omit<
  ComponentProps<typeof RadioGroupPrimitive<string>>,
  "className" | "children"
>;

export interface RadioGroupProps extends PrimitiveProps {
  className?: string;
  options: readonly RadioOption[];
}

export function RadioGroup({ className = "", options, ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive
      data-greyui-component="radio-group"
      className={`greyui-radio-group ${className}`.trim()}
      {...props}
    >
      {options.map((option) => (
        <label
          className="greyui-control-label"
          data-disabled={option.disabled ? "" : undefined}
          key={option.value}
        >
          <Radio.Root className="greyui-radio" value={option.value} disabled={option.disabled}>
            <Radio.Indicator className="greyui-radio-indicator" />
          </Radio.Root>
          <span>{option.label}</span>
        </label>
      ))}
    </RadioGroupPrimitive>
  );
}
