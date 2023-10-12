import { type ComponentType } from "react";
import dynamic from "next/dynamic";
import { type Event } from "nostr-tools";

const KindCard1 = dynamic(() => import("./1"), {
  ssr: false,
});
const KindCard3745 = dynamic(() => import("./3745"), {
  ssr: false,
});
const KindCardDefault = dynamic(() => import("./default"), {
  ssr: false,
});
const componentMap: Record<number, ComponentType<KindCardProps>> = {
  1: KindCard1,
  3745: KindCard3745,
};

type KindCardProps = Event<number> & {
  clickable?: boolean;
};
export default function KindCards(props: KindCardProps) {
  const { kind } = props;
  const KindCard = componentMap[kind] ?? KindCardDefault;
  return <KindCard {...props} />;
}
