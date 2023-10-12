"use client";

import { useEffect, useState } from "react";
import { nip19 } from "nostr-tools";
import { RiLock2Line, RiCheckboxCircleLine } from "react-icons/ri";
import { HiOutlineLightningBolt } from "react-icons/hi";
import Spinner from "@/components/spinner";
import Feed from "@/containers/Feed";
import ListContainer from "@/components/listContainer";
import { Button } from "@/components/ui/button";
import { useKeys } from "@/app/_providers/keysProvider";
import EditProfile from "@/components/modals/EditProfile";
import { useModal } from "@/app/_providers/modalContext/provider";
import { Kind } from "@/lib/nostr";
import { z } from "zod";
import ListHeader from "./_components/ListHeader";
import {
  getTagsValues,
  getTagValues,
  getTagAllValues,
} from "@/lib/nostr/utils";
import { type NDKEvent } from "@nostr-dev-kit/ndk";
import useUserLists from "@/lib/hooks/useUserLists";
import CreateListEvent from "@/components/modals/CreateListEventControl";
import EditListModal from "@/components/modals/EditList";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import {
  sendZap,
  checkPayment,
  updateListUsersFromZaps,
} from "@/lib/actions/zap";
import { useNDK } from "@/app/_providers/ndkProvider";
import { toast } from "react-hot-toast";
import { btcToSats } from "@/lib/utils";

const AddrSchema = z.object({
  identifier: z.string(),
  kind: z.number(),
  pubkey: z.string(),
  relays: z.string().array().optional(),
});
type ListPageProps = {
  params: { addr: string };
};

export default function ListPageContainer({ params: { addr } }: ListPageProps) {
  const { data, type } = nip19.decode(addr);
  const addrData = AddrSchema.parse(data);
  const pubkey = addrData.pubkey;
  const { lists, isLoading } = useUserLists({
    pubkey,
    filter: {
      ["#d"]: [type === "naddr" ? data.identifier : ""],
    },
  });
  const list = lists[0];
  console.log(list);

  if (isLoading) {
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

  return <ListPage list={list} />;
}

function ListPage({ list }: { list: NDKEvent }) {
  const { currentUser } = useCurrentUser();
  const { ndk } = useNDK();
  const pubkey = list.pubkey;
  const [sendingZap, setSendingZap] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [hasValidPayment, setHasValidPayment] = useState(false);
  const [syncingUsers, setSyncingUsers] = useState(false);
  const keys = useKeys();
  const modal = useModal();
  const rawEvent = list.rawEvent();
  const isPrivate = getTagValues("private", rawEvent.tags);
  const priceInBTC = getTagValues("price", rawEvent.tags);
  const title = getTagValues("title", rawEvent.tags);
  const isMember =
    currentUser &&
    getTagsValues("p", rawEvent.tags).includes(currentUser.hexpubkey);

  useEffect(() => {
    if (!currentUser || !isPrivate) return;
    if (!isMember && !checkingPayment && !hasValidPayment) {
      void handleCheckPayment();
    }
  }, [isMember, currentUser]);

  async function handleCheckPayment() {
    setCheckingPayment(true);
    console.log("Checking payment");
    try {
      const result = await checkPayment(
        ndk!,
        list.tagId(),
        currentUser!.hexpubkey,
        rawEvent,
      );
      console.log("Payment result", result);
      if (result) {
        setHasValidPayment(true);
      }
    } catch (err) {
      console.log("error sending zap", err);
    } finally {
      setCheckingPayment(false);
    }
  }
  async function handleSendZap() {
    setSendingZap(true);
    try {
      const result = await sendZap(
        ndk!,
        btcToSats(parseFloat(priceInBTC)),
        rawEvent,
        `Access payment: ${title}`,
      );
      toast.success("Payment Sent!");
      void handleCheckPayment();
    } catch (err) {
      console.log("error sending zap", err);
    } finally {
      setSendingZap(false);
    }
  }
  async function handleSyncUsers() {
    setSyncingUsers(true);
    try {
      console.log("handleSyncUsers");
      await updateListUsersFromZaps(ndk!, list.tagId(), rawEvent);
      toast.success("Users Synced!");
    } catch (err) {
      console.log("error syncing users", err);
    } finally {
      setSyncingUsers(false);
    }
  }
  return (
    <div className="screen-container mx-auto flex flex-col items-stretch gap-x-6 gap-y-6 py-10">
      <div className="flex flex-1">
        <ListHeader
          event={rawEvent}
          actions={
            isPrivate && !isMember && !hasValidPayment
              ? [
                  {
                    element: () => (
                      <Button
                        onClick={() => void handleSendZap()}
                        size="sm"
                        className="gap-x-1.5"
                        loading={sendingZap}
                      >
                        Zap to unlock
                        <HiOutlineLightningBolt className="h-4 w-4" />
                      </Button>
                    ),
                  },
                ]
              : keys?.keys.pubkey === pubkey
              ? [
                  ...(isPrivate
                    ? [
                        {
                          element: () => (
                            <Button
                              size="sm"
                              loading={syncingUsers}
                              onClick={() => void handleSyncUsers()}
                            >
                              Sync users
                            </Button>
                          ),
                        },
                      ]
                    : []),
                  {
                    element: () => (
                      <Button
                        size="sm"
                        onClick={() =>
                          modal?.show(<CreateListEvent listEvent={rawEvent} />)
                        }
                      >
                        Add to List
                      </Button>
                    ),
                  },
                  {
                    element: () => (
                      <Button
                        size="sm"
                        variant="accent-outline"
                        onClick={() =>
                          modal?.show(<EditListModal listEvent={rawEvent} />)
                        }
                      >
                        Edit
                      </Button>
                    ),
                  },
                ]
              : []
          }
        />
      </div>
      {isPrivate && !isMember ? (
        hasValidPayment ? (
          <div className="center text-medium gap-x-4 py-4 text-center text-lg">
            <div className="center flex-col gap-y-3">
              <div className="center gap-x-2">
                <p>Payment reveived!</p>
                <RiCheckboxCircleLine className="h-6 w-6" />
              </div>
              <p>You will be added once there is a new post.</p>
            </div>
          </div>
        ) : (
          <div className="center text-medium gap-x-4 py-4 text-center text-lg">
            <div className="center gap-x-2">
              <p>This list is private</p>
              <RiLock2Line className="h-6 w-6" />
            </div>
          </div>
        )
      ) : (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-x-6 gap-y-6 sm:flex-row">
          <Feed
            filter={{
              ids: getTagsValues("e", list.tags),
            }}
          />
        </div>
      )}
    </div>
  );
}
