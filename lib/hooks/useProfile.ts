"use client";
import { useProfile as useNostrProfile } from "nostr-react";
import { nip19 } from "nostr-tools";
import { NOSTR_BECH32_REGEXP } from "@/lib/nostr/utils";
export default function useProfile(pubkey: string, test?: string) {
  // if (nip19.BECH32_REGEX.test(pubkey) && pubkey.startsWith("n")) {
  //   const decone = nip19.decode(pubkey);
  //   console.log("decone", decone);
  //   pubkey = decone.data.toString();
  // }'
  if (NOSTR_BECH32_REGEXP.test(pubkey)) {
    pubkey = nip19.decode(pubkey).data.toString();
  }
  const { data: userData, isLoading } = useNostrProfile({
    pubkey: pubkey ?? "",
    enabled: !!pubkey && !NOSTR_BECH32_REGEXP.test(pubkey),
  });

  return { user: userData, isLoading };
}
