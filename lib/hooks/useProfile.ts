"use client";
import { useEffect, useState } from "react";
import { useProfile as useNostrProfile } from "nostr-react";
import { nip19 } from "nostr-tools";
import { NOSTR_BECH32_REGEXP } from "@/lib/nostr/utils";
import { useNDK } from "@/app/_providers/ndkProvider";
import { type NDKUser } from "@nostr-dev-kit/ndk";

export default function useProfile(pubkey: string) {
  const { ndk } = useNDK();
  const [user, setUser] = useState<NDKUser | undefined>(
    ndk?.getUser({ hexpubkey: pubkey }),
  );
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    void init();
  }, [pubkey, ndk]);

  async function init() {
    console.log("Runnign init user", ndk, user);
    if (!ndk) return;
    if (!user) {
      const newUser = ndk.getUser({ hexpubkey: pubkey });
      setUser(newUser);
      await newUser.fetchProfile();
      console.log("Runnign init", newUser);
    } else {
      await user.fetchProfile();
    }
    setIsLoading(false);
  }
  // if (nip19.BECH32_REGEX.test(pubkey) && pubkey.startsWith("n")) {
  //   const decone = nip19.decode(pubkey);
  //   console.log("decone", decone);
  //   pubkey = decone.data.toString();
  // }'
  // if (NOSTR_BECH32_REGEXP.test(pubkey)) {
  //   pubkey = nip19.decode(pubkey).data.toString();
  // }
  // const { data: userData, isLoading } = useNostrProfile({
  //   pubkey: pubkey ?? "",
  //   enabled: !!pubkey && !NOSTR_BECH32_REGEXP.test(pubkey),
  // });

  return { user: user, isLoading };
}
