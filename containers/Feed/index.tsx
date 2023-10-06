"use client";
import useEvents from "@/lib/hooks/useEvents";
import KindCard from "@/components/kindCards/1";
import { createEvent } from "@/lib/actions/create";
import { Button } from "@/components/ui/button";
import { useNostr } from "nostr-react";
import Spinner from "@/components/spinner";

// import useEvent, {
//   useEventsStore as useEvents,
// } from "@/lib/hooks/useEventsCustom";
export default function Feed() {
  const { events, isLoading } = useEvents();
  const { publish } = useNostr();
  //   useEvent();
  function handleCreateEvent() {
    void createEvent(
      {
        content: "Hello world",
        kind: 1,
        tags: [],
      },
      publish
    );
  }
  return (
    <div className="space-y-6">
      {isLoading && !events.length && (
        <div className="center">
          <Spinner />
        </div>
      )}
      {events.map((e) => {
        if (e.kind === 1) {
          return <KindCard key={e.id} {...e} />;
        }
        return null;
      })}
    </div>
  );
}
