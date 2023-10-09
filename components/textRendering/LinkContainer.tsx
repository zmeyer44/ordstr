type LinkContainerProps = {
  url: string;
  title: string;
  image?: string;
  description?: string;
};

export default function LinkContainer({
  url,
  title,
  image,
  description,
}: LinkContainerProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="block w-[250px] overflow-hidden rounded-xl border-2"
    >
      <div className="aspect-video bg-background-gray">
        <img src={image} alt="image" className="h-full w-full object-cover" />
      </div>
      <div className="h-[55px] max-w-full break-all bg-background px-3 py-2">
        <h5 className="truncate break-all">{title}</h5>
        <span>{description}</span>
      </div>
    </a>
  );
}
