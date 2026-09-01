import type { ComponentProps } from "react";
import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset";
import { FieldsetDisabledContext, useFieldsetDisabled } from "../fieldset-context";

type WithClassName<T> = Omit<T, "className"> & { className?: string };

export type FieldsetVariant = "grouped" | "plain";

export interface FieldsetRootProps extends WithClassName<
  ComponentProps<typeof FieldsetPrimitive.Root>
> {
  variant?: FieldsetVariant;
}

export function FieldsetRoot({
  className = "",
  disabled = false,
  children,
  variant = "grouped",
  ...props
}: FieldsetRootProps) {
  const parentDisabled = useFieldsetDisabled();
  const resolvedDisabled = parentDisabled || disabled;

  return (
    <FieldsetDisabledContext.Provider value={resolvedDisabled}>
      <FieldsetPrimitive.Root
        data-greyui-component="fieldset"
        data-variant={variant}
        disabled={resolvedDisabled}
        className={`greyui-fieldset ${className}`.trim()}
        {...props}
      >
        {children}
      </FieldsetPrimitive.Root>
    </FieldsetDisabledContext.Provider>
  );
}

export function FieldsetLegend({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof FieldsetPrimitive.Legend>>) {
  return (
    <FieldsetPrimitive.Legend className={`greyui-fieldset-legend ${className}`.trim()} {...props} />
  );
}

export const Fieldset = {
  Root: FieldsetRoot,
  Legend: FieldsetLegend,
};
