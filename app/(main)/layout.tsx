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
    <div className="max-w-screen relative flex min-h-[100svh] w-full flex-col overflow-x-hidden">
      <Header />
      <main className="flex flex-1 flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
      </main>
      <BottomNav />
    </div>
  );
}
