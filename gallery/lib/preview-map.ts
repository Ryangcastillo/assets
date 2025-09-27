import dynamic from "next/dynamic";
import type { ComponentType } from "react";

type PreviewResolver = () => Promise<{ default: ComponentType } | ComponentType>;

type PreviewMap = Record<string, PreviewResolver>;

const previewResolvers: PreviewMap = {
  "ai-chat-window": () => import("@registry/ai-chat-window/src/ai-chat-window.preview"),
  "ai-message-list": () => import("@registry/ai-message-list/src/ai-message-list.preview"),
  "ai-input": () => import("@registry/ai-input/src/ai-input.preview"),
  "command-menu": () => import("@registry/command-menu/src/command-menu.preview"),
  "pricing-card": () => import("@registry/pricing-card/src/pricing-card.preview"),
  "auth-dropdown": () => import("@registry/auth-dropdown/src/auth-dropdown.preview"),
};

export function resolvePreviewComponent(id: string) {
  const resolver = previewResolvers[id];
  if (!resolver) {
    return null;
  }

  return dynamic(async () => {
    const module = await resolver();
    if ("default" in module && module.default) {
      return module.default as ComponentType;
    }
    return module as unknown as ComponentType;
  }, {
    loading: () => <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">Loading preview…</div>,
    ssr: false,
  });
}
