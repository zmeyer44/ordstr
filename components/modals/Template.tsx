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
        "relative w-full grow bg-background pt-1 p-4 md:rounded-lg md:pt-5 md:p-6 md:border-2 max-md:pb-14",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h1
          style={{
            fontFamily: '"DM Sans", sans-serif',
          }}
          className="font-title text-xl font-semibold text-primary-foreground"
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
      {children}
    </div>
  );
}
