"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";
import { isEnRoute, jaEquivalentPath } from "@/lib/cold-test-paths";

export function LanguageToggle() {
  const { locale, setLocale, tooltip } = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const label = locale === "en" ? tooltip("switchToJa") : tooltip("switchToEn");

  // On an /en route the language is the URL, so switching to Japanese has to
  // navigate: flipping the stored preference alone would leave the reader on a
  // page whose body is still English. Every /en path has a JA original, so the
  // target always exists.
  const handleClick = () => {
    const next = locale === "en" ? "ja" : "en";
    setLocale(next);
    if (next === "ja" && isEnRoute(pathname)) {
      router.push(jaEquivalentPath(pathname ?? "/"));
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClick}
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
