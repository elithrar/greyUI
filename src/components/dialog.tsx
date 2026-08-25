import type { ComponentProps, ReactNode } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

export const DialogRoot = DialogPrimitive.Root;

type TriggerProps = Omit<ComponentProps<typeof DialogPrimitive.Trigger>, "className"> & {
  className?: string;
};
export function DialogTrigger({ className = "", ...props }: TriggerProps) {
  return <DialogPrimitive.Trigger className={`greyui-button ${className}`.trim()} {...props} />;
}

type PopupProps = Omit<ComponentProps<typeof DialogPrimitive.Popup>, "className" | "children"> & {
  className?: string;
  children?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
};

export function DialogPopup({
  className = "",
  title,
  description,
  children,
  ...props
}: PopupProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="greyui-dialog-backdrop" />
      <DialogPrimitive.Viewport className="greyui-dialog-viewport">
        <DialogPrimitive.Popup
          data-greyui-component="dialog"
          className={`greyui-window greyui-dialog ${className}`.trim()}
          {...props}
        >
          <div className="greyui-window-tab">
            <DialogPrimitive.Title className="greyui-window-title">{title}</DialogPrimitive.Title>
            <DialogPrimitive.Close className="greyui-window-widget" aria-label="Close">
              <span aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>
          <div className="greyui-dialog-body">
            {description !== undefined ? (
              <DialogPrimitive.Description className="greyui-dialog-description">
                {description}
              </DialogPrimitive.Description>
            ) : null}
            {children}
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Viewport>
    </DialogPrimitive.Portal>
  );
}

export const DialogClose = DialogPrimitive.Close;

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Popup: DialogPopup,
  Close: DialogClose,
};
