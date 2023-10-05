"use client";
import { useRef } from "react";
import { useNostrEvents, dateToUnix } from "nostr-react";

export default function useEvents() {
  const now = useRef(new Date());
  const { events } = useNostrEvents({
    filter: {
      since: dateToUnix(now.current),
      kinds: [1],
    },
  });

  return { events };
}
