import { useEffect, useState } from "react";
import { User } from "@/types";
import FormModal from "./FormModal";
import { z } from "zod";
import useEvents from "@/lib/hooks/useEvents";
import { createEvent } from "@/lib/actions/create";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { unixTimeNowInSeconds } from "@/lib/nostr/dates";
import { useModal } from "@/app/_providers/modalContext/provider";
import { toast } from "react-hot-toast";
import { randomId } from "@/lib/nostr";
import { useNDK } from "@/app/_providers/ndkProvider";
import { useLists } from "@/app/_providers/listProvider";
const CreateListSchema = z.object({
  title: z.string(),
  picture: z.string().optional(),
  description: z.string().optional(),
});

type CreateListType = z.infer<typeof CreateListSchema>;

export default function CreateList() {
  const modal = useModal();
  const { getLists } = useLists()!;
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const { currentUser, updateUser } = useCurrentUser();
  const { ndk } = useNDK();
  const { events } = useEvents({
    filter: {
      kinds: [30001],
      authors: [currentUser?.hexpubkey as string],
      since: unixTimeNowInSeconds() - 10,
      limit: 1,
      ["#d"]: [id as string],
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (events.length) {
      console.log("Done!");
      getLists(currentUser!.hexpubkey);
      setIsLoading(false);
      toast.success("List Created!");
      modal?.hide();
    }
  }, [events]);

  async function handleSubmit(data: CreateListType) {
    setIsLoading(true);
    const random = randomId();
    const tags = [
      ["title", data.title],
      ["name", data.title],
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
          label: "Title",
          type: "input",
          slug: "title",
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
