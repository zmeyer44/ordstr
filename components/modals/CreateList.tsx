import { useState } from "react";
import { User } from "@/types";
import FormModal from "./FormModal";
import { z } from "zod";
import { useNostr, useNostrEvents } from "nostr-react";
import { createEvent } from "@/lib/actions/create";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { unixTimeNowInSeconds } from "@/lib/nostr/dates";
import { useModal } from "@/app/_providers/modalContext/provider";
import { toast } from "react-hot-toast";
import { randomId } from "@/lib/nostr";
import { useNDK } from "@/app/_providers/ndkProvider";
const CreateListSchema = z.object({
  name: z.string(),
  picture: z.string().optional(),
  description: z.string().optional(),
});

type CreateListType = z.infer<typeof CreateListSchema>;

export default function CreateList() {
  const modal = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const { currentUser, updateUser } = useCurrentUser();
  const { ndk } = useNDK();
  const { onDone } = useNostrEvents({
    filter: {
      kinds: [30001],
      authors: [currentUser?.pubkey as string],
      since: unixTimeNowInSeconds(),
      limit: 1,
      ["#d"]: [id as string],
    },
    enabled: !!id,
  });

  onDone(() => {
    console.log("Done!");
    setIsLoading(false);
    toast.success("List Created!");
    modal?.hide();
  });
  async function handleSubmit(data: CreateListType) {
    setIsLoading(true);
    const random = randomId();
    const tags = [
      ["name", data.name],
      ["title", data.name],
      ["d", random],
    ];
    if (data.description) {
      tags.push(["description", data.description]);
    }
    if (data.picture) {
      tags.push(["picture", data.picture]);
    }
    const result = await createEvent(ndk!, {
      content: "",
      kind: 30001,
      tags: tags,
    });
    setId(random);
  }
  return (
    <FormModal
      title="Create List"
      fields={[
        {
          label: "Name",
          type: "input",
          slug: "name",
        },
        {
          label: "Description",
          type: "text-area",
          slug: "description",
        },
        {
          label: "Picture",
          type: "input",
          slug: "picture",
        },
      ]}
      formSchema={CreateListSchema}
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
      cta={{
        text: "Create List",
      }}
    />
  );
}
