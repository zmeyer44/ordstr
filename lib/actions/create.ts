import {
  type Event,
  UnsignedEvent,
  getEventHash,
  getPublicKey,
  getSignature,
  eventsGenerator,
  nip19,
} from "nostr-tools";
import NDK, {
  NDKEvent,
  NDKPrivateKeySigner,
  type NDKTag,
  type NDKSigner,
  type NDKList,
  type NDKUserProfile,
  type NostrEvent,
} from "@nostr-dev-kit/ndk";
import { getHashedKeyName } from "@/lib/nostr";
import { dateToUnix } from "nostr-react";
import { NostrService } from "@/lib/nostr";

export async function createEvent(
  ndk: NDK,
  event: {
    content: string;
    kind: number;
    tags: string[][];
  },
) {
  try {
    const pubkey = await window.nostr?.getPublicKey();
    if (!pubkey || !window.nostr) {
      throw new Error("No public key provided!");
    }
    const eventToPublish = new NDKEvent(ndk, {
      ...event,
      pubkey,
      created_at: dateToUnix(),
    } as NostrEvent);
    console.log("eventToPublish ", eventToPublish);

    const signed = await eventToPublish.sign();
    console.log("signed", signed);
    await eventToPublish.publish();
    return true;
  } catch (err) {
    console.log(err);
    alert("An error has occured");
    return false;
  }
}
export async function createReaction(
  ndk: NDK,
  content: "+" | "-",
  event: {
    id: string;
    pubkey: string;
  },
) {
  return createEvent(ndk, {
    content,
    kind: 7,
    tags: [
      ["e", event.id],
      ["p", event.pubkey],
    ],
  });
}
export async function createList(
  ndk: NDK,
  title: string,
  description?: string,
) {
  return createEvent(ndk, {
    content: "",
    kind: 30001,
    tags: [
      ["name", title],
      ["description", description ?? ""],
      ["d", NostrService.randomId()],
    ],
  });
}

export async function deleteEvent(
  ndk: NDK,
  events: [["e", string] | ["a", `${number}:${string}:${string}`]],
  reason?: string,
) {
  return createEvent(ndk, {
    kind: 5,
    content: reason ?? "",
    tags: events,
  });
}

export let listSigner: NDKPrivateKeySigner | undefined = undefined;

function getSigner(ndk: NDK, signer: "self" | "delegated"): NDKSigner {
  if (signer === "delegated") {
    return listSigner!;
  }
  console.log("GetSigner not dleegated");
  return ndk.signer!;
}

async function generateEvent(
  ndk: NDK,
  event: {
    content: string;
    kind: number;
    tags: string[][];
  },
  delegate: boolean,
): Promise<NDKTag | undefined> {
  let _value = event.content.trim();

  // if this a relay URL, nrelay-encode it
  if (_value.startsWith("wss://")) {
    _value = nip19.nrelayEncode(_value);
  }

  try {
    const decode = nip19.decode(_value);

    switch (decode.type) {
      case "naddr":
      case "note":
      case "nevent":
        // We were able to decode something that looks like an event
        // fetch it
        const _event = await ndk.fetchEvent(_value);
        if (_event) {
          // we were able to fetch it, let's return it
          return _event.tagReference();
        } else {
          // TODO: Generate a NDKTag based on the values
          return undefined;
        }
      case "nrelay":
        return ["r", decode.data as string];
      case "npub":
        return ["p", decode.data as string];
      case "nprofile":
        const d = ["p", decode.data.pubkey];
        if (decode.data.relays && decode.data.relays[0])
          d.push(decode.data.relays[0]);
        return d;
    }
  } catch (e) {
    console.log("at catch", e);
    const signer = getSigner(ndk, delegate ? "delegated" : "self");
    console.log("Signer", signer);
    const user = await signer.user();
    console.log("User", user);
    const newEvent = new NDKEvent(ndk, {
      content: _value || "",
      kind: 1,
      tags: [...event.tags, ["client", "ordstr"]],
      pubkey: user.hexpubkey,
    } as NostrEvent);
    console.log("Event to create", newEvent);

    await newEvent.sign(signer);

    await newEvent.publish();

    return newEvent.tagReference();
  }
}
export async function createEventOnList(
  ndk: NDK,
  event: {
    content: string;
    kind: number;
    tags: string[][];
  },
  list: NDKList,
  delegate: boolean,
) {
  const tag = await generateEvent(ndk, event, delegate);

  if (!tag) return;
  await list.addItem(tag, undefined, false);
  await list.sign();
  await list.publish();
  return true;
}
