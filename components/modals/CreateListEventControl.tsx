"use client";

import { useEffect, useState, useMemo, useRef, ReactNode } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {
  FieldErrors,
  useForm,
  FieldValues,
  DefaultValues,
  Path,
} from "react-hook-form";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useModal } from "@/app/_providers/modalContext/provider";
import { validateUrl } from "@/lib/utils";
import Template from "./Template";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useNDK } from "@/app/_providers/ndkProvider";
import {
  createEventOnList,
  createEncryptedEventOnPrivateList,
} from "@/lib/actions/create";
import { NDKEvent, NDKList } from "@nostr-dev-kit/ndk";
import { NostrEvent } from "@nostr-dev-kit/ndk";
import {
  useSigner,
  type SignerStoreItem,
} from "@/app/_providers/signerProvider";
import { getTagValues } from "@/lib/nostr/utils";
import { saveEphemeralSigner } from "@/lib/actions/ephemeral";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { fetchMetadata } from "@/lib/fetchers/metadata";
import UrlCard from "../kindCards/components/UrlCard";

const metadataSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  creator: z.string().optional(),
  type: z.string().optional(),
  "theme-color": z.string().optional(),
});

type MetadataType = z.infer<typeof metadataSchema>;

const CreateListEventSchema = z.object({
  content: z.string().optional(),
  link: z.string().url(),
  sender: z.enum(["self", "delegate"]).optional(),
});

type CreateListEventType = z.infer<typeof CreateListEventSchema>;

type CreateListEventProps = {
  listEvent: NostrEvent;
};

const fields = [
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
    placeholder: "Any thoughts on this?",
  },
  {
    label: "Publish as",
    slug: "sender",
    type: "select",
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
];

export default function CreateListEvent({ listEvent }: CreateListEventProps) {
  const modal = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [delegateSigner, setDelegateSigner] = useState<SignerStoreItem>();
  const [fetchingSigner, setFetchingSigner] = useState(false);
  const [metadata, setMetadata] = useState<MetadataType | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const { ndk, signer } = useNDK();
  const { currentUser } = useCurrentUser();
  const isPrivate = getTagValues("private", listEvent.tags);
  const { getSigner } = useSigner()!;

  async function onSubmit(data: CreateListEventType) {
    setIsLoading(true);
    const tags = [["r", data.link]];
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        if (value) {
          tags.push([key, value]);
        }
      });
    }
    if (isPrivate) {
      console.log("Creating private event");
      if (!delegateSigner?.signer) {
        toast.error("No signer created");
        return;
      }
      console.log("Delegate signer", delegateSigner);
      if (!delegateSigner?.saved) {
        console.log("Saving delegate...");
        await saveEphemeralSigner(ndk!, delegateSigner.signer, {
          associatedEvent: new NDKEvent(ndk, listEvent),
          keyProfile: {
            name: delegateSigner.title,
            picture: currentUser?.profile?.image,
            lud06: currentUser?.profile?.lud06,
            lud16: currentUser?.profile?.lud16,
          },
        });
      }
      const result = await createEncryptedEventOnPrivateList(
        ndk!,
        {
          content: data.content ?? "",
          kind: 1,
          tags: tags,
        },
        new NDKList(ndk, listEvent),
        delegateSigner.signer,
      );

      console.log("Result", result);
      if (result) {
        toast.success("Private Note added!");
        modal?.hide();
        return;
      }
    } else {
      if (data.sender === "delegate" && !delegateSigner?.saved) {
        // Ephemeral key must be saved
        if (!delegateSigner?.signer) {
          toast.error("No signer created");
          return;
        }
        try {
          console.log("Delegate signer", delegateSigner);
          await saveEphemeralSigner(ndk!, delegateSigner.signer, {
            associatedEvent: new NDKEvent(ndk, listEvent),
            keyProfile: {
              name: delegateSigner.title,
              picture: currentUser?.profile?.image,
              lud06: currentUser?.profile?.lud06,
              lud16: currentUser?.profile?.lud16,
            },
          });
          console.log("Ephemeral signer created!");
        } catch (e) {
          console.error(e);
          throw e;
        }
      }
      const result = await createEventOnList(
        ndk!,
        {
          content: data.content ?? "",
          kind: 1,
          tags: tags,
        },
        new NDKList(ndk, listEvent),
        data.sender === "delegate" ? delegateSigner?.signer : undefined,
      );
      console.log("Result", result);
      if (result) {
        toast.success("Note added!");
        modal?.hide();
      }
    }
  }

  const form = useForm<CreateListEventType>({
    resolver: zodResolver(CreateListEventSchema),
    mode: "onChange",
    defaultValues: {
      sender: "self",
    },
  });
  const { watch, setValue } = form;
  const link = watch("link");
  const sender = watch("sender");
  const debouncedLink = useDebounce<string>(link, 300);

  useEffect(() => {
    if (sender === "delegate") {
      setFetchingSigner(true);
      void getSigner(new NDKList(ndk, listEvent))
        .then((r) => setDelegateSigner(r))
        .finally(() => setFetchingSigner(false));
    }
  }, [sender]);
  useEffect(() => {
    if (isPrivate && !delegateSigner) {
      setFetchingSigner(true);
      void getSigner(new NDKList(ndk, listEvent))
        .then((r) => setDelegateSigner(r))
        .finally(() => setFetchingSigner(false));
    }
  }, [isPrivate]);

  useEffect(() => {
    if (validateUrl(debouncedLink)) {
      fetchMetadata(debouncedLink)
        ?.then((r) => {
          setMetadata(r.data);
        })
        .catch((e) => console.log("fetch error"));
    }
  }, [debouncedLink]);

  return (
    <Template title="Create Note" className="md:max-w-[400px]">
      {metadata && (
        <div className="center pointer-events-none mb-2 space-y-6">
          <UrlCard url={link} metadata={metadata} />
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {fields.map(({ label, slug, type, placeholder, ...fieldProps }) => {
            if (isPrivate && slug === "sender") return null;
            return (
              <FormField
                key={slug}
                control={form.control}
                name={slug as Path<CreateListEventType>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    {type === "input" ? (
                      <FormControl>
                        <Input placeholder={placeholder} {...field} />
                      </FormControl>
                    ) : type === "text-area" ? (
                      <FormControl>
                        <Textarea
                          placeholder={placeholder}
                          {...field}
                          className="auto-sizing"
                        />
                      </FormControl>
                    ) : type === "select" ? (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={placeholder} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="z-modal+">
                          {fieldProps.options?.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <FormControl>
                        <Input placeholder={placeholder} {...field} />
                      </FormControl>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}

          <Button
            type="submit"
            className="w-full"
            loading={isLoading || fetchingSigner}
          >
            Publish
          </Button>
        </form>
      </Form>
    </Template>
  );
}
