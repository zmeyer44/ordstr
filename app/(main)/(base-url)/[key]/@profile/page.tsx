"use client";
import MediumProfileCard from "@/components/profileCards/MediumCard";
import Link from "next/link";
import { toast } from "react-hot-toast";
import useProfile from "@/lib/hooks/useProfile";
import { nip19 } from "nostr-tools";
import Spinner from "@/components/spinner";
import Feed from "@/containers/Feed";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type ProfilePageProps = {
  params: { key: string };
};

export default function ProfilePage({ params: { key } }: ProfilePageProps) {
  const { data, type } = nip19.decode(key);
  console.log("nip data", data.toString(), type);

  const { user } = useProfile(data.toString());

  return (
    <div className="screen-container mx-auto flex flex-col items-stretch gap-x-6 gap-y-6 py-10">
      <div className="flex flex-1">
        <MediumProfileCard pubkey={key} user={user} />
      </div>
      <div className="flex gap-x-6">
        <div className="flex-3 flex overflow-x-hidden">
          <Feed
            filter={{
              authors: [data.toString()],
            }}
          />
        </div>
        <div className="sticky top-0 hidden h-[100svh] min-w-[270px] flex-1 shrink-0 sm:block">
          <Card className="sticky top-[128px]">
            <CardHeader>
              <CardTitle>My Lists</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">list</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
