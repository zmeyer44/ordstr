"use client";

import {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactElement,
} from "react";
import { type Event } from "nostr-tools";
import { RelayContext } from "../relayProvider";

type ProfilesContextProps = {
  addProfiles: (pubkeys: string[]) => void;
  profiles: Record<`profile_${string}_${string}`, Event> | null;
  reload: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ProfilesContext = createContext<ProfilesContextProps | undefined>(
  undefined
);

export default function ProfilesProvider({
  children,
}: {
  children: ReactElement;
}) {
  const [profiles, setProfiles] = useState<Record<
    `profile_${string}_${string}`,
    Event
  > | null>(null);

  const [reload, setReload] = useState(false);
  const { relayUrl, subscribe } = useContext(RelayContext);

  const addProfiles = async (pubkeys: string[]) => {
    if (!relayUrl) return;

    const relayName = relayUrl.replace("wss://", "");

    const filter = {
      kinds: [0],
      authors: pubkeys,
    };

    const events: Event[] = [];

    const onEvent = (event: Event) => {
      events.push(event);
    };

    const onEOSE = () => {
      if (events.length !== 0) {
        events.forEach((event) => {
          const profileKey = `profile_${relayName}_${event.pubkey}`;
          setProfiles((prevProfiles) => ({
            ...prevProfiles,
            [profileKey]: event,
          }));
          setReload(!reload);
        });
      }
    };

    subscribe([relayUrl], filter, onEvent, onEOSE);
  };

  return (
    <ProfilesContext.Provider
      value={{ addProfiles, profiles, reload, setReload }}
    >
      {children}
    </ProfilesContext.Provider>
  );
}
