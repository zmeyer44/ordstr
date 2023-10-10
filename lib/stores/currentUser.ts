import { create } from "zustand";
import { type User } from "@/types";

type Settings = {};

interface CurrentUserState {
  currentUser: (User & { pubkey: string }) | null;
  follows: string[];
  settings: Settings;
  setCurrentUser: (user: (User & { pubkey: string }) | null) => void;
  updateUser: (user: Partial<User>) => void;
  setFollows: (follows: string[]) => void;
}

const currentUserStore = create<CurrentUserState>()((set) => ({
  currentUser: null,
  follows: [],
  settings: {},
  updateUser: (user) =>
    set((state) => ({
      ...state,
      currentUser: { ...state.currentUser!, ...user },
    })),
  setCurrentUser: (user) => set((state) => ({ ...state, currentUser: user })),
  setFollows: (follows) => set((state) => ({ ...state, follows: follows })),
}));

export default currentUserStore;
