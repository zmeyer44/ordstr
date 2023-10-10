"use client";
import MediumProfileCard from "@/components/profileCards/MediumCard";
import Link from "next/link";
import { toast } from "react-hot-toast";
import useProfile from "@/lib/hooks/useProfile";
import { nip19 } from "nostr-tools";
import Spinner from "@/components/spinner";
import Feed from "@/containers/Feed";
import ListContainer from "@/components/listContainer";
import { Button } from "@/components/ui/button";
import { useKeys } from "@/app/_providers/keysProvider";
import EditProfile from "@/components/modals/EditProfile";
import { useModal } from "@/app/_providers/modalContext/provider";

type ProfilePageProps = {
  params: { key: string };
};

export default function ProfilePage({ params: { key } }: ProfilePageProps) {
  const { data, type } = nip19.decode(key);
  const keys = useKeys();
  const modal = useModal();
  console.log("nip data", data.toString(), type);
  const pubkey = data.toString();

  const { user } = useProfile(pubkey);

  return (
    <div className="screen-container mx-auto flex flex-col items-stretch gap-x-6 gap-y-6 py-10">
      <div className="flex flex-1">
        <MediumProfileCard
          pubkey={pubkey}
          user={user}
          actions={
            keys?.keys.pubkey === pubkey
              ? [
                  {
                    element: () => (
                      <Button
                        size="sm"
                        onClick={() => modal?.show(<EditProfile user={user} />)}
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
      <div className="flex flex-col gap-x-6 gap-y-6 sm:flex-row">
        <div className="sm:hidden">
          <ListContainer pubkey={pubkey} />
        </div>
        <div className="flex-3 flex overflow-x-hidden">
          <Feed
            filter={{
              authors: [pubkey],
            }}
          />
        </div>
        <div className="sticky top-0 hidden h-[100svh] min-w-[270px] flex-1 shrink-0 sm:block">
          <div className="sticky top-[128px]">
            <ListContainer pubkey={pubkey} />
          </div>
        </div>
      </div>
    </div>
  );
}
