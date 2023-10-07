import Link from "next/link";

import AccountButton from "./AccountButton";

export default function Header() {
  return (
    <div className="z-header sticky top-0 inset-x-0 flex flex-col items-stretch transition-all">
      <div className="px-4 pt-5 md:pt-10 md:px-10">
        <header className="mx-auto max-w-7xl overflow-hidden border-2 border-primary-foreground rounded-full bg-background-gray">
          <div className="flex items-stretch h-[50px] md:h-[60px] divide-primary-foreground divide-solid divide-x-2">
            <Link
              href="/"
              className="px-6 md:px-8 bg-accent/60 center hover:bg-accent/80"
            >
              <h1 className="text-primary-foreground uppercase font-bold">
                Ordstr
              </h1>
            </Link>
            <div className="grow"></div>
            <AccountButton />
          </div>
        </header>
      </div>
    </div>
  );
}
