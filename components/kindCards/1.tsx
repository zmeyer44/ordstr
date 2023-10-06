"use client";
import { useState } from "react";
import {
  RxDotsHorizontal,
  RxThickArrowUp,
  RxThickArrowDown,
} from "react-icons/rx";
import {
  cn,
  relativeTimeUnix,
  formatCount,
  removeDuplicates,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MenuButton } from "../menuButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RenderText } from "../textRendering";
import ProfileHeader from "./components/ProfileHeader";
import { type Event } from "nostr-tools";
import useQueryParams from "@/lib/hooks/useQueryParams";

type KindCardProps = Event<number> & {
  clickable?: boolean;
};

export default function KindCard({
  pubkey,
  content,
  created_at,
  clickable,
  tags,
  kind,
}: KindCardProps) {
  const [active, setActive] = useState("UP");
  const [activeScore, setActiveScore] = useState(0);
  const { queryParams, setQueryParams } = useQueryParams<{
    t?: string | string[];
  }>();
  return (
    <Card className={cn("overflow-hidden w-full", clickable && "theme-shadow")}>
      <CardHeader className="py-2 px-3">
        <ProfileHeader pubkey={pubkey} />
      </CardHeader>

      <CardContent className="p-0 flex divide-x-2 divide-primary-foreground">
        {/* Actions */}
        <div className="w-12 shrink-0 flex items-center flex-col">
          <div className="group relative flex w-full flex-col items-stretch overflow-hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.nativeEvent.preventDefault();
              }}
              className={cn(
                active === "UP"
                  ? "text-accent-foreground hover:bg-accent/20 hover:text-accent"
                  : "text-primary-foreground hover:bg-primary/40 hover:text-cyan-300",
                "center py-3 pb-2 transition-all"
              )}
            >
              <RxThickArrowUp className="h-6 w-6 " />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.nativeEvent.preventDefault();
              }}
              className={cn(
                active === "DOWN"
                  ? "text-accent-foreground hover:bg-accent/20 hover:text-accent"
                  : "text-primary-foreground hover:bg-primary/40 hover:text-cyan-300",
                "center py-3 pt-2 transition-all"
              )}
            >
              <RxThickArrowDown className="h-6 w-6" />
            </button>
            <div className="center pointer-events-none absolute inset-x-0 top-1/2 w-full -translate-y-1/2 transform">
              <span
                className={cn(
                  active === "UP"
                    ? "text-accent-foreground group-hover:text-accent"
                    : "text-primary-foreground group-hover:text-gray-200",
                  "text-xs transition-all"
                )}
              >
                {formatCount(activeScore)}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col divide-y-2 divide-primary-foreground overflow-hidden">
          <div className="relative flex-1 p-6 pb-0 flex flex-col">
            <div className="flex-1 mb-6 bg-accent/20 border-dashed border-accent border-2 rounded-xl p-4">
              <p className="text-orange-100 text-sm break-words">
                <RenderText text={content} />
              </p>
            </div>
            <div className="w-full justify-end flex">
              <div className="mt-[-12px] flex flex-row-reverse flex-wrap gap-2 mr-[-24px] rounded-tl-md px-2 pb-2">
                {removeDuplicates(
                  tags.filter((t) => t[0] === "t").map((t) => t[1])
                ).map((t) => (
                  <Badge
                    variant={
                      queryParams.getAll("t").includes(t) ? "accent" : "default"
                    }
                    className="rounded-fll cursor-pointer font-medium"
                    onClick={() =>
                      setQueryParams((prev, obj) => {
                        if (prev.getAll("t").includes(t)) {
                          return {
                            ...obj,
                            t: [...prev.getAll("t").filter((el) => el !== t)],
                          };
                        } else {
                          if (prev.has("t")) {
                            return { ...obj, t: [...prev.getAll("t"), t] };
                          }
                          return { ...obj, t: t };
                        }
                      })
                    }
                  >
                    {`#${t}`}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between px-3 py-1.5 text-xs">
            <div className="">
              <p>{`Kind ${kind}`}</p>
              <p>{relativeTimeUnix(created_at)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
