"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { HiX } from "react-icons/hi";
import { useModal } from "@/app/_providers/modalContext/provider";

type ModalProps = {
  title: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Template({ title, children, className }: ModalProps) {
  const modal = useModal();

  function handleClose() {
    modal?.hide();
  }

  return (
    <div
      className={cn(
        "z-10 relative w-full grow bg-background md:rounded-lg md:pt-4 md:border-2 pb-14 md:pb-5",
        "pt-0",
        className
      )}
      //   className={
      //     "relative w-full pt-0 grow p-4 md:rounded-lg md:pt-5 md:p-6 md:border-2 pb-14 md:pb-5"
      //   }
    >
      <div className="mb-3 mt-[-6px] px-4 pb-2 flex items-center justify-between border-b-2">
        <h1
          style={{
            fontFamily: '"DM Sans", sans-serif',
          }}
          className="text-xl font-medium text-primary-foreground"
        >
          {title}
        </h1>
        <button
          onClick={handleClose}
          className="hidden text-primary transition-all hover:text-accent md:flex"
        >
          <HiX className="h-5 w-5" />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
