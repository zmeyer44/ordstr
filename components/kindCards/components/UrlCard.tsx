import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchMetadata } from "@/lib/fetchers/metadata";

type UrlCardProps = {
  url: string;
  metadata?: {
    title: string;
    image?: string;
    description?: string;
    creator?: string;
    type?: string;
    "theme-color"?: string;
  };
  className?: string;
};

export default function UrlCard({
  url,
  metadata: _metadata,
  className,
}: UrlCardProps) {
  const [metadata, setMetadata] = useState(_metadata);
  useEffect(() => {
    if (!metadata) {
      fetchMetadata(url)
        ?.then((r) => {
          if (r) {
            setMetadata(r.data);
          }
        })
        .catch((e) => console.log("fetch error"));
    }
  }, [url]);
  if (metadata) {
    return (
      <a href={url} target="_blank" rel="nonreferrer">
        <Card
          className={cn(
            "hover:theme-shadow relative flex flex-col overflow-hidden bg-background",
            className,
          )}
        >
          {metadata.image && (
            <div className="center relative aspect-[2/1] max-h-[200px] min-h-[70px] grow flex-col overflow-hidden">
              {/* <Image
                height="288"
                width="288"
                alt={metadata.title}
                src={metadata.image}
                unoptimized
                className="h-full w-full object-cover"
              /> */}
              <img
                alt={metadata.title}
                src={metadata.image}
                className={cn(
                  "standalone:h-full standalone:w-auto h-full w-full max-w-full object-cover object-center",
                )}
              />
            </div>
          )}
          <CardHeader
            className={cn("border-0", metadata.image && "border-t-2")}
          >
            <CardTitle className="line-clamp-2 text-[14px] font-medium leading-4">
              {metadata.title}
            </CardTitle>
            <CardDescription className="line-clamp-2 text-[12px] leading-4 text-primary">
              {metadata.description}
            </CardDescription>
          </CardHeader>
        </Card>
      </a>
    );
  }
  return null;
}
