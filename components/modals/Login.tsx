"use client";
import { useState, useRef, useEffect } from "react";
import Template from "./Template";
import { Button } from "@/components/ui/button";
import { useNostr } from "nostr-react";
import { useModal } from "@/app/_providers/modalContext/provider";
import { useKeys } from "@/app/_providers/keysProvider";
import { nip19 } from "nostr-tools";

export default function LoginModal() {
  const [isLoading, setIsLoading] = useState(false);
  const modal = useModal();
  const keys = useKeys();
  const [isLightningConnected, setIsLightningConnected] = useState(false);
  const [skipGetAlby, setSkipGetAlby] = useState(false);

  useEffect(() => {
    const shouldReconnect = localStorage.getItem("shouldReconnect");

    const getConnected = async (shouldReconnect: string) => {
      let enabled: boolean | void = false;

      if (typeof window.nostr === "undefined") {
        return;
      }

      if (shouldReconnect === "true") {
        const publicKey = await window.nostr.getPublicKey();
        console.log("public key", publicKey);
        keys?.setKeys({ privkey: "", pubkey: nip19.npubEncode(publicKey) });
      }

      if (typeof window.webln === "undefined") {
        return;
      }

      if (shouldReconnect === "true" && !window.webln.executing) {
        try {
          enabled = await window.webln.enable();
          setIsLightningConnected(true);
        } catch (e: any) {
          console.log(e.message);
        }
      }
      return enabled;
    };

    if (shouldReconnect === "true") {
      getConnected(shouldReconnect);
    }
  }, [keys?.setKeys]);

  async function handleLogin() {
    setIsLoading(true);
    if (typeof window.nostr !== "undefined") {
      const publicKey = await window.nostr.getPublicKey();
      console.log("public key", publicKey);
      keys?.setKeys({ privkey: "", pubkey: publicKey });
      localStorage.setItem("shouldReconnect", "true");
    }

    if (typeof window.webln !== "undefined") {
      await window.webln.enable();
    }
    console.log("connected ");
    setIsLightningConnected(true);
    setIsLoading(false);
    modal?.hide();
  }

  return (
    <Template title="Login" className="md:max-w-[400px]">
      <div className="flex flex-col gap-y-5">
        <Button onClick={() => void handleLogin()} loading={isLoading}>
          Connect with extension
        </Button>
      </div>
    </Template>
  );
}
