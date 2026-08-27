import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Button, type ButtonProps } from "./button";

export type BannerVariant = "default" | "alert" | "error" | "secondary";
export type BannerSize = "base" | "sm";

export interface BannerProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  variant?: BannerVariant;
  size?: BannerSize;
}

export function BannerRoot({
  action,
  children,
  className = "",
  description,
  icon,
  size = "base",
  title,
  variant = "default",
  ...props
}: BannerProps) {
  const structured = title !== undefined || description !== undefined || action !== undefined;

  return (
    <div
      data-greyui-component="banner"
      data-has-action={action !== undefined ? "true" : "false"}
      data-has-icon={icon !== undefined ? "true" : "false"}
      data-size={size}
      data-variant={variant}
      className={`greyui-banner ${className}`.trim()}
      {...props}
    >
      {icon !== undefined ? (
        <span className="greyui-banner-icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {structured ? (
        <div className="greyui-banner-copy">
          {title !== undefined ? <strong className="greyui-banner-title">{title}</strong> : null}
          {description !== undefined ? (
            <div className="greyui-banner-description">{description}</div>
          ) : null}
          {children}
        </div>
      ) : (
        <div className="greyui-banner-copy">{children}</div>
      )}
      {action !== undefined ? <div className="greyui-banner-actions">{action}</div> : null}
    </div>
  );
}

export function BannerAction({ size = "sm", ...props }: ButtonProps) {
  return <Button size={size} {...props} />;
}

export const Banner = Object.assign(BannerRoot, {
  Action: BannerAction,
});
