import type {
  AnchorHTMLAttributes,
  ComponentPropsWithoutRef,
  HTMLAttributes,
  ReactNode,
} from "react";
import { Loader } from "./loader";

export interface BreadcrumbsProps extends ComponentPropsWithoutRef<"nav"> {
  size?: "sm" | "base";
}

export function BreadcrumbsRoot({
  "aria-label": ariaLabel = "Breadcrumb",
  children,
  className = "",
  size = "base",
  ...props
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label={ariaLabel}
      data-greyui-component="breadcrumbs"
      data-size={size}
      className={`greyui-breadcrumbs ${className}`.trim()}
      {...props}
    >
      <ol className="greyui-breadcrumbs-list">{children}</ol>
    </nav>
  );
}

export interface BreadcrumbsLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: ReactNode;
}

export function BreadcrumbsLink({
  children,
  className = "",
  icon,
  ...props
}: BreadcrumbsLinkProps) {
  return (
    <li className="greyui-breadcrumbs-item">
      <a className={`greyui-breadcrumbs-link ${className}`.trim()} {...props}>
        {icon !== undefined ? (
          <span className="greyui-breadcrumbs-icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <span>{children}</span>
      </a>
    </li>
  );
}

export interface BreadcrumbsCurrentProps extends HTMLAttributes<HTMLSpanElement> {
  icon?: ReactNode;
  loading?: boolean;
}

export function BreadcrumbsCurrent({
  children,
  className = "",
  icon,
  loading = false,
  ...props
}: BreadcrumbsCurrentProps) {
  return (
    <li className="greyui-breadcrumbs-item">
      <span
        aria-current="page"
        className={`greyui-breadcrumbs-current ${className}`.trim()}
        {...props}
      >
        {icon !== undefined ? (
          <span className="greyui-breadcrumbs-icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        {loading ? <Loader size="sm" label="Loading current location" /> : children}
      </span>
    </li>
  );
}

export type BreadcrumbsSeparatorProps = HTMLAttributes<HTMLLIElement>;

export function BreadcrumbsSeparator({
  children,
  className = "",
  ...props
}: BreadcrumbsSeparatorProps) {
  return (
    <li
      aria-hidden="true"
      className={`greyui-breadcrumbs-separator ${className}`.trim()}
      {...props}
    >
      {children ?? <span />}
    </li>
  );
}

export const Breadcrumbs = Object.assign(BreadcrumbsRoot, {
  Link: BreadcrumbsLink,
  Current: BreadcrumbsCurrent,
  Separator: BreadcrumbsSeparator,
});
