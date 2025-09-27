"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, LogOut, Settings } from "lucide-react";

export interface AuthDropdownProps {
  userName: string;
  userEmail?: string;
  avatarUrl?: string;
  onManageAccount?: () => void;
  onSignOut?: () => void;
}

export function AuthDropdown({
  userName,
  userEmail,
  avatarUrl,
  onManageAccount,
  onSignOut,
}: AuthDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      window.addEventListener("click", handleClick);
    }
    return () => window.removeEventListener("click", handleClick);
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium shadow-sm transition hover:bg-muted"
        onClick={() => setOpen((state) => !state)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-muted">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={userName} width={32} height={32} className="h-8 w-8 object-cover" />
          ) : (
            <span className="text-sm font-semibold uppercase text-muted-foreground">
              {userName.slice(0, 2)}
            </span>
          )}
        </span>
        <span className="hidden text-left text-sm leading-tight sm:block">
          <span className="block font-semibold">{userName}</span>
          {userEmail ? <span className="text-xs text-muted-foreground">{userEmail}</span> : null}
        </span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-12 z-20 w-56 overflow-hidden rounded-xl border bg-background shadow-lg"
        >
          <div className="border-b px-4 py-3 text-sm">
            <p className="font-semibold">{userName}</p>
            {userEmail ? <p className="text-xs text-muted-foreground">{userEmail}</p> : null}
          </div>
          <div className="p-2 text-sm">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onManageAccount?.();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition hover:bg-muted"
            >
              <Settings className="h-4 w-4" /> Manage account
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onSignOut?.();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-red-600 transition hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AuthDropdown;
