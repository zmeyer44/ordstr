import { create } from "zustand";
import { type User } from "@/types";
import { NDKUser } from "@nostr-dev-kit/ndk";

type Settings = {};

interface CurrentUserState {
  currentUser: NDKUser | null;
  follows: string[];
  settings: Settings;
  setCurrentUser: (user: NDKUser | null) => void;
  updateCurrentUser: (user: Partial<NDKUser>) => void;
  setFollows: (follows: string[]) => void;
}

const currentUserStore = create<CurrentUserState>()((set) => ({
  currentUser: null,
  follows: [],
  settings: {},
  setCurrentUser: (user) => set((state) => ({ ...state, currentUser: user })),
  updateCurrentUser: (user) =>
    set((state) => ({
      ...state,
      currentUser: { ...state.currentUser, ...user } as NDKUser,
    })),
  setFollows: (follows) => set((state) => ({ ...state, follows: follows })),
}));

export default currentUserStore;
