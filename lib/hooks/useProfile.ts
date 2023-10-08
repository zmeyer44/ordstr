"use client";
import { useProfile as useNostrProfile } from "nostr-react";
import { nip19 } from "nostr-tools";
export default function useProfile(pubkey: string) {
  console.log("Testing", pubkey);
  if (nip19.BECH32_REGEX.test(pubkey)) {
    const decone = nip19.decode(pubkey);
    console.log("decone", decone);
  }
  console.log("Testing", pubkey);
  const { data: userData, isLoading } = useNostrProfile({
    pubkey: nip19.BECH32_REGEX.test(pubkey)
      ? nip19.decode(pubkey).data.toString()
      : pubkey,
  });

  return { user: userData, isLoading };
}
