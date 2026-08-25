import type { HTMLAttributes, ReactNode } from "react";

export interface GroupBoxProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: ReactNode;
}

export function GroupBox({ className = "", title, children, ...props }: GroupBoxProps) {
  return (
    <section
      data-greyui-component="group-box"
      className={`greyui-groupbox ${className}`.trim()}
      {...props}
    >
      <div className="greyui-groupbox-title">{title}</div>
      <div className="greyui-groupbox-body">{children}</div>
    </section>
  );
}
