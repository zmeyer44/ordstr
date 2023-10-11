import { useEffect, useState } from "react";
import { User } from "@/types";
import FormModal from "./FormModal";
import { z } from "zod";
import useEvents from "@/lib/hooks/useEvents";
import { updateList } from "@/lib/actions/create";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { unixTimeNowInSeconds } from "@/lib/nostr/dates";
import { useModal } from "@/app/_providers/modalContext/provider";
import { toast } from "react-hot-toast";
import { useNDK } from "@/app/_providers/ndkProvider";
import { NostrEvent } from "@nostr-dev-kit/ndk";
import { getTagValues } from "@/lib/nostr/utils";

const EditListSchema = z.object({
  title: z.string(),
  picture: z.string().optional(),
  description: z.string().optional(),
});

type EditListType = z.infer<typeof EditListSchema>;

type EditListModalProps = {
  listEvent: NostrEvent;
};
export default function EditList({ listEvent }: EditListModalProps) {
  const modal = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { currentUser, updateUser } = useCurrentUser();
  const { ndk } = useNDK();
  const { events } = useEvents({
    filter: {
      kinds: [listEvent.kind as number],
      authors: [listEvent.pubkey],
      since: unixTimeNowInSeconds() - 10,
      limit: 1,
    },
    enabled: sent,
  });
  useEffect(() => {
    if (events.length) {
      console.log("Done!");
      setIsLoading(false);
      toast.success("List Updated!");
      modal?.hide();
    }
  }, [events]);

  async function handleSubmit(listData: EditListType) {
    setIsLoading(true);
    const newTags = Object.entries(listData);
    setSent(true);
    console.log("CURRent time", unixTimeNowInSeconds());
    const result = await updateList(ndk!, listEvent, newTags);
  }
  const defaultValues: Partial<EditListType> = {
    title:
      getTagValues("title", listEvent.tags) ??
      getTagValues("name", listEvent.tags),
    picture: getTagValues("picture", listEvent.tags),
    description: getTagValues("description", listEvent.tags),
  };

  return (
    <FormModal
      title="Edit List"
      fields={[
        {
          label: "Title",
          type: "input",
          slug: "title",
        },
        {
          label: "Picture",
          type: "input",
          slug: "picture",
        },
        {
          label: "Description",
          type: "text-area",
          slug: "description",
        },
      ]}
      defaultValues={defaultValues ?? {}}
      formSchema={EditListSchema}
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
      cta={{
        text: "Save",
      }}
    />
  );
}
