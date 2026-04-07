"use client";

import { useUiLanguage } from "@/components/i18n/UiLanguageProvider";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { language, setLanguage, copy } = useUiLanguage();

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/[0.12] px-2 py-2">
      <span className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
        {copy.language.label}
      </span>
      {(["vi", "en"] as const).map((candidateLanguage) => (
        <button
          key={candidateLanguage}
          type="button"
          onClick={() => setLanguage(candidateLanguage)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-semibold transition",
            language === candidateLanguage
              ? "bg-[linear-gradient(135deg,rgba(34,197,94,0.96),rgba(6,182,212,0.96))] text-white shadow-[0_12px_30px_-16px_rgba(34,197,94,0.7)]"
              : "text-slate-300 hover:bg-white/[0.06] hover:text-white",
          )}
        >
          {candidateLanguage === "vi"
            ? copy.language.vietnamese
            : copy.language.english}
        </button>
      ))}
    </div>
  );
}
