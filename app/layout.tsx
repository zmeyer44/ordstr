import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "./_providers";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ordstr",
  description: "Ordinals aware nostr client",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="min-h-screen w-full">
      <body className={cn(inter.className, "h-full bg-background")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
