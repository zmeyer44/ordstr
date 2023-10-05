type EventPageProps = {
  params: { key: string };
};

export default function EventPage({ params: { key } }: EventPageProps) {
  return <div className="">Event: {key}</div>;
}
