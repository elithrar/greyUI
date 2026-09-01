import {
  createContext,
  useCallback,
  useId,
  useContext,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";

export type WindowResponsiveMode = "stacked" | "floating";

export interface WindowRootProps extends ComponentPropsWithoutRef<"div"> {
  active?: boolean;
  as?: ElementType;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  responsive?: WindowResponsiveMode;
  bodyId?: string | undefined;
}

interface WindowContextValue {
  bodyId: string;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const WindowContext = createContext<WindowContextValue | null>(null);

function useWindowContext(component: string) {
  const context = useContext(WindowContext);
  if (context === null) throw new Error(`${component} must be used inside Window.Root`);
  return context;
}

export function WindowRoot({
  active = true,
  as: Component = "div",
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  responsive = "stacked",
  bodyId: bodyIdProp,
  className = "",
  children,
  ...props
}: WindowRootProps) {
  const generatedBodyId = useId();
  const [uncontrolledCollapsed, setUncontrolledCollapsed] = useState(defaultCollapsed);
  const collapsed = collapsedProp ?? uncontrolledCollapsed;
  const bodyId = bodyIdProp ?? generatedBodyId;

  const setCollapsed = useCallback(
    (nextCollapsed: boolean) => {
      if (collapsedProp === undefined) setUncontrolledCollapsed(nextCollapsed);
      onCollapsedChange?.(nextCollapsed);
    },
    [collapsedProp, onCollapsedChange],
  );
  const contextValue = useMemo(
    () => ({ bodyId, collapsed, setCollapsed }),
    [bodyId, collapsed, setCollapsed],
  );

  return (
    <WindowContext.Provider value={contextValue}>
      <Component
        data-greyui-component="window"
        data-active={active ? "true" : "false"}
        data-collapsed={collapsed ? "true" : "false"}
        data-responsive={responsive}
        className={`greyui-window ${className}`.trim()}
        {...props}
      >
        {children}
      </Component>
    </WindowContext.Provider>
  );
}

export type WindowTitleBarProps = ComponentPropsWithoutRef<"div">;
export function WindowTitleBar({ className = "", ...props }: WindowTitleBarProps) {
  return <div className={`greyui-window-tab ${className}`.trim()} {...props} />;
}

export type WindowTitleProps = ComponentPropsWithoutRef<"span">;
export function WindowTitle({ className = "", ...props }: WindowTitleProps) {
  return <span className={`greyui-window-title ${className}`.trim()} {...props} />;
}

export type WindowControlsProps = ComponentPropsWithoutRef<"span">;
export function WindowControls({ className = "", ...props }: WindowControlsProps) {
  return <span className={`greyui-window-controls ${className}`.trim()} {...props} />;
}

export type WindowBodyProps = ComponentPropsWithoutRef<"div">;
export function WindowBody({ className = "", hidden, id, ...props }: WindowBodyProps) {
  const { bodyId, collapsed } = useWindowContext("Window.Body");
  return (
    <div
      id={id ?? bodyId}
      hidden={collapsed || hidden}
      className={`greyui-window-body ${className}`.trim()}
      {...props}
    />
  );
}

export interface WindowContentProps extends ComponentPropsWithoutRef<"div"> {
  density?: "compact" | "comfortable";
}

export function WindowContent({
  className = "",
  density = "comfortable",
  ...props
}: WindowContentProps) {
  return (
    <div
      data-greyui-component="window-content"
      data-density={density}
      className={`greyui-window-content ${className}`.trim()}
      {...props}
    />
  );
}

export type WindowHeaderProps = ComponentPropsWithoutRef<"div">;
export function WindowHeader({ className = "", ...props }: WindowHeaderProps) {
  return (
    <div
      data-greyui-component="window-header"
      className={`greyui-window-header ${className}`.trim()}
      {...props}
    />
  );
}

export type WindowDescriptionProps = ComponentPropsWithoutRef<"p">;
export function WindowDescription({ className = "", ...props }: WindowDescriptionProps) {
  return <p className={`greyui-window-description ${className}`.trim()} {...props} />;
}

export type WindowActionsProps = ComponentPropsWithoutRef<"div">;
export function WindowActions({ className = "", ...props }: WindowActionsProps) {
  return (
    <div
      data-greyui-component="window-actions"
      className={`greyui-window-actions ${className}`.trim()}
      {...props}
    />
  );
}

export interface WindowCollapseProps extends Omit<WindowWidgetProps, "kind" | "label"> {
  collapseLabel?: string | undefined;
  restoreLabel?: string | undefined;
}

export function WindowCollapse({
  collapseLabel = "Minimize window",
  restoreLabel = "Restore window",
  onClick,
  ...props
}: WindowCollapseProps) {
  const { bodyId, collapsed, setCollapsed } = useWindowContext("Window.Collapse");
  return (
    <WindowWidget
      {...props}
      kind={collapsed ? "restore" : "minimize"}
      label={collapsed ? restoreLabel : collapseLabel}
      aria-controls={bodyId}
      aria-expanded={!collapsed}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setCollapsed(!collapsed);
      }}
    />
  );
}

export interface WindowProps extends Omit<WindowRootProps, "bodyId" | "children" | "title"> {
  title: ReactNode;
  controls?: ReactNode;
  bodyProps?: WindowBodyProps;
  collapsible?: boolean;
  collapseLabel?: string | undefined;
  restoreLabel?: string | undefined;
  children?: ReactNode;
}

function WindowComponent({
  title,
  controls,
  bodyProps,
  collapsible = false,
  collapseLabel,
  restoreLabel,
  children,
  ...props
}: WindowProps) {
  return (
    <WindowRoot bodyId={bodyProps?.id} {...props}>
      <WindowTitleBar>
        <WindowTitle>{title}</WindowTitle>
        {controls !== undefined || collapsible ? (
          <WindowControls>
            {controls}
            {collapsible ? (
              <WindowCollapse collapseLabel={collapseLabel} restoreLabel={restoreLabel} />
            ) : null}
          </WindowControls>
        ) : null}
      </WindowTitleBar>
      <WindowBody {...bodyProps}>{children}</WindowBody>
    </WindowRoot>
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

export const Window = Object.assign(WindowComponent, {
  Root: WindowRoot,
  TitleBar: WindowTitleBar,
  Title: WindowTitle,
  Controls: WindowControls,
  Collapse: WindowCollapse,
  Body: WindowBody,
  Content: WindowContent,
  Header: WindowHeader,
  Description: WindowDescription,
  Actions: WindowActions,
  StatusBar,
});
