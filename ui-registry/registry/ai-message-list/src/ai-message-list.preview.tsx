import { AIMessageList, type AIMessageItem } from "./ai-message-list";

const demoMessages: AIMessageItem[] = [
  {
    id: "1",
    role: "assistant",
    content: "How can I help you ship faster today?",
  },
  {
    id: "2",
    role: "user",
    content: "Summarise the latest changelog into a tweet.",
  },
  {
    id: "3",
    role: "assistant",
    content: "Absolutely! Here's a concise update...",
  },
];

export default function AIMessageListPreview() {
  return (
    <div className="rounded-lg border bg-background p-6">
      <AIMessageList messages={demoMessages} />
    </div>
  );
}
