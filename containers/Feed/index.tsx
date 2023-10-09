"use client";
import useEvents from "@/lib/hooks/useEvents";
import KindCard from "@/components/kindCards/1";
import DefaultKindCard from "@/components/kindCards/default";
import { createEvent } from "@/lib/actions/create";
import { Button } from "@/components/ui/button";
import { useNostr } from "nostr-react";
import { cn } from "@/lib/utils";
import Spinner from "@/components/spinner";
import { type Filter } from "nostr-tools";

// import useEvent, {
//   useEventsStore as useEvents,
// } from "@/lib/hooks/useEventsCustom";

type FeedProps = {
  filter?: Filter;
  className?: string;
};
export default function Feed({ filter, className }: FeedProps) {
  const { events, isLoading } = useEvents({ filter });

  // return (
  //   <div className="center w-full bg-red-500">
  //     <div className="center">
  //       <Spinner />
  //     </div>
  //   </div>
  // );

  return (
    <div className={cn("w-full space-y-6", className)}>
      {isLoading && !events.length && (
        <div className="center flex-col gap-y-4 pt-10">
          <Spinner />
          <p className="font-medium text-primary">Fetching notes</p>
        </div>
      )}
      {events.map((e) => {
        if (e.kind === 1) {
          return <KindCard key={e.id} {...e} />;
        }
        // return null;
        return <DefaultKindCard key={e.id} {...e} />;
      })}
    </div>
  );
  return (
    <div className={cn("w-full space-y-6", className)}>
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
