import Spinner from "@/components/spinner";

export default function Loading() {
  return (
    <div className="center h-screen w-full text-accent-foreground">
      <Spinner />
    </div>
  );
}
