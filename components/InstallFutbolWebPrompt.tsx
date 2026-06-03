"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/I18nProvider";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

const continueInWebStorageKey = "futbolweb.installPrompt.continueInWeb.session";

type InstallPlatform = "android" | "ios" | "desktop";

function isStandaloneDisplay() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    ("standalone" in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

function isIosDevice() {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;
  const supportsTouch = window.navigator.maxTouchPoints > 1;

  return /iPad|iPhone|iPod/.test(userAgent) || (platform === "MacIntel" && supportsTouch);
}

function getInstallPlatform(): InstallPlatform {
  if (isIosDevice()) {
    return "ios";
  }

  if (/Android/.test(window.navigator.userAgent)) {
    return "android";
  }

  return "desktop";
}

export default function InstallFutbolWebPrompt() {
  const { dict } = useI18n();
  const installDict = dict.installPrompt;
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(true);
  const [isDismissed, setIsDismissed] = useState(true);
  const [platform, setPlatform] = useState<InstallPlatform>("desktop");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsInstalled(isStandaloneDisplay());
      setPlatform(getInstallPlatform());
      setIsDismissed(window.sessionStorage.getItem(continueInWebStorageKey) === "1");
    }, 0);

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setIsInstalled(false);
      setIsDismissed(false);
    }

    function handleAppInstalled() {
      setDeferredPrompt(null);
      setIsInstalled(true);
      setIsDismissed(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function installApp() {
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    setDeferredPrompt(null);

    if (choice.outcome === "accepted") {
      setIsInstalled(true);
      setIsDismissed(true);
    }
  }

  function continueInWeb() {
    window.sessionStorage.setItem(continueInWebStorageKey, "1");
    setIsDismissed(true);
  }

  const canShowNativeInstall = Boolean(deferredPrompt);
  const canShowInstallButton = canShowNativeInstall || platform === "android";

  if (isInstalled || isDismissed) {
    return null;
  }

  const title =
    platform === "ios"
      ? installDict.iosTitle
      : platform === "desktop"
        ? installDict.desktopTitle
        : installDict.title;
  const steps =
    platform === "ios"
      ? installDict.iosSteps
      : platform === "desktop"
        ? installDict.desktopSteps
        : canShowNativeInstall
          ? installDict.androidNativeSteps
          : installDict.androidMenuSteps;

  return (
    <div className="border-b border-cyan-200/20 bg-[#07111f] px-5 py-3 text-white shadow-lg shadow-black/20">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black text-white">{title}</p>
          <ol className="mt-1 space-y-0.5 text-xs font-semibold leading-5 text-cyan-100">
            {steps.map((step, index) => (
              <li key={step}>
                {installDict.stepLabel} {index + 1}: {step}
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {canShowInstallButton ? (
            <button
              className="min-h-11 rounded-md bg-cyan-300 px-5 py-3 text-sm font-black uppercase text-slate-950 transition hover:bg-cyan-200"
              onClick={installApp}
              type="button"
            >
              {installDict.installButton}
            </button>
          ) : null}
          <button
            className="min-h-11 rounded-md border border-white/15 px-4 py-3 text-sm font-black text-white transition hover:bg-white/10"
            onClick={continueInWeb}
            type="button"
          >
            {installDict.continueWeb}
          </button>
        </div>
      </div>
    </div>
  );
}
