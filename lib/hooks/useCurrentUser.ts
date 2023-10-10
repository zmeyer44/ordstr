import { useEffect, useMemo } from "react";
import currentUserStore from "@/lib/stores/currentUser";
import { useNostrEvents } from "nostr-react";
import { Kind } from "@/lib/nostr";
import { UserSchema } from "@/types";

export default function useCurrentUser() {
  const { currentUser, setCurrentUser, updateUser, setFollows, follows } =
    currentUserStore();

  const {
    events: contactList,
    isLoading,
    onEvent,
  } = useNostrEvents({
    filter: {
      kinds: [Kind.Contacts],
      authors: [currentUser?.pubkey ?? ""],
      limit: 1,
    },
    enabled: !!currentUser,
  });
  onEvent((event) => {
    console.log("EVENT", event);
    const foundFollows = event.tags
      .filter(([key]) => key === "p")
      .map(([key, pubkey]) => pubkey);
    console.log("Found follows", foundFollows);
    if (follows.length !== foundFollows.length) {
      setFollows(follows);
    }
  });

  function logout() {
    localStorage.removeItem("shouldReconnect");
    setCurrentUser(null);
    window.location.reload();
  }
  function handleUpdateUser(userInfo: string) {
    const parsedData = UserSchema.safeParse({
      ...currentUser,
      ...JSON.parse(userInfo),
    });
    if (parsedData.success) {
      updateUser(parsedData.data);
    }
  }

  return {
    currentUser,
    isLoading,
    follows,
    setCurrentUser,
    logout,
    updateUser: handleUpdateUser,
  };
}
