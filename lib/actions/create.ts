import {
  type Event as NostrEvent,
  UnsignedEvent,
  getEventHash,
  getPublicKey,
  getSignature,
  eventsGenerator,
} from "nostr-tools";
import { dateToUnix, useNostr } from "nostr-react";

export async function createEvent(event: {
  content: string;
  kind: number;
  tags: string[][];
}) {
  const { publish } = useNostr();
  const privKey = "";
  const unsignedEvent: UnsignedEvent = {
    ...event,
    created_at: dateToUnix(),
    pubkey: getPublicKey(privKey),
  };
  const unsignedEventWithId = {
    ...unsignedEvent,
    id: getEventHash(unsignedEvent),
  };

  const eventToPublish: NostrEvent = {
    ...unsignedEventWithId,
    sig: getSignature(unsignedEventWithId, privKey),
  };
  publish(eventToPublish);
}
