"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import { DocProse } from "@/components/doc/DocProse";

export default function NoNpmPage() {
  const { locale } = useLocale();
  const content = getDocContent("no-npm", locale);

  if (!content?.body) {
    return (
      <div className="space-y-6">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Using GunjoUI without npm
        </h1>
        <p className="text-lg text-muted-foreground">
          Build GunjoUI-look screens with tokens.css where npm and CDNs are
          unavailable.
        </p>
      </div>
    );
  }

  return (
    <DocProse
      title={content.title}
      description={content.description}
      body={content.body}
    />
  );
}
