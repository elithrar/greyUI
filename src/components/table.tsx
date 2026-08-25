import type { HTMLAttributes, TableHTMLAttributes } from "react";

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
}

export function Table({ className = "", wrapperProps, ...props }: TableProps) {
  const { className: wrapperClassName = "", ...restWrapperProps } = wrapperProps ?? {};
  const wrapperClass = `greyui-table-wrap ${wrapperClassName}`.trim();

  return (
    <div data-greyui-component="table" className={wrapperClass} {...restWrapperProps}>
      <table className={`greyui-table ${className}`.trim()} {...props} />
    </div>
  );
}
