"use client";
import { useProfile as useNostrProfile } from "nostr-react";

export default function useProfile(pubkey: string) {
  const { data: userData, isLoading } = useNostrProfile({
    pubkey,
  });

  return { user: userData, isLoading };
}
