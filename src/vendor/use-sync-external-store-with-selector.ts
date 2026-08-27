/* oxlint-disable react/immutability, react/refs */
// Adapted from the MIT-licensed use-sync-external-store shim distributed with React. Its memoized
// selector intentionally follows React's render-time ref/cache algorithm.
import { useDebugValue, useEffect, useMemo, useRef, useSyncExternalStore } from "react";

export function useSyncExternalStoreWithSelector<Snapshot, Selection>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => Snapshot,
  getServerSnapshot: (() => Snapshot) | undefined,
  selector: (snapshot: Snapshot) => Selection,
  isEqual?: (first: Selection, second: Selection) => boolean,
) {
  const instanceRef = useRef<{ hasValue: boolean; value: Selection | null } | null>(null);
  if (instanceRef.current === null) {
    instanceRef.current = { hasValue: false, value: null };
  }
  const instance = instanceRef.current;

  const [getSelection, getServerSelection] = useMemo(() => {
    let hasMemo = false;
    let memoizedSnapshot: Snapshot;
    let memoizedSelection: Selection;

    function memoizedSelector(nextSnapshot: Snapshot) {
      if (!hasMemo) {
        hasMemo = true;
        memoizedSnapshot = nextSnapshot;
        const nextSelection = selector(nextSnapshot);
        if (isEqual && instance.hasValue && instance.value !== null) {
          if (isEqual(instance.value, nextSelection)) {
            memoizedSelection = instance.value;
            return instance.value;
          }
        }
        memoizedSelection = nextSelection;
        return nextSelection;
      }

      if (Object.is(memoizedSnapshot, nextSnapshot)) return memoizedSelection;
      const nextSelection = selector(nextSnapshot);
      if (isEqual?.(memoizedSelection, nextSelection)) {
        memoizedSnapshot = nextSnapshot;
        return memoizedSelection;
      }
      memoizedSnapshot = nextSnapshot;
      memoizedSelection = nextSelection;
      return nextSelection;
    }

    return [
      () => memoizedSelector(getSnapshot()),
      getServerSnapshot ? () => memoizedSelector(getServerSnapshot()) : undefined,
    ] as const;
  }, [getSnapshot, getServerSnapshot, instance, isEqual, selector]);

  const value = useSyncExternalStore(subscribe, getSelection, getServerSelection);
  useEffect(() => {
    instance.hasValue = true;
    instance.value = value;
  }, [instance, value]);
  useDebugValue(value);
  return value;
}
