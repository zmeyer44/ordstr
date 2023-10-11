import { NextRequest, NextResponse } from "next/server";
import getMetaData from "metadata-scraper";
import { z } from "zod";
const bodySchema = z.object({
  url: z.string(),
});
async function handler(req: NextRequest) {
  const body = await req.json();
  let { url } = bodySchema.parse(body);

  if (url.includes("open.spotify")) {
    url = url.split("?")[0] as string;
  } else if (url.startsWith("https://t.co/")) {
    const data = await getMetaData({
      url: url,
      ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
    });
    if (data.title) {
      url = data.title;
    }
  }

  const decode = decodeURIComponent(url);
  try {
    const metadata = await getMetaData({
      url: decode,
      ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
      customRules: {
        type: {
          rules: [
            [
              'meta[property="og:type"][content]',
              (element) => element.getAttribute("content"),
            ],
            [
              'meta[name="og:type"][content]',
              (element) => element.getAttribute("content"),
            ],
            [
              'meta[property="parsely-type"][content]',
              (element) => element.getAttribute("content"),
            ],
            [
              'meta[name="parsely-type"][content]',
              (element) => element.getAttribute("content"),
            ],
            [
              'meta[property="medium"][content]',
              (element) => element.getAttribute("content"),
            ],
            [
              'meta[name="medium"][content]',
              (element) => element.getAttribute("content"),
            ],
          ],
          processor: (value: any) =>
            value !== "music.song" ? value : "podcast",
        },
        published: {
          rules: [
            [
              'meta[property="article:published_time"][content]',
              (element) => element.getAttribute("content"),
            ],
            [
              'meta[name="article:published_time"][content]',
              (element) => element.getAttribute("content"),
            ],
            [
              'meta[property="published_time"][content]',
              (element) => element.getAttribute("content"),
            ],
            [
              'meta[name="published_time"][content]',
              (element) => element.getAttribute("content"),
            ],
            [
              'meta[property="parsely-pub-date"][content]',
              (element) => element.getAttribute("content"),
            ],
            [
              'meta[name="parsely-pub-date"][content]',
              (element) => element.getAttribute("content"),
            ],
            [
              'meta[property="sailthru.date"][content]',
              (element) => element.getAttribute("content"),
            ],
            [
              'meta[name="sailthru.date"][content]',
              (element) => element.getAttribute("content"),
            ],
            [
              'meta[property="date" i][content]',
              (element) => element.getAttribute("content"),
            ],
            [
              'meta[name="date" i][content]',
              (element) => element.getAttribute("content"),
            ],
            [
              'meta[property="release_date" i][content]',
              (element) => element.getAttribute("content"),
            ],
            [
              'meta[name="release_date" i][content]',
              (element) => element.getAttribute("content"),
            ],
            ["time[datetime]", (element) => element.getAttribute("datetime")],
            [
              "time[datetime][pubdate]",
              (element) => element.getAttribute("datetime"),
            ],
            [
              'meta[property="music:release_date"][content]',
              (element) => element.getAttribute("content"),
            ],
          ],
          processor: (value: any) =>
            Date.parse(value.toString())
              ? new Date(value.toString()).toISOString()
              : undefined,
        },
      },
    });
    const data = {
      ...metadata,
      url: decode,
    };
    return NextResponse.json({
      data,
    });
  } catch (err) {
    console.log("Error", err);
  }
}

export { handler as GET, handler as POST };
