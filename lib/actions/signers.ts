import {
  type Event as NostrEvent,
  UnsignedEvent,
  getEventHash,
  getPublicKey,
  getSignature,
  eventsGenerator,
} from "nostr-tools";
import { dateToUnix } from "nostr-react";
import { NostrService } from "@/lib/nostr";

export async function findEphemeralSigner(
  event: {
    content: string;
    kind: number;
    tags: string[][];
  },
  publish: (event: NostrEvent<number>) => void,
) {
  try {
    const pubkey = await window.nostr?.getPublicKey();
    if (!pubkey || !window.nostr) {
      throw new Error("No public key provided!");
    }
    const unsignedEvent: UnsignedEvent = {
      ...event,
      created_at: dateToUnix(),
      pubkey: pubkey,
    };
    const unsignedEventWithId = {
      ...unsignedEvent,
      id: getEventHash(unsignedEvent),
    };
    console.log("Unsigned", unsignedEventWithId);

    const eventToPublish: NostrEvent =
      await window.nostr.signEvent(unsignedEventWithId);
    console.log("Publishing", eventToPublish);

    publish(eventToPublish);
  } catch (err) {
    console.log(err);
    alert("An error has occured");
  }
}
