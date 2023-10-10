"use client";
import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactElement,
  useEffect,
} from "react";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { findEphemeralSigner } from "@/lib/actions/signers";
import {
  NDKPrivateKeySigner,
  NDKUser,
  type NDKSigner,
  type NDKList,
} from "@nostr-dev-kit/ndk";
import { useNDK } from "../ndkProvider";

export type SignerStoreItem = {
  signer: NDKPrivateKeySigner;
  user: NDKUser;
  saved: boolean;
  name?: string;
  id: string;
};
type SignerItems = Map<string, SignerStoreItem>;

type SignerContextProps = {
  npubSigners: Map<string, NDKSigner>;
  signers: SignerItems;
  getSigner: (list: NDKList) => Promise<SignerStoreItem>;
};
const SignerContext = createContext<SignerContextProps | undefined>(undefined);

export default function SignerProvider({
  children,
}: {
  children: ReactElement;
}) {
  const { currentUser } = useCurrentUser();
  const { ndk } = useNDK();
  const [signers, setSigners] = useState(new Map());
  const npubSigners = useMemo(() => {
    const npubs = new Map<string, NDKSigner>();
    for (const entry of signers) {
      const { user, signer } = entry[1];
      npubs.set(user.npub, signer);
    }
    return npubs;
  }, [signers]);

  async function getDelegatedSignerName(list: NDKList) {
    let name = "";
    if (!currentUser) return;
    const user = new NDKUser({
      hexpubkey: currentUser.pubkey,
      nip05: currentUser.nip05,
      npub: currentUser.npub,
    });

    if (!user?.profile) {
      user.ndk = ndk;
      await user?.fetchProfile();
    }
    if (user?.profile?.displayName) {
      name = user.profile.displayName + `'s `;
    } else if (user?.profile?.name) {
      name = user.profile.name + `'s `;
    }

    return name + list.title;
  }

  async function getSigner(list: NDKList): Promise<SignerStoreItem> {
    const id = list.encode();
    let item = signers.get(id);
    if (item) return item;
    let signer = await findEphemeralSigner(ndk!, ndk!.signer!, {
      associatedEventNip19: list.encode(),
    });

    if (signer) {
      console.log(`found a signer for list ${list.name}`);
      item = {
        signer: signer!,
        user: await signer.user(),
        saved: true,
        id,
      };
    } else {
      signer = NDKPrivateKeySigner.generate();
      item = {
        signer,
        user: await signer.user(),
        saved: false,
        name: await getDelegatedSignerName(list),
        id,
      };
    }
    item.user.ndk = ndk;
    setSigners((prev) => prev.set(id, item));
    return item;
  }

  return (
    <SignerContext.Provider value={{ signers, npubSigners, getSigner }}>
      {children}
    </SignerContext.Provider>
  );
}

export function useSigner() {
  return useContext(SignerContext);
}
