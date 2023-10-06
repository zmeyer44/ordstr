"use client";
import { useState, useRef } from "react";
import Template from "./Template";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useAutosizeTextArea from "@/lib/hooks/useAutoSizeTextArea";
import { createEvent } from "@/lib/actions/create";
import { useNostr } from "nostr-react";
import { useModal } from "@/app/_providers/modalContext/provider";

export default function CreateEventModal() {
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const modal = useModal();
  const { publish } = useNostr();
  useAutosizeTextArea(textAreaRef.current, input);
  async function handleSubmit() {
    try {
      setIsLoading(true);
      await createEvent(
        {
          content: input,
          kind: 1,
          tags: [],
        },
        publish
      );
      setInput("");
      modal?.hide();
    } catch (err) {
      console.log("Error", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Template title="Create Event" className=" md:max-w-[400px]">
      <div className="flex flex-col gap-y-5">
        <Textarea
          ref={textAreaRef}
          autoFocus
          placeholder="Send a note"
          draggable={false}
          value={input}
          disabled={isLoading}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          rows={1}
          className="min-h-[42px] min-w-[300p]"
        />
        <Button onClick={() => void handleSubmit()} loading={isLoading}>
          Submit
        </Button>
      </div>
    </Template>
  );
}
