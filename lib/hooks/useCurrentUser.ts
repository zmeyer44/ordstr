import { useEffect, useMemo } from "react";
import currentUserStore from "@/lib/stores/currentUser";
import useEvents from "@/lib/hooks/useEvents";
import { UserSchema } from "@/types";

export default function useCurrentUser() {
  const {
    currentUser,
    setCurrentUser,
    setFollows,
    updateCurrentUser,
    follows,
  } = currentUserStore();

  const {
    events: contactList,
    isLoading,
    onEvent,
  } = useEvents({
    filter: {
      kinds: [3],
      authors: [currentUser?.hexpubkey ?? ""],
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
      updateCurrentUser({
        profile: {
          ...parsedData.data,
          displayName: parsedData.data.display_name,
        },
      });
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
