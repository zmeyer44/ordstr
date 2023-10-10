import { useState } from "react";
import { User } from "@/types";
import FormModal from "./FormModal";
import { useNDK } from "@/app/_providers/ndkProvider";
// import { useNDK } from "@nostr-dev-kit/ndk-react";
import { z } from "zod";
import { useNostr, useNostrEvents } from "nostr-react";
import { createEventNew } from "@/lib/actions/create";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { unixTimeNowInSeconds } from "@/lib/nostr/dates";
import { useModal } from "@/app/_providers/modalContext/provider";
import { toast } from "react-hot-toast";
import { randomId } from "@/lib/nostr";
const CreateListSchema = z.object({
  title: z.string().optional(),
  content: z.string(),
  sender: z.enum(["self", "delegate"]).optional(),
});

type CreateListType = z.infer<typeof CreateListSchema>;

export default function CreateList() {
  const modal = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const { currentUser, updateUser } = useCurrentUser();
  const { ndk, signer } = useNDK();

  const { onDone } = useNostrEvents({
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

  async function handleSubmit(data: CreateListType) {
    setIsLoading(true);
    const tags = [];
    if (data.title) {
      tags.push(["title", data.title]);
    }

    const result = await createEventNew(ndk!, {
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
          label: "Title",
          type: "input",
          slug: "title",
        },
        {
          label: "Content",
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
      formSchema={CreateListSchema}
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
      cta={{
        text: "Create Event",
      }}
    />
  );
}
