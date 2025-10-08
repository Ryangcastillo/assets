import { useState } from "react";
import { CommandMenu, type CommandMenuItem } from "./command-menu";

const demoCommands: CommandMenuItem[] = [
  {
    id: "open-docs",
    title: "Open documentation",
    description: "Visit the internal knowledge base",
    shortcut: "⇧⌘D",
    group: "Navigation",
    onSelect: () => alert("Navigate to docs"),
  },
  {
    id: "create-issue",
    title: "Create GitHub issue",
    description: "Open a new bug report in the tracker",
    shortcut: "⇧⌘I",
    group: "Actions",
    onSelect: () => alert("Issue modal opened"),
  },
  {
    id: "invite-teammate",
    title: "Invite teammate",
    description: "Generate an invite link",
    shortcut: "⌘I",
    group: "Actions",
    onSelect: () => alert("Invite flow launched"),
  },
];

export default function CommandMenuPreview() {
  const [message, setMessage] = useState("Trigger a command to see feedback here.");

  const commands = demoCommands.map((command) => ({
    ...command,
    onSelect: () => setMessage(`Command executed: ${command.title}`),
  }));

  return (
    <div className="space-y-4">
      <CommandMenu items={commands} />
      <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">{message}</div>
    </div>
  );
}
