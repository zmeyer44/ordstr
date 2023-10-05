"use client";
import useEvents from "@/lib/hooks/useEvents";
import KindCard from "@/components/kindCards/1";
export default function Feed() {
  const { events } = useEvents();
  return (
    <div className="space-y-6">
      {events.map((e) => (
        <KindCard
          key={e.id}
          content={e.content}
          title={e.pubkey}
          timestamp={e.created_at}
        />
      ))}
    </div>
  );
}
