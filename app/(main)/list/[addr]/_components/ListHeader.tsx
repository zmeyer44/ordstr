import { nip19, type Event } from "nostr-tools";
import { Card, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getTagValues } from "@/lib/nostr/utils";
import { MdContentCopy } from "react-icons/md";
import { toast } from "react-hot-toast";
import { RenderText } from "@/components/textRendering";
import { copyText, truncateText } from "@/lib/utils";

type ListHeaderProps = {
  event: Event;
  actions?: { element: () => JSX.Element }[];
};

export default function ListHeader({ event, actions }: ListHeaderProps) {
  const identifier = getTagValues("d", event.tags);
  const name =
    getTagValues("name", event.tags) ??
    (getTagValues("title", event.tags) || "List");
  const picture = getTagValues("picture", event.tags);
  const description = getTagValues("description", event.tags);
  const naddr = nip19.naddrEncode({
    identifier: identifier,
    kind: event.kind,
    pubkey: event.pubkey,
  });
  return (
    <Card className="relative w-full rounded-xl @container">
      {/* <div className="absolute left-0 top-0 z-50">
            <div className="h-4 w-4 bg-red-300 @sm:hidden" />
            <div className="hidden h-4 w-4 bg-purple-300 @sm:block" />
            <div className="hidden h-4 w-4 bg-blue-300 @md:block" />
            <div className="hidden h-4 w-4 bg-green-300 @lg:block" />
            <div className="hidden h-4 w-4 bg-yellow-300 @xl:block" />
          </div> */}
      <div className="relative max-h-[150px] overflow-hidden">
        <div className="relative bg-background pb-[80px] @md:pb-[20%]">
          <div className="absolute inset-0 max-h-[150px] bg-accent/40">
            {/* <img src={user?.banner} className="h-full w-full object-cover" /> */}
          </div>
        </div>
      </div>
      <div className="font-title relative mt-[-1px] border-t-2 bg-background text-primary-foreground">
        {/* Top Row */}
        <div className="flex items-start pb-[5px] @lg:pb-[6px]">
          {/* PFP */}
          <div className="mb-[1px] ml-[10px] mt-[-40px] @sm:ml-[16px] @sm:mt-[-40px] @md:ml-[24px] @md:mt-[-47px] @lg:mt-[-50px] @2xl:mt-[-65px]">
            <div className="relative aspect-square w-[70px] overflow-hidden rounded-xl bg-background @sm:w-[75px] @md:w-[90px] @lg:w-[100px] @2xl:w-[120px]">
              <Avatar className="h-full w-full overflow-hidden  rounded-xl border-2 bg-accent/60">
                <AvatarImage className="bg-transparent" src={picture} />
                <AvatarFallback className="bg-transparent text-[24px] uppercase leading-5 @md:text-[32px]">
                  {name.at(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-x-3 py-2">
            {actions?.map(({ element: Element }) => <Element />)}

            <div className="rounded-md bg-foreground">
              {/* <ShareButton ordinalsAddress={user.ordinalsAddress} /> */}
            </div>
          </div>
        </div>
        <div className="space-y-3.5 p-4 pt-0 @sm:p-6 @sm:pt-0 @md:p-6 @md:pt-2 @lg:space-y-5">
          {/* User Top Line Info */}
          <div className="@lg:space-y-1.5">
            <div className="flex items-end gap-x-3 truncate">
              <h1 className="text-lg font-semibold @md:text-xl  @lg:text-2xl">
                {name}
              </h1>
            </div>
            <div className="">
              <button
                className="flex items-center text-xs font-light transition-colors hover:text-accent @sm:text-sm @lg:text-[16px]"
                onClick={() => {
                  void copyText(naddr);
                  toast.success(`Copied naddr`);
                }}
              >
                <p className="line-clamp-1 flex items-center  break-all ">
                  {truncateText(naddr, 5)}
                </p>
                <MdContentCopy className="ml-1.5 h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* About */}
          <div className="max-w-lg @lg:max-w-3xl">
            <p className="text-text-strong text-[14px] font-light @lg:text-[15px]">
              <RenderText text={description ?? ""} />
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
