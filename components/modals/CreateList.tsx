import { useEffect, useState } from "react";
import { User } from "@/types";
import FormModal from "./FormModal";
import { z } from "zod";
import useEvents from "@/lib/hooks/useEvents";
import { createEvent, updateList } from "@/lib/actions/create";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { unixTimeNowInSeconds } from "@/lib/nostr/dates";
import { useModal } from "@/app/_providers/modalContext/provider";
import { toast } from "react-hot-toast";
import { randomId } from "@/lib/nostr";
import { useNDK } from "@/app/_providers/ndkProvider";
import { useLists } from "@/app/_providers/listProvider";
import { NDKEvent, NDKList } from "@nostr-dev-kit/ndk";
import {
  useSigner,
  type SignerStoreItem,
} from "@/app/_providers/signerProvider";
import { getTagValues } from "@/lib/nostr/utils";
import { saveEphemeralSigner } from "@/lib/actions/ephemeral";

const CreateListSchema = z.object({
  title: z.string(),
  picture: z.string().optional(),
  description: z.string().optional(),
  private: z.boolean(),
});

type CreateListType = z.infer<typeof CreateListSchema>;

export default function CreateList() {
  const modal = useModal();
  const { getLists } = useLists()!;
  const [isLoading, setIsLoading] = useState(false);
  const [delegateSigner, setDelegateSigner] = useState<SignerStoreItem>();
  const [fetchingSigner, setFetchingSigner] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const { currentUser, updateUser } = useCurrentUser();
  const { ndk } = useNDK();
  const { getSigner } = useSigner()!;

  // const { events } = useEvents({
  //   filter: {
  //     kinds: [30001],
  //     authors: [currentUser!.hexpubkey as string],
  //     since: unixTimeNowInSeconds() - 10,
  //     limit: 1,
  //     ["#d"]: [id as string],
  //   },
  //   enabled: !!id,
  // });

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
      tags.push(["summary", data.description]);
    }
    if (data.picture) {
      tags.push(["picture", data.picture]);
    }
    if (data.private) {
      tags.push(["private", "true"]);
      tags.push(["price", "0.00002", "btc", "year"]);
    }
    const event = await createEvent(ndk!, {
      content: "",
      kind: 30001,
      tags: tags,
    });
    if (event && getTagValues("private", event.tags)) {
      await getSigner(new NDKList(ndk))
        .then((delegateSigner) =>
          saveEphemeralSigner(ndk!, delegateSigner.signer, {
            associatedEvent: event,
            keyProfile: {
              name: delegateSigner.title,
              picture: currentUser?.profile?.image,
              lud06: currentUser?.profile?.lud06,
              lud16: currentUser?.profile?.lud16,
            },
          }),
        )
        .then((savedSigner) =>
          updateList(ndk!, event.rawEvent(), [
            ["delegate", savedSigner.hexpubkey],
          ]),
        )
        .catch((err) => console.log("Error creating delegate"));
    }
    getLists(currentUser!.hexpubkey);
    setIsLoading(false);
    toast.success("List Created!");
    modal?.hide();
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
        {
          label: "Private",
          type: "toggle",
          slug: "private",
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
