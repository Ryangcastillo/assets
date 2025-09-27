import { forwardRef } from "react";

export type MessageRole = "user" | "assistant" | "system";

export interface AIMessageItem {
  id: string;
  role: MessageRole;
  content: string;
  status?: "streaming" | "complete";
}

export interface AIMessageListProps {
  messages: AIMessageItem[];
  className?: string;
}

const roleStyles: Record<MessageRole, string> = {
  assistant: "bg-muted text-muted-foreground border",
  user: "bg-primary text-primary-foreground",
  system: "bg-secondary/30 text-secondary-foreground border",
};

export const AIMessageList = forwardRef<HTMLDivElement, AIMessageListProps>(
  ({ messages, className }, ref) => {
    return (
      <div ref={ref} className={`space-y-4 ${className ?? ""}`}>
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col gap-2 text-sm">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {message.role === "assistant" && "Assistant"}
              {message.role === "user" && "You"}
              {message.role === "system" && "System"}
            </span>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow ${roleStyles[message.role]}`}>
              {message.content}
            </div>
          </div>
        ))}
        {messages.length === 0 ? (
          <div className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            Ask a question to get started.
          </div>
        ) : null}
      </div>
    );
  }
);

AIMessageList.displayName = "AIMessageList";

export default AIMessageList;
