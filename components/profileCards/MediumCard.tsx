import React from "react";
import { Card, CardTitle } from "@/components/ui/card";

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
  return (
    <Card>
      <p>{pubkey}</p>
    </Card>
  );
}
