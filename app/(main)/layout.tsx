import Header from "./_layoutComponents/Header";
import Footer from "./_layoutComponents/Footer";
import BottomNav from "./_layoutComponents/BottomNav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-screen flex min-h-[100svh] w-full flex-col overflow-x-hidden ">
      <div className="fixed inset-x-0 top-0 z-header">
        <Header />
      </div>
      <div className="h-[74px] md:h-[104px]" />

      <main className="flex flex-1 flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
      </main>
      <BottomNav />
    </div>
  );
}
