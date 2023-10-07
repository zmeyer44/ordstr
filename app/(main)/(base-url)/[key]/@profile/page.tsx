"use client";
import MediumProfileCard from "@/components/profileCards/MediumCard";
import Link from "next/link";
import { toast } from "react-hot-toast";
import useProfile from "@/lib/hooks/useProfile";
import { nip19 } from "nostr-tools";
import Spinner from "@/components/spinner";
import Feed from "@/containers/Feed";

type ProfilePageProps = {
  params: { key: string };
};

export default function ProfilePage({ params: { key } }: ProfilePageProps) {
  const { data } = nip19.decode(key);
  console.log("nip data", data.toString());

  const { user } = useProfile(data.toString());

  return (
    <div className="flex flex-col items-center justify-between screen-container gap-y-6 py-10">
      <MediumProfileCard pubkey={key} user={user} />
      <Feed
        filter={{
          authors: [data.toString()],
        }}
      />
    </div>
  );
}
