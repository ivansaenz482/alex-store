"use client";
import { useEffect, useState } from "react";

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

declare global {
  interface Window {
    __pwaPrompt?: BeforeInstallPromptEvent | null;
  }
}

export interface PwaInstallState {
  canInstall: boolean;
  isIos: boolean;
  installed: boolean;
  ready: boolean;
  install: () => Promise<"accepted" | "dismissed" | "unavailable">;
}

export function usePwaInstall(): PwaInstallState {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const syncPrompt = () => setPromptEvent(window.__pwaPrompt ?? null);
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };

    window.addEventListener("pwa-installable", syncPrompt);
    window.addEventListener("pwa-installed", onInstalled);
    window.addEventListener("appinstalled", onInstalled);

    const ua = window.navigator.userAgent;
    const iosDevice =
      /iphone|ipad|ipod/i.test(ua) ||
      (ua.includes("Macintosh") && "ontouchend" in document);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    const timer = window.setTimeout(() => {
      setIsIos(iosDevice);
      if (standalone) setInstalled(true);
      if (window.__pwaPrompt) setPromptEvent(window.__pwaPrompt);
      setReady(true);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pwa-installable", syncPrompt);
      window.removeEventListener("pwa-installed", onInstalled);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install(): Promise<"accepted" | "dismissed" | "unavailable"> {
    const event = promptEvent ?? window.__pwaPrompt ?? null;
    if (!event) return "unavailable";
    await event.prompt();
    const choice = await event.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setPromptEvent(null);
    window.__pwaPrompt = null;
    return choice.outcome;
  }

  return {
    canInstall: !installed && (promptEvent !== null || isIos),
    isIos,
    installed,
    ready,
    install,
  };
}
