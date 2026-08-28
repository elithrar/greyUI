import { createContext, useContext } from "react";

export const FieldsetDisabledContext = createContext(false);

export function useFieldsetDisabled() {
  return useContext(FieldsetDisabledContext);
}
