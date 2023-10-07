"use client";
import { useMemo, useRef } from "react";
import { useNostrEvents } from "nostr-react";
import { nip19, type Filter } from "nostr-tools";
import { useSearchParams } from "next/navigation";

type UseEventsProps = {
  filter?: Filter;
};
export default function useEvents({ filter: initialFilter }: UseEventsProps) {
  const now = useRef(new Date());
  const searchParams = useSearchParams();

  const filter = useMemo<Filter>(() => {
    const buildingFilter: Filter = {
      ...initialFilter,
      limit: 100,
    };
    if (searchParams.has("t")) {
      buildingFilter["#t"] = searchParams.getAll("t");
    }
    return buildingFilter;
  }, [searchParams]);
  const { events, isLoading } = useNostrEvents({
    filter: {
      //   since: dateToUnix(now.current),
      ...filter,
    },
  });
  // onEvent((event) => addPubkey(event.pubkey));

  return { events, isLoading };
}
