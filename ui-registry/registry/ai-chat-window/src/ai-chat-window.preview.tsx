import { useState } from "react";
import { AIChatWindow, type AIChatMessage } from "./ai-chat-window";

const initialMessages: AIChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm your AI teammate. Ask me anything about your product.",
  },
  {
    id: "2",
    role: "user",
    content: "Give me three onboarding ideas for new users.",
  },
  {
    id: "3",
    role: "assistant",
    content: "Sure! Here's a quick plan to get people activated...",
  },
];

export default function AIChatWindowPreview() {
  const [messages, setMessages] = useState(initialMessages);

  async function handleSend(message: string) {
    const userMessage: AIChatMessage = {
      id: String(Date.now()),
      role: "user",
      content: message,
    };
    setMessages((current) => [...current, userMessage]);
  }

  return (
    <div className="h-[500px] w-full max-w-lg">
      <AIChatWindow messages={messages} onSendMessage={handleSend} emptyState="Start the conversation" />
    </div>
  );
}
