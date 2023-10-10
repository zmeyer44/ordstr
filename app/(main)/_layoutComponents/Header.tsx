import Link from "next/link";

import AccountButton from "./AccountButton";

export default function Header() {
  return (
    <div className="sticky inset-x-0 top-0 z-header flex flex-col items-stretch transition-all">
      <div className="px-4 pt-5 md:px-10 md:pt-10">
        <header className="mx-auto max-w-7xl overflow-hidden rounded-full border-2 border-primary-foreground bg-background-gray">
          <div className="flex h-[50px] items-stretch divide-x-2 divide-solid divide-primary-foreground md:h-[60px]">
            <Link
              href="/"
              className="center bg-accent/60 px-6 hover:bg-accent/80 md:px-8"
            >
              <h1 className="font-bold uppercase text-primary-foreground">
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
