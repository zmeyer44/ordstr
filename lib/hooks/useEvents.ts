"use client";
import { useMemo, useRef } from "react";
import { useNostrEvents } from "nostr-react";
import { nip19, type Filter } from "nostr-tools";
import { useSearchParams } from "next/navigation";
export default function useEvents() {
  const now = useRef(new Date());
  const searchParams = useSearchParams();

  const filter = useMemo<Filter>(() => {
    const buildingFilter: Filter = {
      authors: [
        "268393bb88f28f67082f366d2df275c9a6caf33202e290599d2d638d89c3f513",
        "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58",
      ],
      limit: 100,
    };
    console.log("Building filter", searchParams.toString());
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
