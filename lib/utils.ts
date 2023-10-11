import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import advancedFormat from "dayjs/plugin/advancedFormat";
import timezone from "dayjs/plugin/timezone";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function relativeTimeUnix(timestamp: number) {
  const config = {
    thresholds: [
      { l: "s", r: 1 },
      { l: "m", r: 1 },
      { l: "mm", r: 59, d: "minute" },
      { l: "h", r: 1 },
      { l: "hh", r: 23, d: "hour" },
      { l: "d", r: 1 },
      { l: "dd", r: 364, d: "day" },
      { l: "y", r: 1 },
      { l: "yy", d: "year" },
    ],
    rounding: Math.floor,
  };
  dayjs.extend(updateLocale);

  dayjs.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s ago",
      s: "%s seconds",
      m: "1 min",
      mm: "%d mins",
      h: "1 hour",
      hh: "%d hours",
      d: "1 day",
      dd: "%d days",
      y: "1 year",
      yy: "%d years",
    },
  });
  dayjs.extend(relative, config);
  return dayjs(timestamp * 1000).fromNow();
}
export function relativeTime(timestamp: Date) {
  const config = {
    thresholds: [
      { l: "s", r: 1 },
      { l: "m", r: 1 },
      { l: "mm", r: 59, d: "minute" },
      { l: "h", r: 1 },
      { l: "hh", r: 23, d: "hour" },
      { l: "d", r: 1 },
      { l: "dd", r: 364, d: "day" },
      { l: "y", r: 1 },
      { l: "yy", d: "year" },
    ],
    rounding: Math.floor,
  };
  dayjs.extend(updateLocale);

  dayjs.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s ago",
      s: "%s seconds",
      m: "1 min",
      mm: "%d mins",
      h: "1 hour",
      hh: "%d hours",
      d: "1 day",
      dd: "%d days",
      y: "1 year",
      yy: "%d years",
    },
  });
  dayjs.extend(relative, config);
  return dayjs(timestamp).fromNow();
}
export function formatCount(count: number) {
  if (count < 1000) {
    return count;
  } else if (count < 1_000_000) {
    return `${Number((count / 1000).toFixed(1))}K`;
  } else {
    return `${Number((count / 1_000_000).toFixed(1))}M`;
  }
}
export function cleanUrl(url?: string) {
  if (!url) return "";
  if (url.slice(-1) === ".") {
    return url.slice(0, -1);
  }
  return url;
}

export function truncateText(text: string, size?: number) {
  let length = size ?? 5;
  return text.slice(0, length) + "..." + text.slice(-length);
}

export function removeDuplicates<T>(data: T[], key?: keyof T) {
  if (key) {
    const unique = data.filter((obj, index) => {
      return index === data.findIndex((o) => obj[key] === o[key]);
    });
    return unique;
  } else {
    return data.filter((obj, index) => {
      return index === data.findIndex((o) => obj === o);
    });
  }
}

export async function copyText(text: string) {
  return await navigator.clipboard.writeText(text);
}
export function formatNumber(number: number) {
  if (typeof number === "number") {
    return number.toLocaleString("en-US");
  } else return "not a number";
}
export function log(
  isOn: boolean | undefined,
  type: "info" | "error" | "warn",
  ...args: unknown[]
) {
  if (!isOn) return;
  console[type](...args);
}

export function validateUrl(value: string) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    value,
  );
}
