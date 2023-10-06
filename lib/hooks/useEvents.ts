"use client";
import { useMemo, useRef } from "react";
import { useNostrEvents } from "nostr-react";
import { nip19, type Filter } from "nostr-tools";
import { useSearchParams } from "next/navigation";
export default function useEvents() {
  const now = useRef(new Date());
  const searchParams = useSearchParams();
  const convert = nip19.npubEncode(
    "8bbe5ab3a98b2b1841052707f374e35016edcb28cac9224f512829824b63627e"
  );
  console.log("CONVERT", convert);
  const decone = nip19.decode(
    "npub1zach44xjpc4yyhx6pgse2cj2pf98838kja03dv2e8ly8lfr094vqvm5dy5"
  );
  console.log("CONVERT", decone);

  const filter = useMemo<Filter>(() => {
    const buildingFilter: Filter = { kinds: [1], limit: 100 };
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
