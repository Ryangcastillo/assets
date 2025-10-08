"use client";

import { useEffect, useRef, useState } from "react";
import { Command } from "cmdk";
import { Search } from "lucide-react";

export interface CommandMenuItem {
  id: string;
  title: string;
  shortcut?: string;
  onSelect: () => void;
  group?: string;
  description?: string;
}

export interface CommandMenuProps {
  items: CommandMenuItem[];
  placeholder?: string;
  searchEmptyState?: string;
}

function groupItems(items: CommandMenuItem[]) {
  return items.reduce<Record<string, CommandMenuItem[]>>((groups, item) => {
    const key = item.group ?? "Commands";
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
}

export function CommandMenu({
  items,
  placeholder = "Type a command...",
  searchEmptyState = "No commands found",
}: CommandMenuProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((state) => !state);
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [open]);

  const grouped = groupItems(items);

  return (
    <>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm text-muted-foreground shadow-sm transition hover:bg-muted"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span>Search commands</span>
        <kbd className="ml-2 hidden rounded border bg-muted px-2 py-1 text-[10px] font-medium uppercase text-muted-foreground sm:inline">
          ⌘K
        </kbd>
      </button>
      <Command.Dialog open={open} onOpenChange={setOpen} label="Global command menu">
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border bg-background shadow-xl">
            <Command className="flex h-full max-h-[500px] flex-col">
              <div className="flex items-center gap-2 border-b px-4 py-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Command.Input
                  ref={inputRef}
                  value={value}
                  onValueChange={setValue}
                  placeholder={placeholder}
                  className="flex-1 bg-transparent text-sm outline-none"
                />
                {value ? (
                  <button
                    type="button"
                    onClick={() => setValue("")}
                    className="text-xs text-muted-foreground transition hover:text-foreground"
                  >
                    Clear
                  </button>
                ) : null}
              </div>
              <Command.List className="flex-1 overflow-y-auto px-2 py-2 text-sm">
                <Command.Empty className="py-10 text-center text-muted-foreground">
                  {searchEmptyState}
                </Command.Empty>
                {Object.entries(grouped).map(([groupName, groupItems]) => (
                  <Command.Group key={groupName} heading={groupName} className="space-y-1">
                    {groupItems.map((item) => (
                      <Command.Item
                        key={item.id}
                        value={item.title}
                        onSelect={() => {
                          item.onSelect();
                          setOpen(false);
                        }}
                        className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm outline-none data-[selected=true]:bg-muted data-[selected=true]:text-foreground"
                      >
                        <div>
                          <div className="font-medium">{item.title}</div>
                          {item.description ? (
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          ) : null}
                        </div>
                        {item.shortcut ? (
                          <kbd className="rounded border bg-muted px-2 py-1 text-[10px] font-medium uppercase text-muted-foreground">
                            {item.shortcut}
                          </kbd>
                        ) : null}
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
              </Command.List>
            </Command>
          </div>
        </div>
      </Command.Dialog>
    </>
  );
}

export default CommandMenu;
