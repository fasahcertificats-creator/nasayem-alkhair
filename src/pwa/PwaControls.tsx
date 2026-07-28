"use client";

import {
  Download,
  HardDrive,
  RefreshCw,
  Smartphone,
  Trash2,
  X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  OFFLINE_ROUTE_COUNT,
  OFFLINE_ROUTES
} from "./offline-routes.generated";
import {
  PWA_MESSAGE_TIMEOUT_MS,
  PWA_OFFLINE_CACHE_PREFIX,
  PWA_OFFLINE_METADATA_KEY
} from "./pwa-constants";
import { usePwaRuntime } from "./PwaRuntime";

interface OfflinePackMetadata {
  lastPreparedAt: number;
  routeCount: number;
  version: string;
}

interface PackProgress {
  completed: number;
  total: number;
}

function readOfflinePackMetadata(): OfflinePackMetadata | null {
  try {
    const rawValue = localStorage.getItem(PWA_OFFLINE_METADATA_KEY);

    if (!rawValue) {
      return null;
    }

    const value = JSON.parse(rawValue) as Partial<OfflinePackMetadata>;

    if (
      typeof value.version !== "string" ||
      typeof value.lastPreparedAt !== "number" ||
      !Number.isFinite(value.lastPreparedAt) ||
      typeof value.routeCount !== "number" ||
      !Number.isSafeInteger(value.routeCount)
    ) {
      return null;
    }

    return value as OfflinePackMetadata;
  } catch {
    return null;
  }
}

function formatPreparationDate(timestamp: number) {
  return new Intl.DateTimeFormat("ar", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(timestamp));
}

function createRequestId() {
  return globalThis.crypto?.randomUUID?.() ?? `pwa-${Date.now()}`;
}

export function PwaControls() {
  const {
    currentVersion,
    installOutcome,
    installPromptAvailable,
    installed,
    iosInstallInstructionsRelevant,
    online,
    promptInstall,
    registration,
    serviceWorkerSupported
  } = usePwaRuntime();
  const [metadata, setMetadata] = useState<OfflinePackMetadata | null>(null);
  const [progress, setProgress] = useState<PackProgress | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const removeTriggerRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setMetadata(readOfflinePackMetadata());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [currentVersion]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    function restoreFocus() {
      removeTriggerRef.current?.focus();
    }

    dialog.addEventListener("close", restoreFocus);
    return () => dialog.removeEventListener("close", restoreFocus);
  }, []);

  const packReady =
    metadata?.version === currentVersion &&
    metadata.routeCount === OFFLINE_ROUTE_COUNT;
  const updateRequired = Boolean(metadata && !packReady);

  async function prepareOfflinePack() {
    if (!serviceWorkerSupported || !online) {
      setStatusMessage(
        online
          ? "هذا المتصفح لا يدعم تجهيز المحتوى دون إنترنت."
          : "يلزم الاتصال بالإنترنت لتجهيز المحتوى."
      );
      return;
    }

    setPreparing(true);
    setProgress({ completed: 0, total: OFFLINE_ROUTE_COUNT });
    setStatusMessage("جارٍ تجهيز المحتوى للعمل دون إنترنت…");

    try {
      const readyRegistration =
        registration ?? (await navigator.serviceWorker.ready);
      const worker =
        navigator.serviceWorker.controller || readyRegistration.active;

      if (!worker) {
        throw new Error("service-worker-not-ready");
      }

      const requestId = createRequestId();
      const result = await new Promise<{
        completed: number;
        success: boolean;
        total: number;
        version: string;
      }>((resolve, reject) => {
        const channel = new MessageChannel();
        const timeoutId = window.setTimeout(
          () => reject(new Error("offline-pack-timeout")),
          PWA_MESSAGE_TIMEOUT_MS
        );

        channel.port1.onmessage = (event) => {
          const message = event.data;

          if (!message || message.requestId !== requestId) {
            return;
          }

          if (message.type === "PWA_PACK_PROGRESS") {
            setProgress({
              completed: message.completed,
              total: message.total
            });
            return;
          }

          if (message.type === "PWA_PACK_COMPLETE") {
            window.clearTimeout(timeoutId);
            resolve(message);
          }
        };

        worker.postMessage(
          {
            type: "PREPARE_OFFLINE_PACK",
            requestId,
            routes: [...OFFLINE_ROUTES]
          },
          [channel.port2]
        );
      });

      if (
        !result.success ||
        result.completed !== result.total ||
        result.total !== OFFLINE_ROUTE_COUNT
      ) {
        throw new Error("offline-pack-partial");
      }

      const nextMetadata: OfflinePackMetadata = {
        lastPreparedAt: Date.now(),
        routeCount: result.total,
        version: result.version
      };
      localStorage.setItem(
        PWA_OFFLINE_METADATA_KEY,
        JSON.stringify(nextMetadata)
      );
      setMetadata(nextMetadata);
      setStatusMessage(
        "تم تجهيز التطبيق للعمل دون إنترنت."
      );
    } catch {
      setStatusMessage(
        "تعذر تجهيز بعض المحتوى. تحقق من الاتصال ثم أعد المحاولة."
      );
    } finally {
      setPreparing(false);
    }
  }

  function openRemovalDialog() {
    setStatusMessage("");
    dialogRef.current?.showModal();
    window.setTimeout(() => cancelRef.current?.focus(), 0);
  }

  function closeRemovalDialog() {
    dialogRef.current?.close();
  }

  async function removeOfflineContent() {
    setRemoving(true);

    try {
      const readyRegistration =
        registration ??
        ("serviceWorker" in navigator
          ? await navigator.serviceWorker.ready
          : null);
      const worker =
        navigator.serviceWorker?.controller || readyRegistration?.active;

      if (worker) {
        const requestId = createRequestId();
        await new Promise<void>((resolve, reject) => {
          const channel = new MessageChannel();
          const timeoutId = window.setTimeout(
            () => reject(new Error("offline-remove-timeout")),
            15_000
          );

          channel.port1.onmessage = (event) => {
            if (
              event.data?.type !== "PWA_OFFLINE_CONTENT_REMOVED" ||
              event.data.requestId !== requestId
            ) {
              return;
            }

            window.clearTimeout(timeoutId);

            if (event.data.success) {
              resolve();
            } else {
              reject(new Error("offline-remove-failed"));
            }
          };

          worker.postMessage(
            {
              type: "REMOVE_OFFLINE_CONTENT",
              requestId
            },
            [channel.port2]
          );
        });
      } else if ("caches" in window) {
        const cacheNames = await caches.keys();
        const offlinePackCaches = cacheNames.filter((cacheName) =>
          cacheName.startsWith(PWA_OFFLINE_CACHE_PREFIX)
        );
        await Promise.all(
          offlinePackCaches.map((cacheName) => caches.delete(cacheName))
        );
      }

      localStorage.removeItem(PWA_OFFLINE_METADATA_KEY);
      setMetadata(null);
      closeRemovalDialog();
      setStatusMessage(
        "تم حذف المحتوى المحفوظ دون إنترنت."
      );
    } catch {
      closeRemovalDialog();
      setStatusMessage("تعذر حذف المحتوى المحفوظ الآن.");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="space-y-4">
      <section
        aria-labelledby="install-app-heading"
        className="border-border min-w-0 space-y-3 rounded-[18px] border bg-white p-4 shadow-[var(--shadow-soft)]"
      >
        <div className="flex min-w-0 items-start gap-3">
          <span className="bg-[var(--nasayem-gold-050)] text-gold flex size-9 shrink-0 items-center justify-center rounded-xl">
            <Smartphone aria-hidden="true" className="size-4.5" />
          </span>
          <div className="min-w-0">
            <h2
              className="text-primary text-[17px] leading-7 font-bold"
              id="install-app-heading"
            >
              تثبيت التطبيق
            </h2>
            <p className="text-muted-foreground text-xs leading-6">
              ثبّت نسائم الخير للوصول إليه من الشاشة الرئيسية.
            </p>
          </div>
        </div>

        {installed ? (
          <p className="text-primary border-primary/10 bg-[var(--nasayem-green-050)] rounded-xl border px-3 py-2.5 text-xs leading-6 font-bold">
            التطبيق مثبت على هذا الجهاز
          </p>
        ) : null}

        {!installed && installPromptAvailable ? (
          <button
            className="bg-primary text-primary-foreground focus-visible:ring-gold inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold focus-visible:ring-2 focus-visible:outline-none"
            onClick={() => void promptInstall()}
            type="button"
          >
            <Download aria-hidden="true" className="size-4" />
            تثبيت نسائم الخير
          </button>
        ) : null}

        {!installed && iosInstallInstructionsRelevant ? (
          <ol className="text-muted-foreground list-decimal space-y-1 pe-5 text-xs leading-6">
            <li>اضغط زر المشاركة.</li>
            <li>اختر «إضافة إلى الشاشة الرئيسية».</li>
            <li>اضغط «إضافة».</li>
          </ol>
        ) : null}

        {installOutcome === "dismissed" ? (
          <p className="text-muted-foreground text-xs leading-6">
            أُغلق طلب التثبيت دون تثبيت التطبيق. يمكنك المحاولة لاحقًا.
          </p>
        ) : null}
      </section>

      <section
        aria-labelledby="offline-pack-heading"
        className="border-border min-w-0 space-y-3 rounded-[18px] border bg-white p-4 shadow-[var(--shadow-soft)]"
      >
        <div className="flex min-w-0 items-start gap-3">
          <span className="bg-[var(--nasayem-gold-050)] text-gold flex size-9 shrink-0 items-center justify-center rounded-xl">
            <HardDrive aria-hidden="true" className="size-4.5" />
          </span>
          <div className="min-w-0">
            <h2
              className="text-primary text-[17px] leading-7 font-bold"
              id="offline-pack-heading"
            >
              العمل دون إنترنت
            </h2>
            <p className="text-muted-foreground text-xs leading-6">
              يحفظ صفحات التطبيق العامة وملفاته المحلية. لا يحفظ مراسلات واتساب
              أو المواقع الخارجية.
            </p>
          </div>
        </div>

        <dl className="border-border grid min-w-0 gap-2 rounded-xl border bg-[var(--nasayem-green-050)] p-3 text-xs leading-6">
          <div className="flex min-w-0 justify-between gap-3 max-[279px]:flex-col max-[279px]:gap-0">
            <dt className="text-muted-foreground">دعم Service Worker</dt>
            <dd className="text-primary font-bold">
              {serviceWorkerSupported ? "مدعوم" : "غير مدعوم"}
            </dd>
          </div>
          <div className="flex min-w-0 justify-between gap-3 max-[279px]:flex-col max-[279px]:gap-0">
            <dt className="text-muted-foreground">حزمة المحتوى</dt>
            <dd className="text-primary font-bold">
              {packReady
                ? "جاهزة"
                : updateRequired
                  ? "تحتاج إلى تحديث"
                  : "غير مجهزة"}
            </dd>
          </div>
          <div className="flex min-w-0 justify-between gap-3 max-[279px]:flex-col max-[279px]:gap-0">
            <dt className="text-muted-foreground">الإصدار</dt>
            <dd className="text-primary min-w-0 break-all font-mono text-[10px]" dir="ltr">
              {currentVersion}
            </dd>
          </div>
          {metadata ? (
            <div className="flex min-w-0 justify-between gap-3 max-[279px]:flex-col max-[279px]:gap-0">
              <dt className="text-muted-foreground">آخر تجهيز ناجح</dt>
              <dd className="text-primary font-bold">
                {formatPreparationDate(metadata.lastPreparedAt)}
              </dd>
            </div>
          ) : null}
        </dl>

        {progress ? (
          <div className="space-y-1.5">
            <div
              aria-label="تقدم تجهيز المحتوى دون إنترنت"
              aria-valuemax={progress.total}
              aria-valuemin={0}
              aria-valuenow={progress.completed}
              className="bg-secondary h-2 overflow-hidden rounded-full"
              role="progressbar"
            >
              <span
                className="bg-primary block h-full rounded-full transition-[width]"
                style={{
                  width: `${Math.round(
                    (progress.completed / progress.total) * 100
                  )}%`
                }}
              />
            </div>
            <p className="text-muted-foreground text-xs leading-6">
              تم تجهيز {progress.completed} من {progress.total} صفحة
            </p>
          </div>
        ) : null}

        <button
          className="bg-primary text-primary-foreground focus-visible:ring-gold inline-flex min-h-12 w-full min-w-0 items-center justify-center gap-2 rounded-xl px-4 py-2 text-center text-sm font-bold focus-visible:ring-2 focus-visible:outline-none disabled:cursor-wait disabled:opacity-70"
          disabled={preparing || !serviceWorkerSupported}
          onClick={() => void prepareOfflinePack()}
          type="button"
        >
          {preparing ? (
            <RefreshCw
              aria-hidden="true"
              className="size-4 animate-spin motion-reduce:animate-none"
            />
          ) : packReady ? (
            <RefreshCw aria-hidden="true" className="size-4" />
          ) : (
            <Download aria-hidden="true" className="size-4" />
          )}
          {preparing
            ? "جارٍ تجهيز المحتوى للعمل دون إنترنت…"
            : packReady
              ? "تحديث المحتوى المحفوظ"
              : "تجهيز التطبيق للعمل دون إنترنت"}
        </button>

        {metadata ? (
          <button
            className="border-border text-primary focus-visible:ring-gold inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold focus-visible:ring-2 focus-visible:outline-none"
            onClick={openRemovalDialog}
            ref={removeTriggerRef}
            type="button"
          >
            <Trash2 aria-hidden="true" className="size-4" />
            حذف المحتوى المحفوظ دون إنترنت
          </button>
        ) : null}

        <p
          aria-live="polite"
          className="text-primary min-h-6 text-xs leading-6 font-semibold"
          role="status"
        >
          {statusMessage}
        </p>
      </section>

      <dialog
        aria-labelledby="remove-offline-title"
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-[20px] border border-[var(--nasayem-border)] bg-white p-0 text-right text-[var(--nasayem-green-900)] shadow-2xl backdrop:bg-black/45"
        dir="rtl"
        ref={dialogRef}
      >
        <div className="space-y-4 p-4">
          <div className="flex items-start justify-between gap-3">
            <h3
              className="text-primary text-lg leading-7 font-bold"
              id="remove-offline-title"
            >
              حذف المحتوى المحفوظ
            </h3>
            <button
              aria-label="إغلاق تأكيد حذف المحتوى"
              className="border-border focus-visible:ring-gold flex size-11 shrink-0 items-center justify-center rounded-xl border focus-visible:ring-2 focus-visible:outline-none"
              onClick={closeRemovalDialog}
              type="button"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
          <p className="text-muted-foreground text-sm leading-7">
            سيؤدي هذا الإجراء إلى حذف صفحات وملفات التطبيق المحفوظة للعمل دون
            إنترنت، دون حذف تقدمك أو موقع الصلاة المحفوظ.
          </p>
          <div className="grid gap-2 min-[330px]:grid-cols-2">
            <button
              className="border-border text-primary focus-visible:ring-gold min-h-11 rounded-xl border px-4 py-2 text-sm font-bold focus-visible:ring-2 focus-visible:outline-none"
              disabled={removing}
              onClick={closeRemovalDialog}
              ref={cancelRef}
              type="button"
            >
              إلغاء
            </button>
            <button
              className="focus-visible:ring-gold min-h-11 rounded-xl bg-red-700 px-4 py-2 text-sm font-bold text-white focus-visible:ring-2 focus-visible:outline-none disabled:opacity-70"
              disabled={removing}
              onClick={() => void removeOfflineContent()}
              type="button"
            >
              {removing ? "جارٍ الحذف…" : "حذف المحتوى"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
