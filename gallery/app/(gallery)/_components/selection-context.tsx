"use client";

import { createContext, useContext, useMemo, useState } from "react";

interface SelectionContextValue {
  selected: string[];
  toggle: (id: string) => void;
  setSelection: (ids: string[]) => void;
  clear: () => void;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<string[]>([]);

  const value = useMemo<SelectionContextValue>(
    () => ({
      selected,
      toggle: (id: string) => {
        setSelected((current) =>
          current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        );
      },
      setSelection: setSelected,
      clear: () => setSelected([]),
    }),
    [selected]
  );

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error("useSelection must be used within SelectionProvider");
  }
  return context;
}
