"use client";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { RenderText } from "../textRendering";
import { type Event } from "nostr-tools";
import useQueryParams from "@/lib/hooks/useQueryParams";
import KindCardContainer from "./components/Container";
import { getTagValues, getTagsValues } from "@/lib/nostr/utils";
import UrlCard from "./components/UrlCard";
import { uniq } from "ramda";

type KindCardProps = Event<number> & {
  clickable?: boolean;
};

export default function KindCard(props: KindCardProps) {
  const { content, tags } = props;
  const [showFull, setShowFull] = useState(false);
  const [expandButton, setExpandButton] = useState<boolean | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { queryParams, setQueryParams } = useQueryParams<{
    t?: string | string[];
  }>();

  useEffect(() => {
    if (contentRef.current) {
      if (contentRef.current.scrollHeight > 350) {
        setExpandButton(true);
      } else {
        setExpandButton(false);
      }
    }
  }, [contentRef.current]);
  const metadata =
    getTagValues("client", tags) === "ordstr"
      ? {
          title: getTagValues("title", tags),
          image: getTagValues("image", tags),
          description: getTagValues("description", tags),
          type: getTagValues("type", tags),
          r: getTagValues("r", tags),
        }
      : null;
  const r = uniq([
    ...getTagsValues("r", tags),
    ...getTagsValues("proxy", tags),
  ]);
  return (
    <KindCardContainer {...props}>
      <div
        ref={contentRef}
        className={cn(
          "relative mb-6 flex-1 overflow-hidden rounded-xl border-2 border-dashed border-accent bg-accent/20 p-4",
          showFull || expandButton === false ? "max-h-none" : "max-h-[400px]",
        )}
      >
        {metadata ? (
          <div className="space-y-4">
            <UrlCard url={metadata.r} metadata={metadata} className="" />

            <div className="">
              <h3>Notes:</h3>
              <p className="break-words text-sm text-orange-100">
                <RenderText text={content} />
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="break-words text-sm text-orange-100">
              <RenderText text={content} />
            </p>
            {!!r.length && (
              <div className="flex flex-wrap">
                {r.map((url) => (
                  // <div key={url} className="max-w-[100px]">
                  <UrlCard key={url} url={url} className="max-w-[250px]" />
                  // </div>
                ))}
              </div>
            )}
          </div>
        )}
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
    </KindCardContainer>
  );
}
