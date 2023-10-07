"use client";

import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { type User } from "@/types";

export const ProfileContext = createContext<{
  profile: User | null;
  setProfile: Dispatch<SetStateAction<User | null>>;
}>({
  profile: null,
  setProfile: () => {},
});

const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<User | null>(null);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;
