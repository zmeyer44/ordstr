"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type MenuButtonProps = {
  children: ReactNode;
  align?: "center" | "end" | "start";
  options: {
    label: string;
    className?: string;
    onSelect: () => void;
  }[];
};

export function MenuButton({ children, align, options }: MenuButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {options.map((option, idx) => (
          <>
            <DropdownMenuItem
              className={cn(
                "focus:bg-accent/20 cursor-pointer",
                option.className
              )}
              onSelect={option.onSelect}
            >
              {option.label}
            </DropdownMenuItem>
            {idx !== options.length - 1 && (
              <DropdownMenuSeparator className="bg-primary-foreground" />
            )}
          </>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
