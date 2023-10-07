"use client";
import { RxDotsHorizontal } from "react-icons/rx";
import useProfile from "@/lib/hooks/useProfile";
import { MenuButton } from "@/components/menuButton";
import { CardTitle } from "@/components/ui/card";
import { truncateText } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export default function ProfileHeader({ pubkey }: { pubkey: string }) {
  const { user } = useProfile(pubkey);
  return (
    <div className="flex justify-between items-center">
      <div className="flex-1 flex items-center gap-x-2 pr-3">
        <Avatar className="border h-[25px] w-[25px] bg-accent/60">
          <AvatarImage className="bg-transparent" src={user?.picture} />
          <AvatarFallback className="bg-transparent text-[11px] leading-5 uppercase">
            {user?.display_name ? user?.display_name.at(0) : pubkey.at(0)}
          </AvatarFallback>
        </Avatar>
        <Link href={`/${pubkey}`} className="hover:underline">
          <CardTitle className="font-normal text-primary-foreground/80 tracking-normal line-clamp-1 break-all">
            {user?.display_name ?? truncateText(pubkey)}
          </CardTitle>
        </Link>
      </div>
      <div className="shrink-0">
        <MenuButton
          align="end"
          options={[
            {
              label: "View profile",
              onSelect: () => {
                console.log("Report");
              },
            },
            {
              label: "Report",
              onSelect: () => {
                console.log("Report");
              },
            },
          ]}
        >
          <button className="text-primary-foreground hover:text-accent center">
            <RxDotsHorizontal className="h-5 w-5" />
          </button>
        </MenuButton>
      </div>
    </div>
  );
}
