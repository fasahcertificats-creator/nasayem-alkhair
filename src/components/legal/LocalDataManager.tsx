"use client";

import { Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { clearNasayemDeviceData } from "@/lib/app-storage";

export function LocalDataManager() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    function restoreFocus() {
      triggerRef.current?.focus();
    }

    dialog.addEventListener("close", restoreFocus);

    return () => dialog.removeEventListener("close", restoreFocus);
  }, []);

  function openDialog() {
    setMessage("");
    dialogRef.current?.showModal();
    window.setTimeout(() => cancelRef.current?.focus(), 0);
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function deleteData() {
    try {
      clearNasayemDeviceData();
      closeDialog();
      setMessage("تم حذف بيانات التطبيق المحلية من هذا الجهاز.");
    } catch {
      closeDialog();
      setMessage("تعذر حذف البيانات الآن. حاول مرة أخرى من إعدادات المتصفح.");
    }
  }

  return (
    <div className="space-y-3">
      <p>
        تشمل بيانات التطبيق على هذا الجهاز الموقع المحفوظ وتقدم الأذكار والتسبيح
        ودليل العمرة والتفضيلات المحلية. لا يرسل إجراء الحذف طلبًا إلى أي خادم.
      </p>
      <button
        className="border-primary/20 text-primary focus-visible:ring-gold inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-bold focus-visible:ring-2 focus-visible:outline-none"
        onClick={openDialog}
        ref={triggerRef}
        type="button"
      >
        <Trash2 aria-hidden="true" className="size-4" />
        مسح بيانات التطبيق من هذا الجهاز
      </button>
      <p aria-live="polite" className="text-primary text-xs leading-6 font-semibold">
        {message}
      </p>

      <dialog
        aria-labelledby="delete-data-title"
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-[20px] border border-[var(--nasayem-border)] bg-white p-0 text-right text-[var(--nasayem-green-900)] shadow-2xl backdrop:bg-black/45"
        dir="rtl"
        ref={dialogRef}
      >
        <div className="space-y-4 p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-primary text-lg leading-7 font-bold" id="delete-data-title">
              تأكيد حذف بيانات التطبيق
            </h3>
            <button
              aria-label="إغلاق نافذة تأكيد الحذف"
              className="border-border focus-visible:ring-gold flex size-11 shrink-0 items-center justify-center rounded-xl border focus-visible:ring-2 focus-visible:outline-none"
              onClick={closeDialog}
              type="button"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
          <p className="text-muted-foreground text-sm leading-7">
            سيؤدي هذا الإجراء إلى حذف تقدم الأذكار والتسبيح ودليل العمرة والموقع
            المحفوظ من هذا الجهاز. لا يمكن التراجع عن الحذف.
          </p>
          <div className="grid gap-2 min-[330px]:grid-cols-2">
            <button
              className="border-border text-primary focus-visible:ring-gold min-h-11 rounded-xl border px-4 py-2 text-sm font-bold focus-visible:ring-2 focus-visible:outline-none"
              onClick={closeDialog}
              ref={cancelRef}
              type="button"
            >
              إلغاء
            </button>
            <button
              className="focus-visible:ring-gold min-h-11 rounded-xl bg-red-700 px-4 py-2 text-sm font-bold text-white focus-visible:ring-2 focus-visible:outline-none"
              onClick={deleteData}
              type="button"
            >
              حذف البيانات
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
