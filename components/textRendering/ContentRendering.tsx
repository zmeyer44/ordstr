"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cleanUrl } from "@/lib/utils";
import useCacheFetch from "@/lib/hooks/useCacheFetch";
type ContentRenderingProps = {
  url: string;
  meta?: string[];
};

export default function ContentRendering({ url }: ContentRenderingProps) {
  const { data, isLoading } = useCacheFetch({ url });
  console.log("Content rendering", url, data);
  if (data) {
    if (data.type === "image") {
      return (
        <img
          src={url}
          alt="Image"
          className="pixelart my-2 h-full w-full max-w-[300px] rounded-xl object-cover"
        />
      );
    } else if (data.type === "link") {
      return (
        <a
          href={cleanUrl(url)}
          target="_blank"
          rel="noreferrer"
          className="w-[250px] overflow-hidden rounded-xl"
        >
          <div className="aspect-video">
            <img src={data.data.image} />
          </div>
          <div className="bg-background-gray">
            <h5>{data.data.title}</h5>
            <span>{data.data.description}</span>
          </div>
        </a>
      );
    }
  }
  return (
    <a
      className="text-primary-foreground hover:underline"
      href={cleanUrl(url)}
      target="_blank"
      rel="noreferrer"
    >
      {cleanUrl(url)}
    </a>
  );
}
