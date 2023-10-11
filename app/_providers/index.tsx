"use client";

// import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
// import { GoogleAnalyticsInit } from "~/utils/tracking";
import TRPCProvider from "./trpc";
import { ModalProvider } from "./modalContext/provider";
import useRouteChange from "@/lib/hooks/useRouteChange";
import KeysProvider from "./keysProvider";
import ProfilesProvider from "./profilesProvider";
import ProfileProvider from "./profileProvider";
import SignerProvider from "./signerProvider";
import ListsProvider from "./listProvider";
// import useServiceWorker from "~/hooks/useServiceWorker";
import { NDKProvider } from "./ndkProvider";
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
      <NDKProvider
        relayUrls={[
          "wss://nostr.pub.wellorder.net",
          "wss://nostr.drss.io",
          "wss://nostr.swiss-enigma.ch",
          "wss://relay.damus.io",
        ]}
      >
        <SignerProvider>
          <ListsProvider>
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
          </ListsProvider>
        </SignerProvider>
      </NDKProvider>
    </>
  );
}
