import type { ButtonHTMLAttributes, ComponentPropsWithoutRef, ReactNode } from "react";

export interface WindowProps extends Omit<ComponentPropsWithoutRef<"section">, "title"> {
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
    <section
      data-greyui-component="window"
      data-active={active ? "true" : "false"}
      className={`greyui-window ${className}`.trim()}
      {...props}
    >
      <header className="greyui-window-tab">
        <span className="greyui-window-title">{title}</span>
        {controls !== undefined ? <span className="greyui-window-controls">{controls}</span> : null}
      </header>
      <div className="greyui-window-body">{children}</div>
    </section>
  );
}

export interface WindowWidgetProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label" | "type"
> {
  label: string;
}

export function WindowWidget({ label, className = "", ...props }: WindowWidgetProps) {
  return (
    <button
      {...props}
      type="button"
      aria-label={label}
      className={`greyui-window-widget ${className}`.trim()}
    >
      <span aria-hidden="true" />
    </button>
  );
}

export type MenuBarProps = ComponentPropsWithoutRef<"nav">;
export function MenuBar({ className = "", ...props }: MenuBarProps) {
  return (
    <nav
      data-greyui-component="menu-bar"
      className={`greyui-menubar ${className}`.trim()}
      {...props}
    />
  );
}

export type StatusBarProps = ComponentPropsWithoutRef<"footer">;
export function StatusBar({ className = "", ...props }: StatusBarProps) {
  return (
    <footer
      data-greyui-component="status-bar"
      className={`greyui-statusbar ${className}`.trim()}
      {...props}
    />
  );
}
