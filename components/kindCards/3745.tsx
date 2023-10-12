"use client";
import { useState, useRef, useEffect } from "react";
import { type Event } from "nostr-tools";
import { useNDK } from "@/app/_providers/ndkProvider";
import { decryptMessage } from "@/lib/nostr";
import Error from "./error";
import Loading from "./loading";
import KindOne from "./1";
import { NDKUser } from "@nostr-dev-kit/ndk";
import { EventSchema } from "@/types";

type KindCardProps = Event<number> & {
  clickable?: boolean;
};

export default function KindCard(props: KindCardProps) {
  const { content, id, pubkey } = props;
  const [error, setError] = useState("");
  const [fetchingEvent, setFetchingEvent] = useState(false);
  const [decryptedEvent, setDecryptedEvent] = useState<Event>();
  const { ndk } = useNDK();
  useEffect(() => {
    if (ndk && !fetchingEvent && !decryptedEvent) {
      void handleFetchEvent();
    }
  }, [ndk]);

  async function handleFetchEvent() {
    setFetchingEvent(true);
    try {
      const directMessageEvent = await ndk!.fetchEvent({
        kinds: [4],
        authors: [pubkey],
        ["#e"]: [id],
      });
      if (directMessageEvent) {
        await directMessageEvent.decrypt(
          new NDKUser({ hexpubkey: pubkey }),
          ndk?.signer,
        );
        const passphrase = directMessageEvent.content;
        if (!passphrase) {
          setError("Unable to parse event");
          return;
        }
        const decrypedData = await decryptMessage(content, passphrase);
        const hiddenEvent = EventSchema.safeParse(
          JSON.parse(decrypedData ?? ""),
        );
        if (hiddenEvent.success) {
          setDecryptedEvent(hiddenEvent.data);
        } else {
          setError("Unable to parse event");
        }
      }
    } catch (err) {
      setError("Unable to parse event");
    } finally {
      setFetchingEvent(false);
    }
  }

  if (decryptedEvent) {
    return <KindOne {...decryptedEvent} />;
  }
  if (error) {
    return (
      <Error {...props}>
        <p>{error}</p>
      </Error>
    );
  }
  return <Loading {...props} />;
}
