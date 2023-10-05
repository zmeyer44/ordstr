"use client";

// import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
// import { GoogleAnalyticsInit } from "~/utils/tracking";
import TRPCProvider from "./trpc";
import { ModalProvider } from "./modalContext/provider";
import useRouteChange from "@/lib/hooks/useRouteChange";
import NostrProvider from "./nostrProvider";
// import useServiceWorker from "~/hooks/useServiceWorker";

export function Providers({ children }: { children: React.ReactNode }) {
  const handleRouteChange = (url: string) => {
    const RichHistory = sessionStorage.getItem("RichHistory");
    if (!RichHistory) {
      sessionStorage.setItem("RichHistory", "true");
    }
  };
  // useServiceWorker();
  useRouteChange(handleRouteChange);
  return (
    <>
      <NostrProvider>
        <TRPCProvider>
          <ModalProvider>{children}</ModalProvider>
          {/* {children} */}
        </TRPCProvider>
      </NostrProvider>
      <Toaster
        toastOptions={{
          className: "bg-gray-900 text-gray-200",
          style: {
            zIndex: 9999,
            background: "#030712",
            color: "#e5e7eb",
          },
          success: {
            iconTheme: {
              primary: "bg-primary",
              secondary: "bg-foreground",
            },
          },
        }}
      />
    </>
  );
}
