"use client";

import { cn } from "@/lib/utils";
import { type Event } from "nostr-tools";
import KindCardContainer from "./components/Container";
import Spinner from "../spinner";

type KindCardProps = Event<number> & {
  clickable?: boolean;
};

export default function KindCard(props: KindCardProps) {
  return (
    <KindCardContainer {...props}>
      <div
        className={cn(
          "relative mb-6 flex-1 overflow-hidden rounded-xl border-2 border-dashed border-accent bg-accent/20 p-4",
        )}
      >
        <div className="center text-orange-100">
          <Spinner />
        </div>
      </div>
    </KindCardContainer>
  );
}
