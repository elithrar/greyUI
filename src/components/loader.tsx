import type { ComponentPropsWithoutRef, CSSProperties } from "react";

export type LoaderSize = "sm" | "base" | "lg" | number;

export interface LoaderProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  label?: string;
  size?: LoaderSize;
}

const loaderSizes = { sm: 16, base: 24, lg: 32 } as const;

export function Loader({
  className = "",
  label = "Loading",
  size = "base",
  style,
  ...props
}: LoaderProps) {
  const pixelSize = typeof size === "number" ? size : loaderSizes[size];
  const loaderStyle = { "--greyui-loader-size": `${pixelSize}px`, ...style } as CSSProperties;

  return (
    <span
      role="status"
      aria-label={label}
      data-greyui-component="loader"
      data-size={typeof size === "number" ? "custom" : size}
      className={`greyui-loader ${className}`.trim()}
      style={loaderStyle}
      {...props}
    />
  );
}
