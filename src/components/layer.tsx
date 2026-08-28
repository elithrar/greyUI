import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

const layerNames = ["menu", "popover", "overlay", "dialog", "toast", "tooltip"] as const;

export type LayerName = (typeof layerNames)[number];

type LayerContainers = Record<LayerName, HTMLDivElement | null>;

function createLayerRecord<Value>(createValue: (name: LayerName) => Value) {
  return {
    menu: createValue("menu"),
    popover: createValue("popover"),
    overlay: createValue("overlay"),
    dialog: createValue("dialog"),
    toast: createValue("toast"),
    tooltip: createValue("tooltip"),
  } satisfies Record<LayerName, Value>;
}

const LayerContext = createContext<LayerContainers | null>(null);

export interface LayerProviderProps {
  children: ReactNode;
  container?: HTMLElement | ShadowRoot | null;
  zIndex?: Partial<Record<LayerName, number>>;
}

export function LayerProvider({ children, container, zIndex }: LayerProviderProps) {
  const [containers, setContainers] = useState<LayerContainers>(() =>
    createLayerRecord(() => null),
  );
  const hostRefs = useMemo(
    () =>
      createLayerRecord(
        (name) => (node: HTMLDivElement | null) =>
          setContainers((current) =>
            current[name] === node ? current : { ...current, [name]: node },
          ),
      ),
    [],
  );
  const portalTarget = container ?? globalThis.document?.body ?? null;

  return (
    <LayerContext.Provider value={containers}>
      {children}
      {portalTarget
        ? createPortal(
            <>
              {layerNames.map((name) => (
                <div
                  key={name}
                  ref={hostRefs[name]}
                  data-greyui-layer={name}
                  className="greyui-layer-host"
                  style={zIndex?.[name] === undefined ? undefined : { zIndex: zIndex[name] }}
                />
              ))}
            </>,
            portalTarget,
          )
        : null}
    </LayerContext.Provider>
  );
}

export function useLayerContainer(layer: LayerName): HTMLDivElement | null | undefined {
  return useContext(LayerContext)?.[layer];
}

export interface LayerPortalProps {
  children: ReactNode;
  layer?: LayerName;
}

export function LayerPortal({ children, layer = "overlay" }: LayerPortalProps) {
  const context = useContext(LayerContext);
  const document = globalThis.document;
  if (!document) return null;
  const target = context === null ? document.body : context[layer];
  if (target === null) return null;

  return createPortal(
    <div data-greyui-layer-portal={layer} className="greyui-layer-portal">
      {children}
    </div>,
    target,
  );
}

export const Layer = {
  Provider: LayerProvider,
  Portal: LayerPortal,
};
