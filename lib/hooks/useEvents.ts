"use client";
import { useMemo, useRef } from "react";
import { useNostrEvents } from "nostr-react";
import { nip19, type Filter } from "nostr-tools";
import { useSearchParams } from "next/navigation";
import { unixTimeNowInSeconds } from "@/lib/nostr/dates";
type UseEventsProps = {
  filter?: Filter;
};
export default function useEvents({ filter: initialFilter }: UseEventsProps) {
  const searchParams = useSearchParams();

  const filter = useMemo<Filter>(() => {
    const buildingFilter: Filter = {
      limit: 50,
      until: unixTimeNowInSeconds(),
      ...initialFilter,
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
