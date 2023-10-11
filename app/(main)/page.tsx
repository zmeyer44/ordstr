"use client";
import Image from "next/image";
import KindCard from "@/components/kindCards/1";
import Link from "next/link";
import Feed from "@/containers/Feed";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { unixTimeNowInSeconds } from "@/lib/nostr/dates";
export default function Home() {
  const { follows } = useCurrentUser();

  return (
    <div className="py-10">
      <div className="mx-auto max-w-[600px] px-4 sm:px-10 md:px-10">
        <Feed
          filter={{
            kinds: [1],
            authors: follows?.length ? follows : undefined,
            until: unixTimeNowInSeconds(),
          }}
        />
      </div>
    </div>
  );
}
