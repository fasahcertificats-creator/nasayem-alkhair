"use client";

import { RefreshCw, WifiOff } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";

import { PWA_RELEASE_VERSION } from "./offline-routes.generated";
import { PWA_UPDATE_RELOAD_KEY } from "./pwa-constants";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type InstallOutcome = "idle" | "accepted" | "dismissed";

interface PwaRuntimeContextValue {
  applyUpdate: () => void;
  currentVersion: string;
  installOutcome: InstallOutcome;
  installPromptAvailable: boolean;
  installed: boolean;
  iosInstallInstructionsRelevant: boolean;
  online: boolean;
  promptInstall: () => Promise<void>;
  registration: ServiceWorkerRegistration | null;
  serviceWorkerSupported: boolean;
}

const PwaRuntimeContext = createContext<PwaRuntimeContextValue | null>(null);
const RUNTIME_STATUS_REQUEST_ID = "runtime-version";
type PwaUpdateReloadState = "pending" | "done";

let inMemoryUpdateReloadState: PwaUpdateReloadState | null = null;
let useInMemoryUpdateReloadState = false;

function isPwaUpdateReloadState(
  value: string | null,
): value is PwaUpdateReloadState {
  return value === "pending" || value === "done";
}

function readPwaUpdateReloadState(): PwaUpdateReloadState | null {
  if (useInMemoryUpdateReloadState || typeof window === "undefined") {
    return inMemoryUpdateReloadState;
  }

  try {
    const value = window.sessionStorage.getItem(PWA_UPDATE_RELOAD_KEY);
    inMemoryUpdateReloadState = isPwaUpdateReloadState(value) ? value : null;
    return inMemoryUpdateReloadState;
  } catch {
    useInMemoryUpdateReloadState = true;
    return inMemoryUpdateReloadState;
  }
}

function writePwaUpdateReloadState(value: PwaUpdateReloadState): void {
  inMemoryUpdateReloadState = value;

  if (typeof window === "undefined") {
    useInMemoryUpdateReloadState = true;
    return;
  }

  try {
    window.sessionStorage.setItem(PWA_UPDATE_RELOAD_KEY, value);
    useInMemoryUpdateReloadState = false;
  } catch {
    useInMemoryUpdateReloadState = true;
  }
}

function removePwaUpdateReloadState(): void {
  inMemoryUpdateReloadState = null;

  if (typeof window === "undefined") {
    useInMemoryUpdateReloadState = true;
    return;
  }

  try {
    window.sessionStorage.removeItem(PWA_UPDATE_RELOAD_KEY);
    useInMemoryUpdateReloadState = false;
  } catch {
    useInMemoryUpdateReloadState = true;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidStatusMessage(value: unknown) {
  if (!isRecord(value)) {
    return false;
  }

  const keys = Object.keys(value);

  return (
    keys.length === 4 &&
    keys.every((key) =>
      ["type", "requestId", "offlinePackCachePresent", "version"].includes(
        key
      )
    ) &&
    value.type === "PWA_STATUS" &&
    value.requestId === RUNTIME_STATUS_REQUEST_ID &&
    typeof value.offlinePackCachePresent === "boolean" &&
    typeof value.version === "string" &&
    value.version.length > 0 &&
    value.version.length <= 100
  );
}

function isStandaloneDisplay() {
  const navigatorWithStandalone = navigator as Navigator & {
    standalone?: boolean;
  };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

function isIosDevice() {
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function requestWorkerStatus(worker: ServiceWorker): Promise<string> {
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const timeoutId = window.setTimeout(
      () => resolve(PWA_RELEASE_VERSION),
      5000
    );

    channel.port1.onmessage = (event) => {
      if (!isValidStatusMessage(event.data)) {
        return;
      }

      window.clearTimeout(timeoutId);
      resolve(event.data.version);
    };
    worker.postMessage(
      {
        type: "GET_PWA_STATUS",
        requestId: RUNTIME_STATUS_REQUEST_ID
      },
      [channel.port2]
    );
  });
}

export function PwaRuntimeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [currentVersion, setCurrentVersion] =
    useState<string>(PWA_RELEASE_VERSION);
  const [installed, setInstalled] = useState(false);
  const [iosInstallInstructionsRelevant, setIosInstallInstructionsRelevant] =
    useState(false);
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installOutcome, setInstallOutcome] =
    useState<InstallOutcome>("idle");
  const [online, setOnline] = useState(true);
  const [connectionMessage, setConnectionMessage] = useState("");
  const [serviceWorkerSupported, setServiceWorkerSupported] = useState(false);
  const wasOfflineRef = useRef(false);
  const updateRequestedRef = useRef(false);
  const connectionTimerRef = useRef<number | null>(null);
  useEffect(() => {
    const environmentTimer = window.setTimeout(() => {
      const standalone = isStandaloneDisplay();

      setServiceWorkerSupported("serviceWorker" in navigator);
      setInstalled(standalone);
      setIosInstallInstructionsRelevant(isIosDevice() && !standalone);
    }, 0);

    function onBeforeInstallPrompt(event: Event) {
      const promptEvent = event as BeforeInstallPromptEvent;
      promptEvent.preventDefault();
      setInstallPrompt(promptEvent);
      setInstallOutcome("idle");
    }

    function onAppInstalled() {
      setInstalled(true);
      setInstallPrompt(null);
      setInstallOutcome("accepted");
      setIosInstallInstructionsRelevant(false);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.clearTimeout(environmentTimer);
      window.removeEventListener(
        "beforeinstallprompt",
        onBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  useEffect(() => {
    function showOffline() {
      if (connectionTimerRef.current) {
        window.clearTimeout(connectionTimerRef.current);
      }

      wasOfflineRef.current = true;
      setOnline(false);
      setConnectionMessage("أنت الآن دون اتصال بالإنترنت");
    }

    function showRestored() {
      setOnline(true);

      if (!wasOfflineRef.current) {
        return;
      }

      wasOfflineRef.current = false;
      setConnectionMessage("عاد الاتصال بالإنترنت");
      connectionTimerRef.current = window.setTimeout(
        () => setConnectionMessage(""),
        4000
      );
    }

    if (navigator.onLine === false) {
      showOffline();
    }

    window.addEventListener("offline", showOffline);
    window.addEventListener("online", showRestored);

    return () => {
      if (connectionTimerRef.current) {
        window.clearTimeout(connectionTimerRef.current);
      }

      window.removeEventListener("offline", showOffline);
      window.removeEventListener("online", showRestored);
    };
  }, []);

  useEffect(() => {
    function useFullDocumentNavigation(event: MouseEvent) {
      if (
        navigator.onLine !== false ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a");

      if (
        !anchor ||
        anchor.hasAttribute("download") ||
        (anchor.target && anchor.target !== "_self")
      ) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);

      if (
        url.origin !== window.location.origin ||
        !["http:", "https:"].includes(url.protocol)
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      window.location.assign(url.href);
    }

    document.addEventListener("click", useFullDocumentNavigation, true);

    return () =>
      document.removeEventListener("click", useFullDocumentNavigation, true);
  }, []);

  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    let active = true;
    let updateTimer = 0;

    function watchForUpdates(nextRegistration: ServiceWorkerRegistration) {
      if (nextRegistration.waiting && navigator.serviceWorker.controller) {
        setWaitingWorker(nextRegistration.waiting);
      }

      nextRegistration.addEventListener("updatefound", () => {
        const installingWorker = nextRegistration.installing;

        if (!installingWorker) {
          return;
        }

        installingWorker.addEventListener("statechange", () => {
          if (
            installingWorker.state === "installed" &&
            navigator.serviceWorker.controller &&
            nextRegistration.waiting
          ) {
            setWaitingWorker(nextRegistration.waiting);
          }
        });
      });
    }

    async function registerServiceWorker() {
      try {
        const existingRegistration =
          await navigator.serviceWorker.getRegistration("/");
        const nextRegistration =
          existingRegistration?.active?.scriptURL.endsWith("/sw.js")
            ? existingRegistration
            : await navigator.serviceWorker.register("/sw.js", {
                scope: "/",
                updateViaCache: "none"
              });
        const readyRegistration = await navigator.serviceWorker.ready;

        if (!active) {
          return;
        }

        setRegistration(readyRegistration);
        watchForUpdates(nextRegistration);

        const worker =
          navigator.serviceWorker.controller || readyRegistration.active;

        if (worker) {
          setCurrentVersion(await requestWorkerStatus(worker));
        }

        updateTimer = window.setTimeout(() => {
          void nextRegistration.update().catch(() => undefined);
        }, 30_000);
      } catch {
        if (active) {
          setRegistration(null);
        }
      }
    }

    function onControllerChange() {
      if (
        !updateRequestedRef.current ||
        readPwaUpdateReloadState() !== "pending"
      ) {
        return;
      }

      updateRequestedRef.current = false;
      writePwaUpdateReloadState("done");
      window.location.reload();
    }

    if (readPwaUpdateReloadState() === "done") {
      removePwaUpdateReloadState();
    }

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      onControllerChange
    );

    if (document.readyState === "complete") {
      void registerServiceWorker();
    } else {
      window.addEventListener("load", registerServiceWorker, { once: true });
    }

    return () => {
      active = false;
      window.clearTimeout(updateTimer);
      window.removeEventListener("load", registerServiceWorker);
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange
      );
    };
  }, []);

  useEffect(() => {
    const worker =
      navigator.serviceWorker?.controller || registration?.active;

    if (!worker || !pathname) {
      return;
    }

    worker.postMessage({
      type: "CACHE_CURRENT_PAGE",
      path: pathname
    });
  }, [pathname, registration]);

  const promptInstall = useCallback(async () => {
    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setInstallOutcome(choice.outcome);
    setInstallPrompt(null);
  }, [installPrompt]);

  const applyUpdate = useCallback(() => {
    if (!waitingWorker) {
      return;
    }

    updateRequestedRef.current = true;
    writePwaUpdateReloadState("pending");
    waitingWorker.postMessage({
      type: "SKIP_WAITING",
      requestId: "user-update"
    });
  }, [waitingWorker]);

  const contextValue = useMemo<PwaRuntimeContextValue>(
    () => ({
      applyUpdate,
      currentVersion,
      installOutcome,
      installPromptAvailable: Boolean(installPrompt),
      installed,
      iosInstallInstructionsRelevant,
      online,
      promptInstall,
      registration,
      serviceWorkerSupported
    }),
    [
      applyUpdate,
      currentVersion,
      installOutcome,
      installPrompt,
      installed,
      iosInstallInstructionsRelevant,
      online,
      promptInstall,
      registration,
      serviceWorkerSupported
    ]
  );

  return (
    <PwaRuntimeContext.Provider value={contextValue}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(6.8rem+env(safe-area-inset-bottom))] z-50 mx-auto flex w-full max-w-[540px] flex-col items-center gap-2 px-3"
      >
        {waitingWorker ? (
          <div className="border-gold/30 bg-[var(--nasayem-surface)] pointer-events-auto flex w-full min-w-0 items-center justify-between gap-3 rounded-xl border px-3 py-2 shadow-lg">
            <p className="text-primary min-w-0 text-xs leading-5 font-bold">
              يتوفر تحديث جديد للتطبيق
            </p>
            <button
              aria-label="تحديث التطبيق الآن"
              className="bg-primary text-primary-foreground focus-visible:ring-gold inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-bold focus-visible:ring-2 focus-visible:outline-none"
              onClick={applyUpdate}
              type="button"
            >
              <RefreshCw aria-hidden="true" className="size-4" />
              تحديث الآن
            </button>
          </div>
        ) : null}
        {connectionMessage ? (
          <div
            className={`flex min-h-11 max-w-full items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold shadow-lg ${
              online
                ? "border-primary/20 bg-[var(--nasayem-green-050)] text-primary"
                : "border-gold/30 bg-[var(--nasayem-surface)] text-primary"
            }`}
            role="status"
          >
            <WifiOff aria-hidden="true" className="size-4 shrink-0" />
            <span className="min-w-0 break-words">{connectionMessage}</span>
          </div>
        ) : null}
      </div>
    </PwaRuntimeContext.Provider>
  );
}

export function usePwaRuntime() {
  const context = useContext(PwaRuntimeContext);

  if (!context) {
    throw new Error("usePwaRuntime must be used within PwaRuntimeProvider.");
  }

  return context;
}
