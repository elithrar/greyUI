import { forwardRef, type ButtonHTMLAttributes } from "react";

export type ButtonVariant = "secondary" | "primary" | "destructive";
export type ButtonSize = "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className = "", variant = "secondary", size = "md", type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      data-greyui-component="button"
      data-variant={variant}
      data-size={size}
      className={`greyui-button ${className}`.trim()}
      {...props}
    />
  );
});
