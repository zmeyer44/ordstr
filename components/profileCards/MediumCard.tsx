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
  console.log("USer", user);
  const [showFaviconImage, setShowFaviconImage] = useState(true);
  return (
    <Card className="rounded-xl w-full @container flex">
      <div className="relative max-h-[150px] overflow-hidden">
        <div className="relative bg-background pb-[80px] sm:pb-[18%]">
          <div className="absolute inset-0 max-h-[150px] bg-accent/40"></div>
        </div>
      </div>
      <div className="border-t-2 relative mt-[-1px] bg-background font-title text-primary-foreground">
        {/* Top Row */}
        <div className="flex items-start pb-[5px] lg:pb-[8px]">
          {/* PFP */}
          <div className="ml-[10px] mb-[1px] mt-[-40px] sm:mt-[-45px] sm:ml-[16px] md:ml-[24px] md:mt-[-50px] lg:mt-[-85px] xl:mt-[-95px]">
            <div className="relative aspect-square w-[70px] overflow-hidden rounded-full bg-background sm:w-[75px] md:w-[100px] lg:w-[170px] xl:w-[190px]">
              <Avatar className="border-2 h-full w-full bg-accent/60">
                <AvatarImage className="bg-transparent" src={user?.picture} />
                <AvatarFallback className="bg-transparent text-[24px] md:text-[32px] leading-5 uppercase">
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
        <div className="space-y-3.5 lg:space-y-5 p-4 pt-0 sm:p-6 sm:pt-0 md:p-7 md:pt-2">
          {/* User Top Line Info */}
          <div className="md:space-y-1.5 lg:space-y-2">
            <div className="flex items-end gap-x-3">
              <h1 className=" break-all text-2xl font-semibold text-text-strong line-clamp-1 lg:text-3xl">
                {user?.display_name ?? user?.name ?? truncateText(pubkey)}
              </h1>

              {!!user?.nip05 && (
                <div className="center gap-x-2">
                  <span className="mb-1 text-sm font-light text-accent lg:text-[16px]">
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
            </div>
            <div className="">
              <button
                className="flex items-center break-all text-sm font-light text-text transition-colors hover:text-accent lg:text-[16px]"
                onClick={() => {
                  void copyText(pubkey);
                  toast.success(`Copied npub`);
                }}
              >
                <p className="flex items-center break-all  line-clamp-1 ">
                  {truncateText(pubkey, 5)}
                </p>
                <MdContentCopy className="ml-1.5 h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* About */}
          <div className="max-w-lg md:w-3/4 lg:max-w-3xl">
            <p className="text-[14px] font-light text-text-strong lg:text-[15px]">
              <RenderText text={user?.about ?? ""} />
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
