import type { ComponentProps, ReactNode } from "react";
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { useLayerContainer } from "./layer";

export const AlertDialogRoot = AlertDialogPrimitive.Root;

type TriggerProps = Omit<ComponentProps<typeof AlertDialogPrimitive.Trigger>, "className"> & {
  className?: string;
};
export function AlertDialogTrigger({ className = "", ...props }: TriggerProps) {
  return (
    <AlertDialogPrimitive.Trigger className={`greyui-button ${className}`.trim()} {...props} />
  );
}

type PopupProps = Omit<
  ComponentProps<typeof AlertDialogPrimitive.Popup>,
  "className" | "children"
> & {
  className?: string;
  children?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
};

export function AlertDialogPopup({
  className = "",
  title,
  description,
  children,
  ...props
}: PopupProps) {
  const container = useLayerContainer("dialog");
  return (
    <AlertDialogPrimitive.Portal container={container}>
      <AlertDialogPrimitive.Backdrop className="greyui-dialog-backdrop" />
      <AlertDialogPrimitive.Viewport className="greyui-dialog-viewport">
        <AlertDialogPrimitive.Popup
          data-greyui-component="alert-dialog"
          className={`greyui-dialog ${className}`.trim()}
          {...props}
        >
          <div className="greyui-dialog-tabbar">
            <AlertDialogPrimitive.Title className="greyui-dialog-title">
              {title}
            </AlertDialogPrimitive.Title>
          </div>
          <div className="greyui-dialog-body">
            {description !== undefined ? (
              <AlertDialogPrimitive.Description className="greyui-dialog-description">
                {description}
              </AlertDialogPrimitive.Description>
            ) : null}
            {children}
          </div>
        </AlertDialogPrimitive.Popup>
      </AlertDialogPrimitive.Viewport>
    </AlertDialogPrimitive.Portal>
  );
}

export const AlertDialogClose = AlertDialogPrimitive.Close;

export const AlertDialog = {
  Root: AlertDialogRoot,
  Trigger: AlertDialogTrigger,
  Popup: AlertDialogPopup,
  Close: AlertDialogClose,
};
