export default function Footer() {
  return (
    <div className="mx-4 md:mx-10">
      <footer className="mx-auto max-w-7xl overflow-hidden rounded-t-xl border-2 border-b-0 border-primary-foreground bg-background-gray">
        <div className="flex h-[60px] items-stretch divide-x-2 divide-solid divide-primary-foreground">
          <div className="center bg-accent/60 px-8">
            <h1 className="font-medium uppercase text-primary-foreground">
              Ordstr
            </h1>
          </div>
          <div className="grow"></div>
          <a
            href="https://twitter.com/zachmeyer_"
            target="_blank"
            rel="nonreferrer"
            className="center px-8 hover:bg-primary/40"
          >
            <h2 className="font-medium text-primary-foreground">
              Made with &nbsp;🧡
            </h2>
          </a>
        </div>
      </footer>
    </div>
  );
}
