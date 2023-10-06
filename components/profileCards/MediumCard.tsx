import React from "react";
import { Card, CardTitle } from "@/components/ui/card";
import useProfile from "@/lib/hooks/useProfile";
type MediumCardProps = {
  pubkey: string;
  name?: string;
  about?: string;
  picture?: string;
};

export default function MediumCard({
  pubkey,
  name,
  about,
  picture,
}: MediumCardProps) {
  const { user } = useProfile(pubkey);
  return (
    <Card>
      <p>{user?.npub}</p>
      <p>{user?.display_name}</p>
    </Card>
  );
}
