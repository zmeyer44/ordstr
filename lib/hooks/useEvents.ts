"use client";
import { useRef } from "react";
import { useNostrEvents, dateToUnix } from "nostr-react";

export default function useEvents() {
  const now = useRef(new Date());
  const { events } = useNostrEvents({
    filter: {
      //   since: dateToUnix(now.current),
      kinds: [1],
      limit: 100,
      "#t": ["jets"],
    },
  });
  // onEvent((event) => addPubkey(event.pubkey));

  return { events };
}
