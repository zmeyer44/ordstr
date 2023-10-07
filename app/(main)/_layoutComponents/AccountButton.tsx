"use client";
import { useModal } from "@/app/_providers/modalContext/provider";
import LoginModal from "@/components/modals/Login";
import useCurrentUser from "@/app/_providers/userProdiver";
import { truncateText } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function AccountButton() {
  const { currentUser } = useCurrentUser();
  const modal = useModal();

  if (currentUser) {
    if (currentUser.name) {
      return (
        <button className="px-6 md:px-8 hover:bg-primary/40">
          <Avatar className="border h-[25px] w-[25px] bg-accent/60">
            <AvatarImage
              className="bg-transparent"
              src={currentUser?.picture}
            />
            <AvatarFallback className="bg-transparent text-[11px] leading-5 uppercase">
              {currentUser.display_name
                ? currentUser?.display_name.at(0)
                : currentUser.name.at(0)}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-primary-foreground uppercase font-bold">
            {currentUser.display_name ?? currentUser.name}
          </h2>
        </button>
      );
    } else {
      return (
        <button className="px-6 md:px-8 hover:bg-primary/40">
          <h2 className="text-primary-foreground uppercase font-bold">
            {truncateText(currentUser.npub)}
          </h2>
        </button>
      );
    }
  } else {
    return (
      <button
        onClick={() => modal?.show(<LoginModal />)}
        className="px-6 md:px-8 hover:bg-primary/40"
      >
        <h2 className="text-primary-foreground uppercase font-bold">Log In</h2>
      </button>
    );
  }
}
