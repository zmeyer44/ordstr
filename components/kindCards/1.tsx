"use client";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { RenderText } from "../textRendering";
import { type Event } from "nostr-tools";
import useQueryParams from "@/lib/hooks/useQueryParams";
import KindCardContainer from "./components/Container";

type KindCardProps = Event<number> & {
  clickable?: boolean;
};

export default function KindCard(props: KindCardProps) {
  const { content } = props;
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
    <KindCardContainer {...props}>
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
    </KindCardContainer>
  );
}
