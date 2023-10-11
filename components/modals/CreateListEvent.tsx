import { useState } from "react";
import { User } from "@/types";
import FormModal from "./FormModal";
import { useNDK } from "@/app/_providers/ndkProvider";
import { z } from "zod";
import useEvents from "@/lib/hooks/useEvents";
import { createEvent } from "@/lib/actions/create";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { unixTimeNowInSeconds } from "@/lib/nostr/dates";
import { useModal } from "@/app/_providers/modalContext/provider";
import { toast } from "react-hot-toast";
import { randomId } from "@/lib/nostr";

const CreateListEventSchema = z.object({
  content: z.string(),
  link: z.string().url(),
  sender: z.enum(["self", "delegate"]).optional(),
});

type CreateListEventType = z.infer<typeof CreateListEventSchema>;

type CreateListEventProps = {
  listAddress: string;
};

export default function CreateListEvent({ listAddress }: CreateListEventProps) {
  const modal = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const { currentUser, updateUser } = useCurrentUser();
  const { ndk, signer } = useNDK();
  const { onDone } = useEvents({
    filter: {
      kinds: [1],
      authors: [currentUser?.pubkey as string],
      since: unixTimeNowInSeconds(),
      limit: 1,
    },
    enabled: !!content,
  });

  onDone(() => {
    console.log("Done!");
    setIsLoading(false);
    toast.success("Note Created!");
    modal?.hide();
  });

  async function handleSubmit(data: CreateListEventType) {
    setIsLoading(true);
    const tags = [["r", data.link]];

    const result = await createEvent(ndk!, {
      content: data.content,
      kind: 1,
      tags: tags,
    });
    setContent(data.content);
    console.log("Result", result);
  }
  return (
    <FormModal
      title="Create Note"
      fields={[
        {
          label: "Link",
          type: "input",
          slug: "link",
          placeholder: "https://",
        },
        {
          label: "Notes",
          type: "text-area",
          slug: "content",
        },
        {
          label: "Publish as",
          slug: "sender",
          type: "select",
          value: "self",
          options: [
            {
              label: "Self",
              value: "self",
            },
            {
              label: "Delegate",
              value: "delegate",
            },
          ],
        },
      ]}
      formSchema={CreateListEventSchema}
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
      cta={{
        text: "Create Event",
      }}
    />
  );
}
