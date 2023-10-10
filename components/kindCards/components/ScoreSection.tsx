import { useState, useMemo } from "react";
import {
  RxDotsHorizontal,
  RxThickArrowUp,
  RxThickArrowDown,
} from "react-icons/rx";
import { cn, formatCount } from "@/lib/utils";
import { useNostrEvents } from "nostr-react";
import { Kind } from "@/lib/nostr";
import { createReaction, deleteEvent } from "@/lib/actions/create";
import { useNDK } from "@/app/_providers/ndkProvider";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
type ScoreSectionProps = {
  id: string;
  pubkey: string;
};

export default function ScoreSection({ id, pubkey }: ScoreSectionProps) {
  const { currentUser } = useCurrentUser();
  const [active, setActive] = useState("UP");
  const [mounted] = useState(true);
  const { ndk } = useNDK();

  const { events: reactionEvents } = useNostrEvents({
    filter: {
      kinds: [Kind.Reaction],
      ["#e"]: [id],
      ["#p"]: [pubkey],
    },
    enabled: mounted,
  });

  const score = useMemo(() => {
    const upvotes = reactionEvents.filter(
      (event) => event.content !== "-",
    ).length;
    const downVotes = reactionEvents.length - upvotes;
    const score = upvotes - downVotes;
    const userAction = reactionEvents.filter(
      (event) => event.pubkey === currentUser?.pubkey,
    )?.[0];

    return { score, userAction };
  }, [reactionEvents]);

  async function handleVote(voteType: "+" | "-") {
    if (score.userAction !== undefined) {
      // Delete previous vote
      await deleteEvent(ndk!, [["e", score.userAction.id]]);
    }
    await createReaction(ndk!, voteType, {
      id: id,
      pubkey,
    });
  }
  return (
    <div className="group relative flex w-full flex-col items-stretch overflow-hidden">
      <button
        onClick={(e) => {
          void handleVote("+");
          e.stopPropagation();
          e.nativeEvent.preventDefault();
        }}
        className={cn(
          score.userAction !== undefined && score.userAction.content !== "-"
            ? "text-accent-foreground hover:bg-accent/20 hover:text-accent"
            : "text-primary-foreground hover:bg-primary/40 hover:text-cyan-300",
          "center py-3 pb-2 transition-all",
        )}
      >
        <RxThickArrowUp className="h-6 w-6 " />
      </button>
      <button
        onClick={(e) => {
          void handleVote("-");
          e.stopPropagation();
          e.nativeEvent.preventDefault();
        }}
        className={cn(
          score.userAction?.content === "-"
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
            score.userAction !== undefined
              ? "text-accent-foreground group-hover:text-accent"
              : "text-primary-foreground group-hover:text-gray-200",
            "text-xs transition-all",
          )}
        >
          {formatCount(score.score)}
        </span>
      </div>
    </div>
  );
}
