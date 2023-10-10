"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactElement,
  useEffect,
} from "react";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { useProfile as useNostrProfile } from "nostr-react";
import { useNostrEvents } from "nostr-react";
import { nip19 } from "nostr-tools";
import { Kind } from "@/lib/nostr";
import { UserSchema } from "@/types";

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

  useEffect(() => {
    console.log("Running keys init");
    const shouldReconnect = localStorage.getItem("shouldReconnect");

    const getConnected = async (shouldReconnect: string) => {
      let enabled: boolean | void = false;

      if (typeof window.nostr === "undefined") {
        return;
      }

      if (shouldReconnect === "true") {
        const publicKey = await window.nostr.getPublicKey();
        setKeys({ privkey: "", pubkey: publicKey });
      }

      if (typeof window.webln === "undefined") {
        return;
      }
      if (shouldReconnect === "true" && !window.webln.executing) {
        try {
          enabled = await window.webln.enable();
        } catch (e: any) {
          console.log(e.message);
        }
      }
      return enabled;
    };

    if (shouldReconnect === "true") {
      getConnected(shouldReconnect);
    }
  }, []);

  const { events } = useNostrEvents({
    filter: {
      authors: [keys.pubkey as string],
      kinds: [Kind.Metadata],
    },
    enabled: !!keys.pubkey,
  });

  const { setCurrentUser, currentUser } = useCurrentUser();
  useEffect(() => {
    const metadataEvent = events[0];
    if (metadataEvent) {
      const userData = UserSchema.safeParse({
        ...JSON.parse(metadataEvent.content),
        npub: nip19.npubEncode(metadataEvent.pubkey),
      });
      if (userData.success && !currentUser) {
        setCurrentUser({ ...userData.data, pubkey: metadataEvent.pubkey });
      }
    }
  }, [events]);

  return (
    <KeysContext.Provider value={{ keys, setKeys }}>
      {children}
    </KeysContext.Provider>
  );
}

export function useKeys() {
  return useContext(KeysContext);
}
