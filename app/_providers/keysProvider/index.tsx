"use client";

import { createContext, useContext, useState, type ReactElement } from "react";

type KeysContextProps = {
  setKeys: (keys: { privkey: string | null; pubkey: string | null }) => void;
  keys: {
    privkey: string | null;
    pubkey: string | null;
  };
};
const KeysContext = createContext<KeysContextProps | undefined>(undefined);

export default function KeysProvider({ children }: { children: ReactElement }) {
  const [keys, setKeys] = useState<{
    privkey: string | null;
    pubkey: string | null;
  }>({
    privkey: null,
    pubkey: null,
  });

  return (
    <KeysContext.Provider value={{ keys, setKeys }}>
      {children}
    </KeysContext.Provider>
  );
}

export function useKeys() {
  return useContext(KeysContext);
}
