"use client";
import useProfile from "@/lib/hooks/useProfile";
import Link from "next/link";
import { nip19 } from "nostr-tools";

type ProfileMentionProps = {
  mention: string;
};

export default function ProfileMention({ mention }: ProfileMentionProps) {
  const { user } = useProfile(nip19.decode(mention).data.toString());
  return (
    <Link href={`/${mention}`}>
      <span className="text-primary-foreground hover:underline">{`@${
        user?.name ?? mention
      }`}</span>
    </Link>
  );
}
