import { useState } from "react";
import { AIInput } from "./ai-input";

export default function AIInputPreview() {
  const [log, setLog] = useState<string[]>([]);

  async function handleSubmit(value: string) {
    setLog((items) => [value, ...items].slice(0, 3));
  }

  return (
    <div className="space-y-4">
      <AIInput onSubmit={handleSubmit} placeholder="Summarise the weekly report" />
      <div className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
        <p className="mb-2 font-medium uppercase tracking-wide">Last messages</p>
        <ul className="space-y-1">
          {log.length === 0 ? <li>No messages yet.</li> : null}
          {log.map((value, index) => (
            <li key={`${value}-${index}`} className="truncate">
              {value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
