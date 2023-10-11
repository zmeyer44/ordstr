"use client";
import { useState, useRef, useEffect, ReactNode } from "react";
import { cn, relativeTimeUnix, removeDuplicates } from "@/lib/utils";
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
import ProfileHeader from "./ProfileHeader";
import { type Event } from "nostr-tools";
import useQueryParams from "@/lib/hooks/useQueryParams";
import { copyText } from "@/lib/utils";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import ScoreSection from "./ScoreSection";
import { deleteEvent } from "@/lib/actions/create";
import { useNDK } from "@/app/_providers/ndkProvider";
type ContainerProps = Event<number> & {
  clickable?: boolean;
  children: ReactNode;
};

export default function KindCard({
  clickable,
  children,
  ...props
}: ContainerProps) {
  const { ndk } = useNDK();
  const { pubkey, content, created_at, tags, kind, id } = props;
  const { currentUser } = useCurrentUser();
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
            ...(currentUser?.hexpubkey === pubkey
              ? [
                  {
                    label: "Delete Note",
                    onSelect: () => {
                      deleteEvent(ndk!, [["e", id]])
                        .then((r) => {
                          toast.success("Event deleted");
                          window.location.reload();
                        })
                        .catch((e) => toast.error("An error occured"));
                    },
                  },
                ]
              : []),
          ]}
        />
      </CardHeader>

      <CardContent className="flex divide-x-2 divide-primary-foreground p-0">
        {/* Actions */}
        <div className="flex w-12 shrink-0 flex-col items-center">
          <ScoreSection id={id} pubkey={pubkey} />
        </div>
        {/* Content */}
        <div className="flex flex-1 flex-col divide-y-2 divide-primary-foreground overflow-hidden">
          <div className="relative flex flex-1 flex-col p-6 pb-0">
            {children}
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
