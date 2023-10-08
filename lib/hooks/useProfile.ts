"use client";
import { useProfile as useNostrProfile } from "nostr-react";
import { nip19 } from "nostr-tools";
export default function useProfile(pubkey: string) {
  if (nip19.BECH32_REGEX.test(pubkey) && pubkey.startsWith("n")) {
    const decone = nip19.decode(pubkey);
    console.log("decone", decone);
    pubkey = decone.data.toString();
  }
  const { data: userData, isLoading } = useNostrProfile({
    pubkey,
  });

  return { user: userData, isLoading };
}
