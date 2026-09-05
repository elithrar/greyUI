import type { ComponentPropsWithoutRef, ReactNode } from "react";

export interface EmptyProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  size?: "sm" | "base" | "lg";
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  commandLine?: string;
  /** Content below the description. Takes precedence over children when supplied. */
  contents?: ReactNode;
}

export function Empty({
  children,
  className = "",
  commandLine,
  contents,
  description,
  icon,
  size = "base",
  title,
  ...props
}: EmptyProps) {
  const resolvedContents = contents === undefined ? children : contents;
  return (
    <div
      data-greyui-component="empty"
      data-size={size}
      className={`greyui-empty ${className}`.trim()}
      {...props}
    >
      <div className="greyui-empty-masthead">
        {icon !== undefined ? (
          <span className="greyui-empty-icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <div className="greyui-empty-copy">
          <h2 className="greyui-empty-title">{title}</h2>
          {description !== undefined ? (
            <div className="greyui-empty-description">{description}</div>
          ) : null}
        </div>
      </div>
      {commandLine !== undefined ? (
        <code className="greyui-empty-command">$ {commandLine}</code>
      ) : null}
      {resolvedContents !== undefined ? (
        <div className="greyui-empty-contents">{resolvedContents}</div>
      ) : null}
    </div>
  );
}
