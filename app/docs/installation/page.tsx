"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import { DocProse } from "@/components/doc/DocProse";

export default function InstallationPage() {
  const { locale } = useLocale();
  const content = getDocContent("installation", locale);

  if (!content?.body) {
    return (
      <div className="space-y-6">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Installation
        </h1>
        <p className="text-lg text-muted-foreground">
          How to install dependencies and structure your app.
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
