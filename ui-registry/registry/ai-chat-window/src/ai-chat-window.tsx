"use client";

import { FormEvent, useEffect, useRef, useState, type ReactNode } from "react";
import { Loader2, Send } from "lucide-react";

type MessageRole = "user" | "assistant" | "system";

export interface AIChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp?: string;
}

export interface AIChatWindowProps {
  messages: AIChatMessage[];
  onSendMessage?: (message: string) => Promise<void> | void;
  isStreaming?: boolean;
  title?: string;
  inputPlaceholder?: string;
  disabled?: boolean;
  emptyState?: ReactNode;
}

const roleLabels: Record<MessageRole, string> = {
  assistant: "Assistant",
  system: "System",
  user: "You",
};

function bubbleClasses(role: MessageRole) {
  if (role === "assistant") {
    return "bg-muted text-foreground border";
  }
  if (role === "system") {
    return "bg-secondary/40 text-secondary-foreground border";
  }
  return "bg-primary text-primary-foreground";
}

export function AIChatWindow({
  messages,
  onSendMessage,
  isStreaming = false,
  title = "AI Assistant",
  inputPlaceholder = "Ask a question...",
  disabled = false,
  emptyState,
}: AIChatWindowProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [draft, setDraft] = useState("");
  const isInputDisabled = disabled || isStreaming || !onSendMessage;

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim() || !onSendMessage) return;
    const value = draft.trim();
    setDraft("");
    await onSendMessage(value);
    formRef.current?.reset();
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-background shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h2>
        {isStreaming ? (
          <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            Responding...
          </span>
        ) : null}
      </div>
      <div
        ref={listRef}
        className="flex-1 space-y-4 overflow-y-auto bg-muted/20 px-4 py-6"
        role="log"
        aria-live="polite"
      >
        {messages.length === 0 && emptyState ? (
          <div className="text-center text-sm text-muted-foreground">{emptyState}</div>
        ) : null}
        {messages.map((message) => (
          <article
            key={message.id}
            className="flex flex-col gap-2"
            aria-label={`${roleLabels[message.role]} message`}
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
              <span>{roleLabels[message.role]}</span>
              {message.timestamp ? <time dateTime={message.timestamp}>{message.timestamp}</time> : null}
            </div>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow ${bubbleClasses(message.role)}`}
            >
              {message.content}
            </div>
          </article>
        ))}
      </div>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="border-t bg-background px-4 py-3"
        aria-label="Send a message"
      >
        <label className="sr-only" htmlFor="ai-chat-input">
          Message
        </label>
        <div className="flex items-center gap-2 rounded-full border px-3 py-2 shadow-sm">
          <textarea
            id="ai-chat-input"
            name="message"
            rows={1}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={inputPlaceholder}
            className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            autoComplete="off"
            disabled={isInputDisabled}
            aria-disabled={isInputDisabled}
          />
          <button
            type="submit"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isInputDisabled || !draft.trim()}
          >
            {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send message</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default AIChatWindow;
