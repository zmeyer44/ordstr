"use client";
import { useState } from "react";
import Image from "next/image";
import { RxDotsHorizontal } from "react-icons/rx";
import useProfile from "@/lib/hooks/useProfile";
import { MenuButton } from "@/components/menuButton";
import { CardTitle } from "@/components/ui/card";
import { truncateText } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { nip19 } from "nostr-tools";

type ProfileHeaderProps = {
  pubkey: string;
  actions: {
    label: string;
    className?: string | undefined;
    onSelect: () => void;
  }[];
};

export default function ProfileHeader({ pubkey, actions }: ProfileHeaderProps) {
  const { user } = useProfile(pubkey);
  const npub = nip19.npubEncode(pubkey);
  const [showFaviconImage, setShowFaviconImage] = useState(true);

  return (
    <div className="flex items-center justify-between @container">
      <div className="flex flex-1 items-center gap-x-2 pr-3">
        <Avatar className="h-[25px] w-[25px] border bg-accent/60">
          <AvatarImage className="bg-transparent" src={user?.picture} />
          <AvatarFallback className="bg-transparent text-[11px] uppercase leading-5">
            {user?.display_name?.at(0) ?? user?.name?.at(0) ?? npub.at(5)}
          </AvatarFallback>
        </Avatar>
        <Link href={`/${npub}`} className="flex items-center hover:underline">
          <CardTitle className="line-clamp-1 break-all font-normal leading-normal tracking-normal text-primary-foreground/80">
            {user?.display_name ?? user?.name ?? truncateText(npub)}
          </CardTitle>
          {!!user?.nip05 && (
            <div className="center ml-1.5 gap-x-1">
              <span className="text-xs font-light text-accent @lg:text-sm">
                {user.nip05}
              </span>
              {showFaviconImage && (
                <Image
                  alt={user.nip05.split("@").at(-1) as string}
                  src={`https://www.google.com/s2/favicons?domain=${user.nip05
                    .split("@")
                    .at(-1)}&size=128`}
                  height={16}
                  width={16}
                  className="rounded-sm object-contain"
                  onError={() => setShowFaviconImage(false)}
                />
              )}
            </div>
          )}
        </Link>
      </div>
      <div className="shrink-0">
        <MenuButton align="end" options={actions}>
          <button className="center text-primary-foreground hover:text-accent">
            <RxDotsHorizontal className="h-5 w-5" />
          </button>
        </MenuButton>
      </div>
    </div>
  );
}
