import { Input as InputPrimitive } from "@base-ui/react/input";
import type {
  ButtonHTMLAttributes,
  ComponentProps,
  HTMLAttributes,
  InputHTMLAttributes,
} from "react";
import { forwardRef } from "react";

export const InputGroupRoot = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function InputGroupRoot({ className = "", ...props }, ref) {
    return (
      <div
        ref={ref}
        data-greyui-component="input-group"
        className={`greyui-input-group ${className}`.trim()}
        {...props}
      />
    );
  },
);

export const InputGroupInput = forwardRef<
  HTMLInputElement,
  Omit<ComponentProps<typeof InputPrimitive>, "className"> & { className?: string }
>(function InputGroupInput({ className = "", ...props }, ref) {
  return (
    <InputPrimitive
      ref={ref}
      className={`greyui-input-group-input ${className}`.trim()}
      {...props}
    />
  );
});

export const InputGroupAddon = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  function InputGroupAddon({ className = "", ...props }, ref) {
    return (
      <span ref={ref} className={`greyui-input-group-addon ${className}`.trim()} {...props} />
    );
  },
);

export const InputGroupSuffix = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  function InputGroupSuffix({ className = "", ...props }, ref) {
    return (
      <span ref={ref} className={`greyui-input-group-suffix ${className}`.trim()} {...props} />
    );
  },
);

export const InputGroupButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(function InputGroupButton({ className = "", type = "button", ...props }, ref) {
  return (
    <button
      ref={ref}
      type={type}
      className={`greyui-input-group-button ${className}`.trim()}
      {...props}
    />
  );
});

export type InputGroupNativeInputProps = InputHTMLAttributes<HTMLInputElement>;

export const InputGroup = {
  Root: InputGroupRoot,
  Input: InputGroupInput,
  Addon: InputGroupAddon,
  Suffix: InputGroupSuffix,
  Button: InputGroupButton,
};
