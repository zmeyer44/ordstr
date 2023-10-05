import Image from "next/image";
import KindCard from "@/components/kindCards/1";
import Link from "next/link";
import Feed from "@/containers/Feed";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between p-24">
      {/* <Link href={"/"}>
        <KindCard
          clickable={true}
          title="Zach@ordstr.com"
          content="This is a test note on nostr. Making it about 2 lines long so it is somewhat realistic for client."
          timestamp={new Date()}
        />
      </Link> */}
      <div className="max-w-[600px]">
        <Feed />
      </div>
    </div>
  );
}
