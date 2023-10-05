export default function Footer() {
  return (
    <div className="mx-10">
      <footer className="max-w-7xl overflow-hidden border-2 border-b-0 border-primary-foreground rounded-t-xl bg-background-gray mx-auto">
        <div className="flex items-stretch h-[60px] divide-primary-foreground divide-solid divide-x-2">
          <div className="px-8 bg-accent/60 center">
            <h1 className="text-primary-foreground uppercase font-medium">
              Ordstr
            </h1>
          </div>
          <div className="grow"></div>
          <button className="px-8 hover:bg-primary/40">
            <h2 className="text-primary-foreground uppercase font-medium">
              Log In
            </h2>
          </button>
        </div>
      </footer>
    </div>
  );
}
