import { forwardRef, type ButtonHTMLAttributes } from "react";

export type ButtonVariant = "secondary" | "primary" | "destructive";
export type ButtonSize = "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  defaultAction?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className = "",
    defaultAction = false,
    variant = "secondary",
    size = "md",
    type = "button",
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      data-greyui-component="button"
      data-default={defaultAction ? "true" : undefined}
      data-variant={variant}
      data-size={size}
      className={`greyui-button ${className}`.trim()}
      {...props}
    />
  );
});
