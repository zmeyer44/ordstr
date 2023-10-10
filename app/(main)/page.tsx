"use client";
import Image from "next/image";
import KindCard from "@/components/kindCards/1";
import Link from "next/link";
import Feed from "@/containers/Feed";
import { Button } from "@/components/ui/button";
import { createEvent } from "@/lib/actions/create";
import { useNostr } from "nostr-react";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
export default function Home() {
  const { publish } = useNostr();
  const { follows } = useCurrentUser();

  return (
    <div className="py-10">
      {/* <Button
        onClick={() =>
          void createEvent(
            {
              kind: 0,
              content: JSON.stringify({
                name: "zach",
                nip05: "zach@ordstr.com",
              }),
              tags: [],
            },
            publish
          )
        }
      >
        Set metadata
      </Button> */}
      <div className="mx-auto max-w-[600px] px-4 sm:px-10 md:px-10">
        <Feed
          filter={{
            kinds: [1],
            authors: follows?.length ? follows : undefined,
          }}
        />
      </div>
    </div>
  );
}
