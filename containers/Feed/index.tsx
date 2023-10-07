"use client";
import useEvents from "@/lib/hooks/useEvents";
import KindCard from "@/components/kindCards/1";
import DefaultKindCard from "@/components/kindCards/default";
import { createEvent } from "@/lib/actions/create";
import { Button } from "@/components/ui/button";
import { useNostr } from "nostr-react";
import Spinner from "@/components/spinner";
import { type Filter } from "nostr-tools";

// import useEvent, {
//   useEventsStore as useEvents,
// } from "@/lib/hooks/useEventsCustom";

type FeedProps = {
  filter?: Filter;
};
export default function Feed({ filter }: FeedProps) {
  const { events, isLoading } = useEvents({ filter });

  return (
    <div className="space-y-6 w-full">
      {isLoading && !events.length && (
        <div className="center">
          <Spinner />
        </div>
      )}
      {events.map((e) => {
        if (e.kind === 1) {
          return <KindCard key={e.id} {...e} />;
        }
        return <DefaultKindCard key={e.id} {...e} />;
      })}
    </div>
  );
}
