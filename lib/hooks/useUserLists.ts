"use client";
import { useState, useEffect } from "react";
import { useLists } from "@/app/_providers/listProvider";
import { NDKFilter } from "@nostr-dev-kit/ndk";
import useEvents from "@/lib/hooks/useEvents";

export default function useUserLists({
  pubkey,
  filter,
}: {
  pubkey: string;
  filter?: NDKFilter;
}) {
  console.log(filter);
  // const { lists, sortedLists, sortedListWithKind, getLists } = useLists()!;
  const { events: lists, isLoading } = useEvents({
    filter: {
      kinds: [30001],
      authors: [pubkey],
      ...filter,
    },
  });

  return { lists, isLoading };
}
