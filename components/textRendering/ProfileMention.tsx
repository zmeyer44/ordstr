"use client";
import useProfile from "@/lib/hooks/useProfile";
import Link from "next/link";

type ProfileMentionProps = {
  mention: string;
};

export default function ProfileMention({ mention }: ProfileMentionProps) {
  const { user } = useProfile(mention);
  return (
    <Link href={`/${mention}`}>
      <span className="text-primary-foreground hover:underline">{`@${
        user?.name ?? mention
      }`}</span>
    </Link>
  );
}
