import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

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

export interface IconButtonProps extends Omit<ButtonProps, "aria-label" | "children"> {
  label: string;
  children: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { className = "", label, children, ...props },
  ref,
) {
  return (
    <Button
      ref={ref}
      aria-label={label}
      className={`greyui-icon-button ${className}`.trim()}
      {...props}
    >
      <span className="greyui-icon-button-glyph" aria-hidden="true">
        {children}
      </span>
    </Button>
  );
});

export interface ButtonGroupProps extends ComponentPropsWithoutRef<"div"> {
  orientation?: "horizontal" | "vertical";
}

export function ButtonGroup({
  className = "",
  orientation = "horizontal",
  role = "group",
  ...props
}: ButtonGroupProps) {
  return (
    <div
      role={role}
      data-greyui-component="button-group"
      data-orientation={orientation}
      className={`greyui-button-group ${className}`.trim()}
      {...props}
    />
  );
}
