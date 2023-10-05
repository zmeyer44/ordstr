import { type ReactElement } from "react";
import { NostrProvider } from "nostr-react";

type ProviderProps = {
  children: ReactElement;
};

const RELAYS = [
  "wss://nostr.pub.wellorder.net",
  "wss://nostr.drss.io",
  "wss://nostr.swiss-enigma.ch",
  "wss://relay.damus.io",
];

export default function Provider({ children }: ProviderProps) {
  return (
    <NostrProvider relayUrls={RELAYS} debug={true}>
      {children}
    </NostrProvider>
  );
}
