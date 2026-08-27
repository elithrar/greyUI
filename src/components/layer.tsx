import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export type LayerName = "menu" | "popover" | "overlay" | "dialog" | "toast" | "tooltip";

const layerNames: readonly LayerName[] = [
  "menu",
  "popover",
  "overlay",
  "dialog",
  "toast",
  "tooltip",
];

type LayerContainers = Record<LayerName, HTMLDivElement | null>;

const LayerContext = createContext<LayerContainers | null>(null);

export interface LayerProviderProps {
  children: ReactNode;
  container?: HTMLElement | ShadowRoot | null;
  zIndex?: Partial<Record<LayerName, number>>;
}

export function LayerProvider({ children, container, zIndex }: LayerProviderProps) {
  const [containers, setContainers] = useState<LayerContainers>(
    () => Object.fromEntries(layerNames.map((name) => [name, null])) as LayerContainers,
  );
  const hostRefs = useMemo(
    () =>
      Object.fromEntries(
        layerNames.map((name) => [
          name,
          (node: HTMLDivElement | null) =>
            setContainers((current) =>
              current[name] === node ? current : { ...current, [name]: node },
            ),
        ]),
      ) as Record<LayerName, (node: HTMLDivElement | null) => void>,
    [],
  );
  const portalTarget = container ?? (typeof document === "undefined" ? null : document.body);

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
  if (typeof document === "undefined") return null;
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
