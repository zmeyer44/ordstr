"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactElement,
  useEffect,
} from "react";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { nip19 } from "nostr-tools";
import { UserSchema } from "@/types";
import { useNDK } from "../ndkProvider";
import { NDKUser } from "@nostr-dev-kit/ndk";

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
  const { loginWithNip07, getProfile, ndk } = useNDK();
  const { setCurrentUser, currentUser } = useCurrentUser();

  useEffect(() => {
    console.log("Keys init");
    const shouldReconnect = localStorage.getItem("shouldReconnect");

    const getConnected = async (shouldReconnect: string) => {
      if (shouldReconnect === "true") {
        // const publicKey = await window.nostr.getPublicKey();
        const user = await loginWithNip07();
        if (!user) {
          throw new Error("NO auth");
        }
        setKeys({
          privkey: "",
          pubkey: nip19.decode(user.npub).data.toString(),
        });
      }
    };

    if (shouldReconnect === "true") {
      getConnected(shouldReconnect);
    }
  }, []);

  useEffect(() => {
    if (keys.pubkey && ndk && !currentUser) {
      handleFetchMetadata(keys.pubkey);
      // setCurrentUser(user)
    }
  }, [keys.pubkey, ndk, currentUser]);

  const test = true;
  async function handleFetchMetadata(pubkey: string) {
    try {
      if (test && ndk) {
        console.log("Fetching profile", ndk);
        const user = ndk?.getUser({ hexpubkey: pubkey });
        console.log("user", user);
        const profileData = await user.fetchProfile();
        console.log("PRofile", profileData);
        setCurrentUser(user);
      } else {
        // const metadataEvent = await ndk?.fetchEvent({
        //   authors: [pubkey],
        //   kinds: [0],
        // });
        // if (!metadataEvent) return;
        // const parsedUserData = UserSchema.safeParse({
        //   ...JSON.parse(metadataEvent.content),
        //   npub: nip19.npubEncode(pubkey),
        // });
        // if (parsedUserData.success) {
        //   setCurrentUser(parsedUserData.data);
        // }
      }
    } catch (e) {
      console.log("handleFetchMetadata", e);
    }
  }

  // const { events } = useNostrEvents({
  //   filter: {
  //     authors: [keys.pubkey as string],
  //     kinds: [Kind.Metadata],
  //   },
  //   enabled: !!keys.pubkey,
  // });

  // useEffect(() => {
  //   const metadataEvent = events[0];
  //   if (metadataEvent) {
  //     const userData = UserSchema.safeParse({
  //       ...JSON.parse(metadataEvent.content),
  //       npub: nip19.npubEncode(metadataEvent.pubkey),
  //     });
  //     if (userData.success && !currentUser) {
  //       setCurrentUser({ ...userData.data, pubkey: metadataEvent.pubkey });
  //     }
  //   }
  // }, [events]);

  return (
    <KeysContext.Provider value={{ keys, setKeys }}>
      {children}
    </KeysContext.Provider>
  );
}

export function useKeys() {
  return useContext(KeysContext);
}
