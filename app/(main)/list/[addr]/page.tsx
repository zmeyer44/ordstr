"use client";

import { useEffect, useState } from "react";
import MediumProfileCard from "@/components/profileCards/MediumCard";
import Link from "next/link";
import { toast } from "react-hot-toast";
import useProfile from "@/lib/hooks/useProfile";
import { nip19, type Event } from "nostr-tools";
import Spinner from "@/components/spinner";
import Feed from "@/containers/Feed";
import ListContainer from "@/components/listContainer";
import { Button } from "@/components/ui/button";
import { useKeys } from "@/app/_providers/keysProvider";
import EditProfile from "@/components/modals/EditProfile";
import { useModal } from "@/app/_providers/modalContext/provider";
import { useNostrEvents } from "nostr-react";
import { Kind } from "@/lib/nostr";
import { z } from "zod";
import ListHeader from "./_components/ListHeader";
import { getTagsValues, getTagValues } from "@/lib/nostr/utils";
const AddrSchema = z.object({
  identifier: z.string(),
  kind: z.number(),
  pubkey: z.string(),
  relays: z.string().array().optional(),
});
type ListPageProps = {
  params: { addr: string };
};

export default function ListPage({ params: { addr } }: ListPageProps) {
  const [mounted, setMounted] = useState(false);
  const { data, type } = nip19.decode(addr);
  // console.log("decode", data, type);
  const addrData = AddrSchema.parse(data);
  const identifier = addrData.identifier;
  const pubkey = addrData.pubkey;
  const keys = useKeys();
  const modal = useModal();
  const [list, setList] = useState<Event<number> | null>(null);

  const { isLoading: loadingList, onEvent } = useNostrEvents({
    filter: {
      kinds: [30001],
      authors: [pubkey],
      ["#d"]: [identifier],
    },
  });
  useEffect(() => {
    setMounted(true);
  }, []);
  onEvent((event) => {
    console.log("EVENT received!", event);
    setList(event);
  });

  if (loadingList) {
    return (
      <div className="center py-10">
        <Spinner />
      </div>
    );
  }
  if (!list) {
    return (
      <div className="center py-10">
        <p>No list found</p>
      </div>
    );
  }
  return (
    <div className="screen-container mx-auto flex flex-col items-stretch gap-x-6 gap-y-6 py-10">
      <div className="flex flex-1">
        <ListHeader event={list} />
      </div>
      <div className="mx-auto flex max-w-xl flex-col gap-x-6 gap-y-6 sm:flex-row">
        <Feed
          filter={{
            ids: getTagsValues("e", list.tags),
          }}
        />
      </div>
    </div>
  );
}
