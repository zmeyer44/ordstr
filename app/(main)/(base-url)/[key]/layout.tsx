import { redirect } from "next/navigation";
import { nip19 } from "nostr-tools";

export default function Layout(props: {
  children: React.ReactNode;
  event: React.ReactNode;
  profile: React.ReactNode;
  params: {
    key: string;
  };
}) {
  const key = props.params.key;
  console.log("CALLED", key);
  if (key === "service-worker.js") {
    redirect("/");
  }

  // Check if is bech32
  if (nip19.BECH32_REGEX.test(key)) {
    if (key.startsWith("npub")) {
      return props.profile;
    }
  }

  if (!key.startsWith("npub")) {
    console.log("Test", key);
    const npub = nip19.npubEncode(key);
    redirect(`/${npub}`);
  }

  // Check if var is Wallet address
  if (key.startsWith("note")) {
    return props.event;
  }
  return props.profile;
}
