"use client";
import { useProfile as useNostrProfile } from "nostr-react";
import { nip19 } from "nostr-tools";
export default function useProfile(pubkey: string) {
  const { data: userData, isLoading } = useNostrProfile({
    pubkey: nip19.BECH32_REGEX.test(pubkey)
      ? nip19.decode(pubkey).data.toString()
      : pubkey,
  });

  return { user: userData, isLoading };
}
