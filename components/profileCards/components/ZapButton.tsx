"use client";
import { useNDK } from "@/app/_providers/ndkProvider";
import { Button } from "@/components/ui/button";
import NDK, { NDKUser, NDKZapInvoice } from "@nostr-dev-kit/ndk";

type ZapButtonProps = {
  pubkey: string;
};
export default function ZapButton({ pubkey }: ZapButtonProps) {
  const { loginWithNip07 } = useNDK();
  async function submitZap(ndk: NDK, user: NDKUser) {
    const signer = await loginWithNip07();

    if (!true) {
      console.log("No payment request");
      return;
    }

    // try {
    //   const webln = await requestProvider();
    //   webln
    //     .sendPayment(zapRequest)
    //     .then(() => {
    //       toast.success("Zap successful!");
    //       popoverOpen = false;
    //     })
    //     .catch((err) => {
    //       console.error(err);
    //       toast.error("Zap failed. Please try again.");
    //     });
    // } catch (error: any) {
    //   console.log(error);
    // }
  }
  return <Button>zap</Button>;
}
