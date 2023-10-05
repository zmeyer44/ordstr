export default function Layout(props: {
  children: React.ReactNode;
  event: React.ReactNode;
  pubkey: React.ReactNode;
  params: {
    key: string;
  };
}) {
  const key = props.params.key;

  // Check if var is Wallet address
  if (key.startsWith("note")) {
    return props.event;
  }
  return props.pubkey;
}
