import {
  type Event as NostrEvent,
  UnsignedEvent,
  getEventHash,
  getPublicKey,
  getSignature,
  eventsGenerator,
} from "nostr-tools";
import { dateToUnix } from "nostr-react";

export async function createEvent(
  event: {
    content: string;
    kind: number;
    tags: string[][];
  },
  publish: (event: NostrEvent<number>) => void
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
export async function createReaction(
  content: "+" | "-",
  event: {
    id: string;
    pubkey: string;
  },
  publish: (event: NostrEvent<number>) => void
) {
  return createEvent(
    {
      content,
      kind: 7,
      tags: [
        ["e", event.id],
        ["p", event.pubkey],
      ],
    },
    publish
  );
}

export async function deleteEvent(
  events: [["e", string] | ["a", `${number}:${string}:${string}`]],
  publish: (event: NostrEvent<number>) => void,
  reason?: string
) {
  return createEvent(
    {
      kind: 5,
      content: reason ?? "",
      tags: events,
    },
    publish
  );
}
