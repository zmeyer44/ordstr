"use client";
import { useState, useRef, useEffect } from "react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { RenderText } from "../textRendering";
import ProfileHeader from "./components/ProfileHeader";
import { type Event } from "nostr-tools";
import useQueryParams from "@/lib/hooks/useQueryParams";
import { copyText } from "@/lib/utils";

type KindCardProps = Event<number> & {
  clickable?: boolean;
};

export default function KindCard({ clickable, ...props }: KindCardProps) {
  const { pubkey, content, created_at, tags, kind } = props;
  const [active, setActive] = useState("UP");
  const [activeScore, setActiveScore] = useState(0);
  const [showFull, setShowFull] = useState(false);
  const [expandButton, setExpandButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { queryParams, setQueryParams } = useQueryParams<{
    t?: string | string[];
  }>();

  useEffect(() => {
    if (contentRef.current) {
      if (contentRef.current.scrollHeight > 350) {
        setExpandButton(true);
      }
    }
  }, [contentRef.current]);
  return (
    <Card className={cn("w-full overflow-hidden", clickable && "theme-shadow")}>
      <CardHeader className="px-3 py-2">
        <ProfileHeader
          pubkey={pubkey}
          actions={[
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
            {
              label: "Copy raw data",
              onSelect: () => {
                void copyText(JSON.stringify(props));
                toast.success("Copied Text!");
              },
            },
          ]}
        />
      </CardHeader>

      <CardContent className="flex divide-x-2 divide-primary-foreground p-0">
        {/* Actions */}
        <div className="flex w-12 shrink-0 flex-col items-center">
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
                "center py-3 pb-2 transition-all",
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
                "center py-3 pt-2 transition-all",
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
                  "text-xs transition-all",
                )}
              >
                {formatCount(activeScore)}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col divide-y-2 divide-primary-foreground overflow-hidden">
          <div className="relative flex flex-1 flex-col p-6 pb-0">
            <div
              ref={contentRef}
              className={cn(
                "relative mb-6 flex-1 overflow-hidden rounded-xl border-2 border-dashed border-accent bg-accent/20 p-4",
                showFull ? "max-h-none" : "max-h-[400px]",
              )}
            >
              <p className="break-words text-sm text-orange-100">
                <RenderText text={content} />
              </p>
              {!showFull && expandButton && (
                <div className="absolute inset-x-0 bottom-0 z-20">
                  <div className="mb-[-30px] h-[30px] w-full bg-gradient-to-b from-transparent to-background"></div>
                  <div className="h-[30px] w-full bg-gradient-to-b from-transparent to-accent/20"></div>
                  <button
                    onClick={() => setShowFull(true)}
                    className="center text-text relative h-[40px] w-full bg-background text-sm transition-all hover:text-primary"
                  >
                    <div className="absolute inset-0 flex items-end justify-center bg-accent/20 pb-2.5">
                      Show more
                    </div>
                  </button>
                </div>
              )}
            </div>
            <div className="flex w-full justify-end">
              <div className="mr-[-24px] mt-[-12px] flex flex-row-reverse flex-wrap gap-2 rounded-tl-md px-2 pb-2">
                {removeDuplicates(
                  tags.filter((t) => t[0] === "t").map((t) => t[1]),
                ).map((t) => (
                  <Badge
                    key={t}
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
