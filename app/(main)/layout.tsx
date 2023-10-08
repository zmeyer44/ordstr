import Header from "./_layoutComponents/Header";
import Footer from "./_layoutComponents/Footer";
import NewEventButton from "./_layoutComponents/NewEventButton";
import BottomNav from "./_layoutComponents/BottomNav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-[100svh] w-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
      </main>
      <BottomNav />
    </div>
  );
}
