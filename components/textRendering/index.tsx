import { cleanUrl } from "@/lib/utils";

const RenderText = ({ text }: { text?: string }) => {
  if (!text) return null;
  const Elements: JSX.Element[] = [];
  const combinedRegex =
    /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))|((?:^|\s)\@(\w+)\b)/g;
  const urlRegex =
    /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/g;
  const usernameRegex = /(?:^|\s)\@(\w+)\b/g;
  // Get Array of URLs
  const specialValuesArray = text.match(combinedRegex);
  const formattedText = text.replace(combinedRegex, "##[link]##");

  const cleanTextArray = formattedText.split("##[link]##");

  cleanTextArray.forEach((string, index) => {
    const jsxElement = <span>{string}</span>;
    Elements.push(jsxElement);
    let specialElement;
    if (specialValuesArray?.length && specialValuesArray.length > index) {
      if (specialValuesArray[index]?.match(urlRegex)) {
        // specialElement = (
        //   <a
        //     className="text-blue-600 hover:underline"
        //     href={cleanUrl(specialValuesArray[index])}
        //     target="_blank"
        //     rel="noreferrer"
        //   >
        //     {cleanUrl(specialValuesArray[index])}
        //   </a>
        // );
        specialElement = <span>{cleanUrl(specialValuesArray[index])}</span>;
      } else if (specialValuesArray[index]?.match(usernameRegex)) {
        // specialElement = (
        //   <Link href={`/${specialValuesArray[index]?.substring(1)}`}>
        //     <span className="text-theme-600 hover:underline cursor-pointer">
        //       {specialValuesArray[index]}
        //     </span>
        //   </Link>
        // );
        specialElement = <span className="">{specialValuesArray[index]}</span>;
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
