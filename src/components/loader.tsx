import type { ComponentPropsWithoutRef, CSSProperties } from "react";

export type LoaderSize = "sm" | "base" | "lg" | number;

export interface LoaderProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  label?: string;
  size?: LoaderSize;
}

type LoaderStyle = CSSProperties & { "--greyui-loader-size": string };

const loaderSizes = { sm: 16, base: 24, lg: 32 } as const;

function isCustomLoaderSize(size: LoaderSize): size is number {
  return typeof size === "number";
}

export function Loader({
  className = "",
  label = "Loading",
  size = "base",
  style,
  ...props
}: LoaderProps) {
  const customSize = isCustomLoaderSize(size);
  const pixelSize = customSize ? size : loaderSizes[size];
  const loaderStyle: LoaderStyle = { "--greyui-loader-size": `${pixelSize}px`, ...style };

  return (
    <span
      role="status"
      aria-label={label}
      data-greyui-component="loader"
      data-size={customSize ? "custom" : size}
      className={`greyui-loader ${className}`.trim()}
      style={loaderStyle}
      {...props}
    />
  );
}
