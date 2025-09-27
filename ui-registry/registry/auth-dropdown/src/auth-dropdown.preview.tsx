import { useState } from "react";
import { AuthDropdown } from "./auth-dropdown";

export default function AuthDropdownPreview() {
  const [eventLog, setEventLog] = useState<string[]>([]);

  function addLog(entry: string) {
    setEventLog((logs) => [entry, ...logs].slice(0, 3));
  }

  return (
    <div className="space-y-4">
      <AuthDropdown
        userName="Ada Lovelace"
        userEmail="ada@lovelabs.io"
        onManageAccount={() => addLog("Manage account clicked")}
        onSignOut={() => addLog("Sign out clicked")}
      />
      <div className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
        <p className="mb-2 font-semibold uppercase tracking-wide">Activity</p>
        <ul className="space-y-1">
          {eventLog.length === 0 ? <li>No actions yet.</li> : null}
          {eventLog.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
