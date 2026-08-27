// greyUI requires React 19, where useSyncExternalStore is native. This ESM bridge avoids the
// CommonJS compatibility entrypoint used by the upstream backwards-compatibility package.
export { useSyncExternalStore } from "react";
