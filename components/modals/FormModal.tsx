"use client";

import { useEffect, useState, useMemo, useRef, ReactNode } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FieldErrors,
  useForm,
  FieldValues,
  DefaultValues,
  Path,
} from "react-hook-form";

import { useRouter } from "next/navigation";
import { useModal } from "@/app/_providers/modalContext/provider";
import { cn } from "@/lib/utils";
import Template from "./Template";

import {
  Form,
  FormControl,
  FormDescription,
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

type FieldOptions =
  | "toggle"
  | "horizontal-tabs"
  | "input"
  | "text-area"
  | "custom";

type DefaultFieldType<TSchema> = {
  label: string;
  slug: keyof z.infer<z.Schema<TSchema>> & string;
  placeholder?: string;
  description?: string;
  lines?: number;
  styles?: string;
  value?: string | number | boolean;
  custom?: ReactNode;
  options?: { label: string; value: string; icon?: ReactNode }[];
};
type FieldType<TSchema> = DefaultFieldType<TSchema> &
  (
    | {
        type: "select";
        options: { label: string; value: string; icon?: ReactNode }[];
      }
    | {
        type: FieldOptions;
      }
  );

type FormModalProps<TSchema> = {
  title: string;
  fields: FieldType<TSchema>[];
  errors?: FieldErrors;
  isSubmitting?: boolean;
  cta: {
    text: string;
  };
  defaultValues?: Partial<z.infer<z.Schema<TSchema>>>;
  onSubmit: (props: z.infer<z.Schema<TSchema>>) => any;
  formSchema: z.Schema<TSchema>;
};

export default function FormModal<TSchema extends FieldValues>({
  title,
  fields,
  cta,
  errors,
  isSubmitting,
  formSchema,
  defaultValues,
  onSubmit,
}: FormModalProps<TSchema>) {
  type FormDataType = z.infer<typeof formSchema>;
  const form = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues as DefaultValues<TSchema>,
    mode: "onChange",
  });
  return (
    <Template title={title} className="md:max-w-[400px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {fields.map(
            ({
              label,
              slug,
              type,
              placeholder,
              description,
              ...fieldProps
            }) => (
              <FormField
                control={form.control}
                name={slug as Path<TSchema>}
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
                    {!!description && (
                      <FormDescription>{description}</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ),
          )}

          <Button type="submit" className="w-full" loading={isSubmitting}>
            {cta.text}
          </Button>
        </form>
      </Form>
    </Template>
    // <div className="w-full rounded-md bg-white md:max-w-md md:border md:border-gray-200 md:shadow">
    //   <form>
    //     <div
    //       className={cn("relative flex w-full flex-col space-y-4 p-5 md:p-10")}
    //     >
    //       <h2 className="font-cal text-2xl">{title}</h2>
    //       <div className="flex-col space-y-4">
    //         {fields.map((field) => {
    //           if (field.type === "toggle") {
    //             return (
    //               <div
    //                 key={field.slug}
    //                 className={cn("w-full", field.styles ? field.styles : "")}
    //               >
    //                 <ToggleInput
    //                   id={field.slug}
    //                   label={field.label}
    //                   checked={
    //                     formData?.[field.slug] ? !!formData[field.slug] : false
    //                   }
    //                   toggle={(value) =>
    //                     setFormData((prev: any) => ({
    //                       ...prev,
    //                       [field.slug]: value,
    //                     }))
    //                   }
    //                 />
    //               </div>
    //             );
    //           }
    //           if (field.type === "horizontal-tabs") {
    //             return (
    //               <div
    //                 key={field.slug}
    //                 className={cn("w-full", field.styles ? field.styles : "")}
    //               >
    //                 <HorizontalTabs
    //                   id={field.slug}
    //                   label={field.label}
    //                   options={field.options ?? []}
    //                   value={(formData[field.slug] as string) ?? ""}
    //                   setValue={(value: string) =>
    //                     setFormData((prev: any) => ({
    //                       ...prev,
    //                       [field.slug]: value,
    //                     }))
    //                   }
    //                 />
    //               </div>
    //             );
    //           }
    //           if (field.type === "text-area") {
    //             return (
    //               <div
    //                 key={field.slug}
    //                 className={cn("w-full", field.styles ? field.styles : "")}
    //               >
    //                 <TextArea
    //                   label={field.label}
    //                   id={field.slug}
    //                   disabled={loading}
    //                   rows={field.lines}
    //                   value={formData ? (formData[field.slug] as string) : ""}
    //                   onChange={(e) =>
    //                     setFormData((prev: any) => ({
    //                       ...prev,
    //                       [field.slug]: e.target.value,
    //                     }))
    //                   }
    //                   placeholder={field.placeholder}
    //                 />
    //               </div>
    //             );
    //           }
    //           if (field.type === "text") {
    //             return (
    //               <div
    //                 key={field.slug}
    //                 className={cn("w-full", field.styles ? field.styles : "")}
    //               >
    //                 <TextInput
    //                   id={field.slug}
    //                   label={field.label}
    //                   value={formData ? (formData[field.slug] as string) : ""}
    //                   onChange={(e) =>
    //                     setFormData((prev: any) => ({
    //                       ...prev,
    //                       [field.slug]: e.target.value,
    //                     }))
    //                   }
    //                   placeholder={field.placeholder}
    //                 />
    //               </div>
    //             );
    //           }
    //           return (
    //             <div
    //               key={field.slug}
    //               className={cn("w-full", field.styles ? field.styles : "")}
    //             >
    //               <span className="sr-only">{field.label}</span>
    //               {field.custom}
    //             </div>
    //           );
    //         })}
    //       </div>
    //     </div>
    //     <div className="flex items-center justify-end rounded-b-lg border-t border-gray-200 bg-gray-50 p-3 md:px-10">
    //       <ModalFooter
    //         actionButtonLoading={loading}
    //         actionButtonLabel={cta.text}
    //         actionButtonOnClick={handleSubmit}
    //         actionButtonType="button"
    //         actionButtonDisabled={loading}
    //       />
    //     </div>
    //   </form>
    // </div>
  );
}
