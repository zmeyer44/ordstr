"use client";
import MediumProfileCard from "@/components/profileCards/MediumCard";
import Link from "next/link";
import { toast } from "react-hot-toast";
import useProfile from "@/lib/hooks/useProfile";
import { nip19 } from "nostr-tools";
import Spinner from "@/components/spinner";

type ProfilePageProps = {
  params: { key: string };
};

export default function ProfilePage({ params: { key } }: ProfilePageProps) {
  const { data } = nip19.decode(
    "npub1zach44xjpc4yyhx6pgse2cj2pf98838kja03dv2e8ly8lfr094vqvm5dy5"
  );
  console.log("nip data", data);
  const { user, isLoading } = useProfile(data);
  if (isLoading) {
    return (
      <div className="py-10 center w-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between screen-container gap-y-4 py-10">
      <MediumProfileCard pubkey={key} user={user} />
    </div>
  );
}
