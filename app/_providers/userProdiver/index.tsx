import { create } from "zustand";
import { type User } from "@/types";

interface CurrentUserState {
  currentUser: User | undefined;
  setCurrentUser: (user: User) => void;
  clear: () => void;
}

const useCurrentUser = create<CurrentUserState>()((set) => ({
  currentUser: undefined,
  setCurrentUser: (user) => set((state) => ({ ...state, currentUser: user })),
  clear: () => set((state) => ({ ...state, currentUser: undefined })),
}));

export default useCurrentUser;
