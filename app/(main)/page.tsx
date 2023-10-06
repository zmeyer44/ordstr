import Image from "next/image";
import KindCard from "@/components/kindCards/1";
import Link from "next/link";
import Feed from "@/containers/Feed";

export default function Home() {
  return (
    <div className="pt-10">
      <div className="max-w-[600px] px-4 sm:px-10 md:px-10 mx-auto">
        <Feed />
      </div>
    </div>
  );
}
