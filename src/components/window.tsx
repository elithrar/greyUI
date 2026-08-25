import type { ButtonHTMLAttributes, ComponentPropsWithoutRef, ReactNode } from "react";

export interface WindowProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  title: ReactNode;
  active?: boolean;
  controls?: ReactNode;
}

export function Window({
  title,
  active = true,
  controls,
  className = "",
  children,
  ...props
}: WindowProps) {
  return (
    <div
      data-greyui-component="window"
      data-active={active ? "true" : "false"}
      className={`greyui-window ${className}`.trim()}
      {...props}
    >
      <div className="greyui-window-tab">
        <span className="greyui-window-title">{title}</span>
        {controls !== undefined ? <span className="greyui-window-controls">{controls}</span> : null}
      </div>
      <div className="greyui-window-body">{children}</div>
    </div>
  );
}

export interface WindowWidgetProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label" | "type"
> {
  kind?: "close" | "zoom";
  label: string;
}

export function WindowWidget({
  kind = "close",
  label,
  className = "",
  ...props
}: WindowWidgetProps) {
  return (
    <button
      {...props}
      type="button"
      aria-label={label}
      data-kind={kind}
      className={`greyui-window-widget ${className}`.trim()}
    >
      <span aria-hidden="true" />
    </button>
  );
}

export type MenuBarProps = ComponentPropsWithoutRef<"div">;
export function MenuBar({ className = "", ...props }: MenuBarProps) {
  return (
    <div
      data-greyui-component="menu-bar"
      className={`greyui-menubar ${className}`.trim()}
      {...props}
    />
  );
}

export type StatusBarProps = ComponentPropsWithoutRef<"div">;
export function StatusBar({ className = "", ...props }: StatusBarProps) {
  return (
    <div
      data-greyui-component="status-bar"
      className={`greyui-statusbar ${className}`.trim()}
      {...props}
    />
  );
}
