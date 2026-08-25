import type { ComponentPropsWithoutRef, ReactNode } from "react";

export interface GroupBoxProps extends Omit<ComponentPropsWithoutRef<"section">, "title"> {
  title: ReactNode;
}

export function GroupBox({ className = "", title, children, ...props }: GroupBoxProps) {
  return (
    <section
      data-greyui-component="group-box"
      className={`greyui-groupbox ${className}`.trim()}
      {...props}
    >
      <h3 className="greyui-groupbox-title">{title}</h3>
      <div className="greyui-groupbox-body">{children}</div>
    </section>
  );
}
