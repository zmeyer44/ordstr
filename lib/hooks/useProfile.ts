"use client";
import { useProfile as useNostrProfile } from "nostr-react";

export default function useProfile(pubkey: string) {
  const {
    data: userData,
    isLoading,
    onDone,
  } = useNostrProfile({
    pubkey,
  });
  console.log("Called with ", pubkey, isLoading);
  onDone(() => console.log("Done"));

  return { user: userData, isLoading };
}
