import {
  useId,
  useState,
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";

export type WindowResponsiveMode = "stacked" | "floating";

export interface WindowProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  title: ReactNode;
  active?: boolean;
  controls?: ReactNode;
  as?: ElementType;
  bodyProps?: ComponentPropsWithoutRef<"div">;
  collapsible?: boolean;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  collapseLabel?: string;
  restoreLabel?: string;
  responsive?: WindowResponsiveMode;
}

export function Window({
  title,
  active = true,
  controls,
  as: Component = "div",
  bodyProps,
  collapsible = false,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  collapseLabel = "Minimize window",
  restoreLabel = "Restore window",
  responsive = "stacked",
  className = "",
  children,
  ...props
}: WindowProps) {
  const generatedBodyId = useId();
  const [uncontrolledCollapsed, setUncontrolledCollapsed] = useState(defaultCollapsed);
  const collapsed = collapsedProp ?? uncontrolledCollapsed;
  const bodyId = bodyProps?.id ?? generatedBodyId;
  const bodyClassName = bodyProps?.className ?? "";

  function toggleCollapsed() {
    const nextCollapsed = !collapsed;
    if (collapsedProp === undefined) setUncontrolledCollapsed(nextCollapsed);
    onCollapsedChange?.(nextCollapsed);
  }

  return (
    <Component
      data-greyui-component="window"
      data-active={active ? "true" : "false"}
      data-collapsed={collapsed ? "true" : "false"}
      data-responsive={responsive}
      className={`greyui-window ${className}`.trim()}
      {...props}
    >
      <div className="greyui-window-tab">
        <span className="greyui-window-title">{title}</span>
        {controls !== undefined || collapsible ? (
          <span className="greyui-window-controls">
            {controls}
            {collapsible ? (
              <WindowWidget
                kind={collapsed ? "restore" : "minimize"}
                label={collapsed ? restoreLabel : collapseLabel}
                aria-controls={bodyId}
                aria-expanded={!collapsed}
                onClick={toggleCollapsed}
              />
            ) : null}
          </span>
        ) : null}
      </div>
      <div
        {...bodyProps}
        id={bodyId}
        hidden={collapsed}
        className={`greyui-window-body ${bodyClassName}`.trim()}
      >
        {children}
      </div>
    </Component>
  );
}

export interface WindowWidgetProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label" | "type"
> {
  kind?: "close" | "zoom" | "minimize" | "restore";
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

export interface StatusBarItemProps extends ComponentPropsWithoutRef<"span"> {
  grow?: boolean;
}

export function StatusBarItem({ className = "", grow = false, ...props }: StatusBarItemProps) {
  return (
    <span
      data-greyui-component="status-bar-item"
      data-grow={grow ? "true" : undefined}
      className={`greyui-statusbar-item ${className}`.trim()}
      {...props}
    />
  );
}

export type StatusBarSeparatorProps = Omit<ComponentPropsWithoutRef<"span">, "role">;

export function StatusBarSeparator({ className = "", ...props }: StatusBarSeparatorProps) {
  return (
    <span
      role="separator"
      aria-orientation="vertical"
      data-greyui-component="status-bar-separator"
      className={`greyui-statusbar-separator ${className}`.trim()}
      {...props}
    />
  );
}

export interface StatusLightProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  label: string;
  state?: "idle" | "ready" | "loading" | "error";
}

export function StatusLight({ className = "", label, state = "idle", ...props }: StatusLightProps) {
  return (
    <span
      role="img"
      aria-label={label}
      data-greyui-component="status-light"
      data-state={state}
      className={`greyui-status-light ${className}`.trim()}
      {...props}
    />
  );
}
