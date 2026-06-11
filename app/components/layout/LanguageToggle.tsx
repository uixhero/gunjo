"use client";

import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

export function LanguageToggle() {
  const { locale, setLocale, tooltip } = useLocale();
  const label = locale === "en" ? tooltip("switchToJa") : tooltip("switchToEn");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocale(locale === "en" ? "ja" : "en")}
          className="h-9 px-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          aria-label={label}
        >
          {locale === "en" ? "JA" : "EN"}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
