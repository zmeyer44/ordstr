"use client";
import KindCard from "@/components/kindCards";
import { cn } from "@/lib/utils";
import Spinner from "@/components/spinner";
import { Event } from "nostr-tools";
import useEvents from "@/lib/hooks/useEvents";
import { type NDKFilter } from "@nostr-dev-kit/ndk";
type FeedProps = {
  filter?: NDKFilter;
  className?: string;
};
export default function Feed({ filter, className }: FeedProps) {
  // const { events, isLoading } = useEvents({ filter });
  const { events, isLoading } = useEvents({
    filter: { ...filter },
  });
  // return null;
  return (
    <div className={cn("w-full space-y-6", className)}>
      {!events.length &&
        (isLoading ? (
          <div className="center flex-col gap-y-4 pt-10">
            <Spinner />
            <p className="font-medium text-primary">Fetching notes...</p>
          </div>
        ) : (
          <div className="center flex-col gap-y-4 pt-10">
            <p className="font-medium text-primary">No notes found</p>
          </div>
        ))}
      {events.map((e) => {
        const event = e.rawEvent() as Event;
        return <KindCard key={e.id} {...event} />;
      })}
    </div>
  );
}
