"use client";
import useEvents from "@/lib/hooks/useEvents";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { truncateText } from "@/lib/utils";
import { nip19, type Event } from "nostr-tools";
import Spinner from "../spinner";
import { getTagValues } from "@/lib/nostr/utils";
import { RxChevronRight } from "react-icons/rx";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import useProfile from "@/lib/hooks/useProfile";

type ListContainerProps = {
  pubkey: string;
};
export default function ListContainer({ pubkey }: ListContainerProps) {
  const { user } = useProfile(pubkey);

  const npub = nip19.npubEncode(pubkey);
  const { events, isLoading } = useEvents({
    filter: {
      kinds: [30001],
      authors: [pubkey],
    },
  });
  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>{`${
          user?.display_name ?? user?.name ?? truncateText(npub)
        }'s Lists`}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <>
          {isLoading && (
            <div className="center py-5">
              <Spinner />
            </div>
          )}
          <ul className="divide-y">
            {events.map((e) => (
              <EventListItem event={e} />
            ))}
          </ul>
        </>
      </CardContent>
    </Card>
  );
}

type EventListItemProps = {
  event: Event<number>;
};
function EventListItem({ event }: EventListItemProps) {
  const name = getTagValues("name", event.tags);
  const description = getTagValues("description", event.tags);
  const picture = getTagValues("picture", event.tags);
  const identifier = getTagValues("d", event.tags);
  const addressPointer: nip19.AddressPointer = {
    identifier: identifier,
    pubkey: event.pubkey,
    kind: 30001,
  };
  const naddr = nip19.naddrEncode(addressPointer);
  return (
    <li className="relative flex justify-between gap-x-6 px-3 py-3 @container hover:bg-accent/20">
      <div className="flex min-w-0 flex-1 items-center gap-x-2.5">
        <Avatar className="h-[30px] w-[30px] rounded-md border bg-accent/60">
          <AvatarImage className="bg-transparent" src={picture} />
          <AvatarFallback className="bg-transparent text-[11px] uppercase leading-5">
            {name.at(0)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold  text-primary-foreground">
            <Link href={`/list/${naddr}`}>
              <span className="absolute inset-x-0 -top-px bottom-0" />
              {name}
            </Link>
          </p>
          <p className="flex text-xs text-primary">{description}</p>
        </div>
        <div className="center ml-auto">
          <RxChevronRight
            className="h-5 w-5 flex-none text-accent-foreground"
            aria-hidden="true"
          />
        </div>
      </div>
      {/* <div className="flex shrink-0 items-center gap-x-4">
        <div className="flex flex-col items-end">

          <p className="mt-1 text-xs leading-5 text-accent">
            Last seen 12 items
          </p>
        </div>
        <RxChevronRight
          className="h-5 w-5 flex-none text-gray-400"
          aria-hidden="true"
        />
      </div> */}
    </li>
  );
}
