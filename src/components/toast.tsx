import type { ComponentProps } from "react";
import { Toast as ToastPrimitive } from "@base-ui/react/toast";

type WithClassName<T> = Omit<T, "className"> & { className?: string };

export const ToastProvider = ToastPrimitive.Provider;
export const useToastManager = ToastPrimitive.useToastManager;
export const createToastManager = ToastPrimitive.createToastManager;

export function ToastRoot({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ToastPrimitive.Root>>) {
  return (
    <ToastPrimitive.Root
      data-greyui-component="toast"
      className={`greyui-toast ${className}`.trim()}
      {...props}
    />
  );
}

export function ToastContent({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ToastPrimitive.Content>>) {
  return <ToastPrimitive.Content className={`greyui-toast-content ${className}`.trim()} {...props} />;
}

export function ToastTitle({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ToastPrimitive.Title>>) {
  return <ToastPrimitive.Title className={`greyui-toast-title ${className}`.trim()} {...props} />;
}

export function ToastDescription({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ToastPrimitive.Description>>) {
  return (
    <ToastPrimitive.Description
      className={`greyui-toast-description ${className}`.trim()}
      {...props}
    />
  );
}

export function ToastClose({
  className = "",
  ...props
}: WithClassName<ComponentProps<typeof ToastPrimitive.Close>>) {
  return (
    <ToastPrimitive.Close className={`greyui-toast-close ${className}`.trim()} {...props} />
  );
}

export function ToastToaster() {
  const { toasts } = ToastPrimitive.useToastManager();

  return (
    <ToastPrimitive.Portal>
      <ToastPrimitive.Viewport className="greyui-toast-viewport">
        {toasts.map((toast) => (
          <ToastRoot key={toast.id} toast={toast}>
            <ToastContent>
              <div className="greyui-toast-text">
                <ToastTitle />
                <ToastDescription />
              </div>
              <ToastClose aria-label="Dismiss">×</ToastClose>
            </ToastContent>
          </ToastRoot>
        ))}
      </ToastPrimitive.Viewport>
    </ToastPrimitive.Portal>
  );
}

export const Toast = {
  Provider: ToastProvider,
  Toaster: ToastToaster,
  Root: ToastRoot,
  Content: ToastContent,
  Title: ToastTitle,
  Description: ToastDescription,
  Close: ToastClose,
  useToastManager,
  createToastManager,
};
