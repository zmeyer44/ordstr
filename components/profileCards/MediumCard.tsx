"use client";
import React from "react";
import { Card, CardTitle } from "@/components/ui/card";
import useProfile from "@/lib/hooks/useProfile";
type MediumCardProps = {
  pubkey: string;
};

export default function MediumCard({ pubkey }: MediumCardProps) {
  const { user } = useProfile(pubkey);
  return (
    <Card>
      <p>{user?.npub}</p>
      <p>{user?.display_name}</p>
    </Card>
  );
}
