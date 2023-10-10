import { EventTemplate, Event } from "nostr-tools";
import { WebLNProvider } from "webln";
declare global {
  interface Window {
    webln?: WebLNProvider & {
      executing?: boolean;
    };
  }
}

type Nostr = {
  getPublicKey(): Promise<string>;
  signEvent(event: EventTemplate): Promise<Event>;
  getRelays(): Promise<{ [url: string]: { read: boolean; write: boolean } }>;
  nip04: {
    encrypt(pubkey: string, content: string): Promise<string>;
    decrypt(pubkey: string, content: string): Promise<string>;
  };
};
