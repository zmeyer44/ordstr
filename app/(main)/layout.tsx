import Header from "./_layoutComponents/Header";
import Footer from "./_layoutComponents/Footer";
import NewEventButton from "./_layoutComponents/NewEventButton";
import { cn } from "@/lib/utils";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
      </main>
      <NewEventButton />
    </div>
  );
}
