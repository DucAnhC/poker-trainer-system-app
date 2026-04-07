"use client";

import { useUiLanguage } from "@/components/i18n/UiLanguageProvider";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { language, setLanguage, copy } = useUiLanguage();

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-2 py-2 shadow-sm">
      <span className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
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
              ? "bg-accent-strong text-white shadow-sm"
              : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
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
