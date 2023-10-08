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
    <div className="flex justify-between items-center">
      <div className="flex-1 flex items-center gap-x-2 pr-3">
        <Avatar className="border h-[25px] w-[25px] bg-accent/60">
          <AvatarImage className="bg-transparent" src={user?.picture} />
          <AvatarFallback className="bg-transparent text-[11px] leading-5 uppercase">
            {user?.display_name ? user?.display_name.at(0) : npub.at(5)}
          </AvatarFallback>
        </Avatar>
        <Link href={`/${npub}`} className="hover:underline flex items-center">
          <CardTitle className="font-normal text-primary-foreground/80 tracking-normal line-clamp-1 break-all">
            {user?.display_name ?? truncateText(npub)}
          </CardTitle>
          {!!user?.nip05 && (
            <div className="ml-1.5 center gap-x-1">
              <span className="text-xs font-light text-accent lg:text-[16px]">
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
          <button className="text-primary-foreground hover:text-accent center">
            <RxDotsHorizontal className="h-5 w-5" />
          </button>
        </MenuButton>
      </div>
    </div>
  );
}
