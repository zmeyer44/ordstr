"use client";
import { useState } from "react";
import { useNostrEvents } from "nostr-react";
import { nip19, type Filter, type Event, nip04 } from "nostr-tools";
import { getHashedKeyName } from "@/lib/nostr";
import { useKeys } from "@/app/_providers/keysProvider";
import { z } from "zod";

const PrivateKeySigner = z.object({
  privateKey: z.string(),
});
type EphemeralKeyEventContent = {
  key: string;
  event?: string;
  version: string;
  metadata?: object;
};
type UseSignerProps = {
  metadata: {
    name?: string;
    eventId: string;
  };
};
export default function useSigner({ metadata }: UseSignerProps) {
  const keys = useKeys();
  const [signer, setSigner] = useState<Event<number> | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>("");
  const filter: Filter = { kinds: [2600] };

  const hashedName = metadata.name
    ? getHashedKeyName(metadata.name)
    : getHashedKeyName(metadata.eventId);
  filter["#e"] = [hashedName];

  const { isLoading, onEvent, onDone } = useNostrEvents({
    filter: filter,
  });
  onEvent((event) => setSigner(event));
  onDone(() => {
    if (signer && keys?.keys.pubkey) {
      void handleDecryptContent(keys.keys.pubkey, signer.content);
    }
  });

  async function handleDecryptContent(pubkey: string, content: string) {
    if (!window.nostr) {
      throw new Error("Missing extension");
    }
    const decrypedContent = await window.nostr.nip04.decrypt(pubkey, content);
    const privateKeySigner = JSON.parse(decrypedContent);
    console.log("Private key signer", privateKeySigner);
    const parsed = PrivateKeySigner.parse(privateKeySigner);
    setPrivateKey(parsed.privateKey);
  }

  return { signer, privateKey, isLoading };
}

function generateContent(
  privateKey: string,
  opts: {
    associatedEvent?: Event;
    name?: string;
    metadata?: object;
    keyProfile?: string;
    mainSigner?: string;
  },
) {
  const content: EphemeralKeyEventContent = {
    key: privateKey,
    version: "v0",
    ...opts.metadata,
  };

  if (opts.associatedEvent)
    content.event = nip19.neventEncode(opts.associatedEvent);

  return JSON.stringify(content);
}

async function saveEphemeralSigner() {}
