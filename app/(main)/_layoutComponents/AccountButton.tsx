"use client";
import { useModal } from "@/app/_providers/modalContext/provider";
import LoginModal from "@/components/modals/Login";
// import useCurrentUser from "@/app/_providers/userProdiver";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { truncateText } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useKeys } from "@/app/_providers/keysProvider";
import { MenuButton } from "@/components/menuButton";
import { useRouter } from "next/navigation";

export default function AccountButton() {
  const { currentUser, logout } = useCurrentUser();
  const router = useRouter();
  const modal = useModal();

  if (currentUser) {
    return (
      <MenuButton
        align="end"
        options={[
          {
            label: "My Profile",
            onSelect: () => router.push(`/${currentUser.npub}`),
          },
          {
            label: "Sign out",
            onSelect: () => logout(),
          },
        ]}
      >
        <button className="flex h-full items-center gap-x-2 pl-3 hover:bg-primary/40 md:gap-x-4 md:pl-4">
          <h2 className="font-semibold text-primary-foreground">
            {currentUser.profile?.displayName ??
              currentUser.profile?.name ??
              truncateText(currentUser.npub)}
          </h2>
          <Avatar className="mb-[1px] mr-[9px] h-[35px] w-[35px] border bg-accent/60 md:mr-[14px]">
            <AvatarImage
              className="bg-transparent"
              src={currentUser.profile?.picture}
            />
            <AvatarFallback className="bg-transparent text-[14px] uppercase leading-5">
              {currentUser.profile?.display_name?.at(0) ??
                currentUser.profile?.name?.at(0) ??
                currentUser.npub.at(5)}
            </AvatarFallback>
          </Avatar>
        </button>
      </MenuButton>
    );
  } else {
    return (
      <button
        onClick={() => modal?.show(<LoginModal />)}
        className="px-6 hover:bg-primary/40 md:px-8"
      >
        <h2 className="font-bold uppercase text-primary-foreground">Log In</h2>
      </button>
    );
  }
}
