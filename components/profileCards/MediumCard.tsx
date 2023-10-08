"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Card, CardTitle } from "@/components/ui/card";
import useProfile from "@/lib/hooks/useProfile";
import { MdContentCopy } from "react-icons/md";
import { toast } from "react-hot-toast";
import { copyText, truncateText } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/types";
import { RenderText } from "../textRendering";

type MediumCardProps = {
  pubkey: string;
  user?: User;
};

export default function MediumCard({ pubkey, user }: MediumCardProps) {
  console.log("MediumCard", user);
  const [showFaviconImage, setShowFaviconImage] = useState(true);
  return (
    <Card className="relative w-full rounded-xl @container">
      {/* <div className="absolute left-0 top-0 z-50">
        <div className="h-4 w-4 bg-red-300 @sm:hidden" />
        <div className="hidden h-4 w-4 bg-purple-300 @sm:block" />
        <div className="hidden h-4 w-4 bg-blue-300 @md:block" />
        <div className="hidden h-4 w-4 bg-green-300 @lg:block" />
        <div className="hidden h-4 w-4 bg-yellow-300 @xl:block" />
      </div> */}
      <div className="relative max-h-[150px] overflow-hidden">
        <div className="relative bg-background pb-[80px] @md:pb-[20%]">
          <div className="absolute inset-0 max-h-[150px] bg-accent/40"></div>
        </div>
      </div>
      <div className="font-title relative mt-[-1px] border-t-2 bg-background text-primary-foreground">
        {/* Top Row */}
        <div className="flex items-start pb-[5px] @lg:pb-[6px]">
          {/* PFP */}
          <div className="mb-[1px] ml-[10px] mt-[-40px] @sm:ml-[16px] @sm:mt-[-40px] @md:ml-[24px] @md:mt-[-47px] @lg:mt-[-50px] @2xl:mt-[-65px]">
            <div className="relative aspect-square w-[70px] overflow-hidden rounded-full bg-background @sm:w-[75px] @md:w-[90px] @lg:w-[100px] @2xl:w-[120px]">
              <Avatar className="h-full w-full border-2 bg-accent/60">
                <AvatarImage className="bg-transparent" src={user?.picture} />
                <AvatarFallback className="bg-transparent text-[24px] uppercase leading-5 @md:text-[32px]">
                  {user?.display_name
                    ? user.display_name.at(0)
                    : user?.name?.at(0) ?? pubkey.at(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-x-3 py-2">
            {/* {sessionData?.user?.ordinalsAddress === user.ordinalsAddress ? (
                <Link
                  href="/settings/profile"
                  className="relative flex cursor-pointer items-center gap-x-2 rounded-md border-foreground bg-foreground px-3 py-1 transition-all hover:bg-foreground-hover"
                >
                  <MdEdit className="h-4 w-4" /> Edit
                  {!user.displayName && (
                    <div className="absolute inset-0 animate-ping rounded-md bg-text" />
                  )}
                </Link>
              ) : null} */}
            <div className="rounded-md bg-foreground">
              {/* <ShareButton ordinalsAddress={user.ordinalsAddress} /> */}
            </div>
          </div>
        </div>
        <div className="space-y-3.5 p-4 pt-0 @sm:p-6 @sm:pt-0 @md:p-6 @md:pt-2 @lg:space-y-5">
          {/* User Top Line Info */}
          <div className="@lg:space-y-1.5">
            <div className="flex items-end gap-x-3 truncate">
              <h1 className="text-lg font-semibold @md:text-xl  @lg:text-2xl">
                {user?.display_name ?? user?.name ?? truncateText(pubkey)}
              </h1>

              {!!user?.nip05 && (
                <div className="center gap-x-2">
                  <span className="mb-1 truncate text-sm font-light text-accent @lg:text-[16px]">
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
                      className="shrink-0 rounded-sm object-contain"
                      onError={() => setShowFaviconImage(false)}
                    />
                  )}
                </div>
              )}
            </div>
            <div className="">
              <button
                className="flex items-center text-xs font-light transition-colors hover:text-accent @sm:text-sm @lg:text-[16px]"
                onClick={() => {
                  void copyText(pubkey);
                  toast.success(`Copied npub`);
                }}
              >
                <p className="line-clamp-1 flex items-center  break-all ">
                  {truncateText(pubkey, 5)}
                </p>
                <MdContentCopy className="ml-1.5 h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* About */}
          <div className="max-w-lg @lg:max-w-3xl">
            <p className="text-text-strong text-[14px] font-light @lg:text-[15px]">
              <RenderText text={user?.about ?? ""} />
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
