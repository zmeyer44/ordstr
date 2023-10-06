"use client";
import { RxPlus } from "react-icons/rx";
import { useModal } from "@/app/_providers/modalContext/provider";
import CreateEventModal from "@/components/modals/CreateEvent";
export default function NewEvent() {
  const modal = useModal();
  return (
    <button
      onClick={() => modal?.show(<CreateEventModal />)}
      className="center z-header- fixed right-[10px] bottom-[20px] border-2 text-primary-foreground bg-background-gray theme-shadow rounded-full h-[50px] aspect-square hover:bg-primary/40"
    >
      <RxPlus className="h-[24px] w-[24px]" />
    </button>
  );
}
