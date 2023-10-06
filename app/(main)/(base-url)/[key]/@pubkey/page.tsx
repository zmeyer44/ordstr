import MediumProfileCard from "@/components/profileCards/MediumCard";

type ProfilePageProps = {
  params: { key: string };
};

export default function ProfilePage({ params: { key } }: ProfilePageProps) {
  return (
    <div className="flex flex-col items-center justify-between p-24">
      <div className="">Profile: {key}</div>
      {/* <MediumProfileCard pubkey={key} /> */}
    </div>
  );
}
