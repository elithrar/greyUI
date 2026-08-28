import type { ComponentProps } from "react";
import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset";
import { FieldsetDisabledContext, useFieldsetDisabled } from "../fieldset-context";

type WithClassName<T> = Omit<T, "className"> & { className?: string };

export function FieldsetRoot({
  className = "",
  disabled = false,
  children,
  ...props
}: WithClassName<ComponentProps<typeof FieldsetPrimitive.Root>>) {
  const parentDisabled = useFieldsetDisabled();
  const resolvedDisabled = parentDisabled || disabled;

  return (
    <FieldsetDisabledContext.Provider value={resolvedDisabled}>
      <FieldsetPrimitive.Root
        data-greyui-component="fieldset"
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
