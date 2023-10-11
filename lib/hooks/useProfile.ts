"use client";
import { useEffect, useState, useRef } from "react";
import { useProfile as useNostrProfile } from "nostr-react";
import { nip19 } from "nostr-tools";
import { NOSTR_BECH32_REGEXP } from "@/lib/nostr/utils";
import { useNDK } from "@/app/_providers/ndkProvider";
import { type NDKUserProfile } from "@nostr-dev-kit/ndk";

export default function useProfile(pubkey: string) {
  const { ndk, getProfile } = useNDK();
  const [profile, setProfile] = useState<NDKUserProfile | undefined>(
    getProfile(pubkey),
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!ndk) return;

    return () => {
      void ndk
        .getUser({ hexpubkey: pubkey })
        .fetchProfile()
        .then((p) => p && setProfile(p));
    };
    // return SocialNetwork.getProfile(pub, (p) => {
    //   if (p && p.created_at !== profile.created_at) {
    //     setProfile(p);
    //   }
    // });
  }, [pubkey, ndk]);

  async function init() {
    const profile = getProfile(pubkey);
    if (!profile) {
      const newUser = ndk!.getUser({ hexpubkey: pubkey });
      await newUser.fetchProfile();
      // setProfile(getProfile(pubkey));
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

  return { profile: getProfile(pubkey), isLoading };
}
