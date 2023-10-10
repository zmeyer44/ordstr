"use client";
import { useState, useEffect } from "react";
import { useLists } from "@/app/_providers/listProvider";
import { NDKFilter } from "@nostr-dev-kit/ndk";

export default function useUserLists({
  pubkey,
  filter,
}: {
  pubkey: string;
  filter?: NDKFilter;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { lists, sortedLists, sortedListWithKind, getLists } = useLists()!;

  useEffect(() => {
    setIsLoading(true);
    const sub = getLists(pubkey, filter);
    if (sub) {
      sub.on("eose", () => setIsLoading(false));
    }
    return () => {
      if (sub) {
        sub.stop();
      }
    };
  }, []);
  return { lists, sortedLists, isLoading };
}
