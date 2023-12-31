import { useState } from "react";
import { User } from "@/types";
import FormModal from "./FormModal";
import { z } from "zod";
import useEvents from "@/lib/hooks/useEvents";
import { createEvent } from "@/lib/actions/create";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { unixTimeNowInSeconds } from "@/lib/nostr/dates";
import { useModal } from "@/app/_providers/modalContext/provider";
import { toast } from "react-hot-toast";
import { useNDK } from "@/app/_providers/ndkProvider";
import { type NDKUserProfile } from "@nostr-dev-kit/ndk";

const EditProfileSchema = z.object({
  display_name: z.string().optional(),
  name: z.string().optional(),
  picture: z.string().optional(),
  about: z.string().optional(),
  website: z.string().optional(),
  nip05: z.string().optional(),
  lud16: z.string().optional(),
});

type EditProfileType = z.infer<typeof EditProfileSchema>;

type EditProfileModalProps = {
  profile?: NDKUserProfile;
};
export default function EditProfile({ profile }: EditProfileModalProps) {
  const modal = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [newData, setNewData] = useState<string | null>(null);
  const { currentUser, updateUser } = useCurrentUser();
  const { ndk } = useNDK();
  const { onDone } = useEvents({
    filter: {
      kinds: [0],
      authors: [currentUser?.hexpubkey as string],
      since: unixTimeNowInSeconds(),
      limit: 1,
    },
    enabled: !!newData,
  });
  //   onEvent((event) => {
  //     console.log("Event", event);
  //     if (event.content === newData) {
  //       updateUser(event.content);
  //       setIsLoading(false);
  //       toast.success("Profile Updated!");
  //       modal?.hide();
  //     }
  //   });
  onDone(() => {
    console.log("Done!");
    setIsLoading(false);
    toast.success("Profile Updated!");
    modal?.hide();
  });
  async function handleSubmit(userData: EditProfileType) {
    setIsLoading(true);
    const content = JSON.stringify(userData);
    const result = await createEvent(ndk!, {
      content,
      kind: 0,
      tags: [],
    });

    setNewData(content);
  }
  return (
    <FormModal
      title="Edit profile"
      fields={[
        {
          label: "Display name",
          type: "input",
          slug: "display_name",
        },
        {
          label: "Name",
          type: "input",
          slug: "name",
        },
        {
          label: "Picture",
          type: "input",
          slug: "picture",
        },
        {
          label: "About",
          type: "text-area",
          slug: "about",
        },
        {
          label: "Website",
          type: "input",
          slug: "website",
        },
        {
          label: "NIP-05",
          type: "input",
          slug: "nip05",
          placeholder: "name@example.com",
        },
        {
          label: "Bitcoin lightning address (lud16)",
          type: "input",
          slug: "lud16",
        },
      ]}
      defaultValues={{ ...profile, display_name: profile?.displayName } ?? {}}
      formSchema={EditProfileSchema}
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
      cta={{
        text: "Publish",
      }}
    />
  );
}
