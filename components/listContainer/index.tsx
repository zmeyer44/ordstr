"use client";
import { useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { truncateText } from "@/lib/utils";
import { nip19 } from "nostr-tools";
import Spinner from "../spinner";
import { getTagValues } from "@/lib/nostr/utils";
import { RxChevronRight, RxPlus } from "react-icons/rx";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import useProfile from "@/lib/hooks/useProfile";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import CreateList from "@/components/modals/CreateList";
import { useModal } from "@/app/_providers/modalContext/provider";
import useUserLists from "@/lib/hooks/useUserLists";
import { NostrEvent } from "@nostr-dev-kit/ndk";
import { Kind } from "@/lib/nostr";

type ListContainerProps = {
  pubkey: string;
};
export default function ListContainer({ pubkey }: ListContainerProps) {
  const modal = useModal();
  const { user } = useProfile(pubkey);
  const { currentUser } = useCurrentUser();
  const npub = nip19.npubEncode(pubkey);
  const { sortedLists, isLoading } = useUserLists({
    pubkey,
  });

  return (
    <Card className="bg-background">
      <CardHeader className="flex h-[43px] flex-row items-center justify-between space-y-0 py-2">
        <CardTitle>{`${
          user?.display_name ?? user?.name ?? truncateText(npub)
        }'s Lists`}</CardTitle>
        {currentUser?.pubkey === pubkey && (
          <button
            onClick={() => modal?.show(<CreateList />)}
            className="center  -mr-2 h-[30px] w-[30px] rounded-full hover:bg-accent/20"
          >
            <RxPlus className="h-5 w-5" />
          </button>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <>
          <ul className="divide-y">
            {sortedLists
              .filter((l) => l.kind === Kind.GenericList)
              .map((e) => (
                <EventListItem key={e.id} event={e.rawEvent()} />
              ))}
          </ul>
          {!isLoading && sortedLists.length === 0 && (
            <div className="center py-3 text-sm text-primary">
              <p className="">No lists found</p>
            </div>
          )}
          {isLoading && (
            <div className="center py-5">
              <Spinner />
            </div>
          )}
        </>
      </CardContent>
    </Card>
  );
}

type EventListItemProps = {
  event: NostrEvent;
};
function EventListItem({ event }: EventListItemProps) {
  const name =
    getTagValues("name", event.tags) ?? getTagValues("title", event.tags);
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
            {name?.at(0)}
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
