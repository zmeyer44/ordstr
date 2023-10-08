"use client";

// import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
// import { GoogleAnalyticsInit } from "~/utils/tracking";
import TRPCProvider from "./trpc";
import { ModalProvider } from "./modalContext/provider";
import useRouteChange from "@/lib/hooks/useRouteChange";
import NostrProvider from "./nostrProvider";
import KeysProvider from "./keysProvider";
import RelayProvider from "./relayProvider";
import ProfilesProvider from "./profilesProvider";
import ProfileProvider from "./profileProvider";
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
          {/* <RelayProvider> */}
          <ProfilesProvider>
            <ProfileProvider>
              <KeysProvider>
                <ModalProvider>{children}</ModalProvider>
              </KeysProvider>
            </ProfileProvider>
          </ProfilesProvider>
          {/* </RelayProvider> */}
          <Toaster
            toastOptions={{
              className: "bg-gray-900 text-gray-200",
              style: {
                zIndex: 9999,
                background: "#1f2937",
                color: "#22d3ee",
              },
              success: {
                iconTheme: {
                  primary: "#8d3201",
                  secondary: "#22d3ee",
                },
              },
            }}
          />
        </TRPCProvider>
      </NostrProvider>
    </>
  );
}
