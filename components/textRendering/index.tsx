import { cleanUrl } from "@/lib/utils";
import Link from "next/link";
const RenderText = ({ text }: { text?: string }) => {
  if (!text) return null;
  const Elements: JSX.Element[] = [];
  const urlRegex =
    /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/g;
  const hashtagRegex = /#\b\w+\b/g;
  const usernameRegex = /(?:^|\s)\@(\w+)\b/g;
  const combinedRegex = new RegExp(
    `(${urlRegex.source}|${hashtagRegex.source}|${usernameRegex.source})`,
    "g"
  );
  // Get Array of URLs
  const specialValuesArray = text.match(combinedRegex);
  const formattedText = text.replace(combinedRegex, "##[link]##");

  const cleanTextArray = formattedText.split("##[link]##");

  cleanTextArray.forEach((string, index) => {
    const jsxElement = <span className="">{string}</span>;
    Elements.push(jsxElement);
    let specialElement;
    if (specialValuesArray?.length && specialValuesArray.length > index) {
      if (specialValuesArray[index]?.match(urlRegex)) {
        specialElement = (
          <a
            className="text-primary-foreground hover:underline"
            href={cleanUrl(specialValuesArray[index])}
            target="_blank"
            rel="noreferrer"
          >
            {cleanUrl(specialValuesArray[index])}
          </a>
        );
        // specialElement = <span>{cleanUrl(specialValuesArray[index])}</span>;
      } else if (specialValuesArray[index]?.match(hashtagRegex)) {
        specialElement = (
          <Link href={`/?t=${specialValuesArray[index]?.substring(1)}`}>
            <span className="text-primary-foreground hover:underline">
              {specialValuesArray[index]}
            </span>
          </Link>
        );
        // specialElement = <span className="">{specialValuesArray[index]}</span>;
      }
      if (specialElement) {
        Elements.push(specialElement);
      }
    }
  });

  return (
    <>
      {Elements.map((el, index) => (
        <span key={index}>{el}</span>
      ))}
    </>
  );
};

export { RenderText };
