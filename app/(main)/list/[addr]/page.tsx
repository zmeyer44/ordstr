"use client";

import { useEffect, useState } from "react";
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
import { useLists } from "@/app/_providers/listProvider";
import { NDKList, NDKUser } from "@nostr-dev-kit/ndk";

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
  const [loading, setLoading] = useState(false);
  const { data } = nip19.decode(addr);
  const addrData = AddrSchema.parse(data);
  const { lists, getLists } = useLists()!;
  const pubkey = addrData.pubkey;
  useEffect(() => {
    setLoading(true);
    const sub = getLists(pubkey);
    if (sub) {
      sub.on("eose", () => setLoading(false));
    }
    return () => {
      if (sub) {
        sub.stop();
      }
    };
  }, []);
  const keys = useKeys();
  const modal = useModal();
  const list = lists.get(
    `${addrData.kind}:${addrData.pubkey}:${addrData.identifier}`,
  );

  if (loading) {
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
        <p>{JSON.stringify(lists.size)}</p>
      </div>
    );
  }
  const rawEvent = list.rawEvent();

  return (
    <div className="screen-container mx-auto flex flex-col items-stretch gap-x-6 gap-y-6 py-10">
      <div className="flex flex-1">
        <ListHeader
          event={rawEvent}
          actions={
            keys?.keys.pubkey === pubkey
              ? [
                  {
                    element: () => (
                      <Button size="sm" onClick={() => modal?.show(<div />)}>
                        Add to List
                      </Button>
                    ),
                  },
                ]
              : []
          }
        />
      </div>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-x-6 gap-y-6 sm:flex-row">
        <Feed
          filter={{
            ids: getTagsValues("e", list.tags),
          }}
        />
      </div>
    </div>
  );
}
