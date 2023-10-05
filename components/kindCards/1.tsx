"use client";
import { useState } from "react";
import {
  RxDotsHorizontal,
  RxThickArrowUp,
  RxThickArrowDown,
} from "react-icons/rx";
import { cn, relativeTimeUnix, formatCount } from "@/lib/utils";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RenderText } from "../textRendering";

type KindCardProps = {
  title?: string;
  content: string;
  timestamp: number;
  clickable?: boolean;
};

export default function KindCard({
  title,
  content,
  timestamp,
  clickable,
}: KindCardProps) {
  const [active, setActive] = useState("UP");
  const [activeScore, setActiveScore] = useState(0);
  return (
    <Card className={cn("overflow-hidden w-full", clickable && "theme-shadow")}>
      {!!title && (
        <CardHeader className="py-2 px-3">
          <div className="flex justify-between flex-row items-center">
            <div className="flex-1 center gap-x-2 pr-3">
              <Avatar className="border h-[25px] w-[25px] bg-accent/60">
                <AvatarImage className="bg-transparent" src={undefined} />
                <AvatarFallback className="bg-transparent text-[11px] leading-5 uppercase">
                  {title.at(0)}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="font-normal text-primary-foreground/80 line-clamp-1 break-all">
                {title}
              </CardTitle>
              {/* <p className="line-clamp-1 break-all">{title}</p> */}
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
        </CardHeader>
      )}
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
        <div className="flex-1 flex flex-col divide-y-2 divide-primary-foreground">
          <div className="flex-1 p-6">
            <div className="bg-accent/20 border-dashed border-accent border-2 rounded-xl p-4">
              <p className="text-orange-100 text-sm break-all">
                <RenderText text={content} />
              </p>
            </div>
          </div>
          <div className="flex justify-between px-3 py-1.5 text-xs">
            <div className="">
              <p>test</p>
              <p>{relativeTimeUnix(timestamp)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
