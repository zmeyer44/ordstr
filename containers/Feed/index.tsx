"use client";
import useEvents from "@/lib/hooks/useEvents";
import KindCard from "@/components/kindCards/1";
// import useEvent, {
//   useEventsStore as useEvents,
// } from "@/lib/hooks/useEventsCustom";
export default function Feed() {
  const { events } = useEvents();
  //   useEvent();
  return (
    <div className="space-y-6">
      {events.map((e) => {
        if (e.kind === 1) {
          return <KindCard key={e.id} {...e} />;
        }
        return null;
      })}
    </div>
  );
}
