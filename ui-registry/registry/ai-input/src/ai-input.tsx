"use client";

import { FormEvent, useState } from "react";
import { Loader2, Mic, Send } from "lucide-react";

export interface AIInputProps {
  placeholder?: string;
  onSubmit?: (value: string) => Promise<void> | void;
  onVoiceRequest?: () => Promise<void> | void;
  autoFocus?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
}

export function AIInput({
  placeholder = "Type a message...",
  onSubmit,
  onVoiceRequest,
  autoFocus,
  isLoading = false,
  disabled = false,
}: AIInputProps) {
  const [value, setValue] = useState("");
  const isDisabled = disabled || isLoading;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!onSubmit || !value.trim()) return;
    const nextValue = value.trim();
    setValue("");
    await onSubmit(nextValue);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 rounded-2xl border bg-background px-4 py-3 shadow-sm"
    >
      <textarea
        name="message"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        rows={1}
        autoFocus={autoFocus}
        disabled={isDisabled}
        className="min-h-[40px] w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      <div className="flex items-center gap-1">
        {onVoiceRequest ? (
          <button
            type="button"
            onClick={() => onVoiceRequest?.()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isDisabled}
          >
            <Mic className="h-4 w-4" />
            <span className="sr-only">Start voice input</span>
          </button>
        ) : null}
        <button
          type="submit"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isDisabled || !value.trim()}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          <span className="sr-only">Send message</span>
        </button>
      </div>
    </form>
  );
}

export default AIInput;
