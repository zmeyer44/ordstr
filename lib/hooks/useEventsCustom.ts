"use client";
import { useEffect, useState } from "react";
import { Event, SimplePool } from "nostr-tools";
import { create } from "zustand";

const RELAYS = [
  "wss://nostr.pub.wellorder.net",
  "wss://nostr.drss.io",
  "wss://nostr.swiss-enigma.ch",
  "wss://relay.damus.io",
];

interface EventsState {
  events: Event[];
  addEvent: (newEvent: Event) => void;
  setEvents: (newEvents: Event[]) => void;
}

const useEventsStore = create<EventsState>()((set) => ({
  events: [],
  addEvent: (newEvent) =>
    set((state) => ({
      ...state,
      events: [...state.events, newEvent],
    })),
  setEvents: (newEvents) =>
    set((state) => ({
      ...state,
      events: newEvents,
    })),
}));

export default function useEvents() {
  const [pool, setPool] = useState<SimplePool | null>(null);
  //   const [events, setEvents] = useState<Event[]>([]);
  const { addEvent, events } = useEventsStore();

  useEffect(() => {
    const _pool = new SimplePool();
    setPool(pool);
    console.log("Set pool", pool);

    return () => {
      _pool.close(RELAYS);
    };
  }, []);

  useEffect(() => {
    if (!pool) return;
    const sub = pool.sub(RELAYS, [
      {
        kinds: [1],
        limit: 50,
      },
    ]);
    sub.on("event", (event: Event) => {
      console.log("#etwt");
      console.log("Adding", event);
      addEvent(event);
    });
    return () => {
      //   sub.unsub();
    };
  }, [events, pool]);
}

export { useEventsStore };
