"use client";

import * as React from "react";
import {
    FormControl,
    FormDescription,
    FormGroup,
    FormLabel,
    TagInput,
} from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

export function TagInputDemo() {
    const { locale } = useLocale();
    const [tags, setTags] = React.useState<string[]>(locale === "ja" ? ["デザイン", "レビュー"] : ["react", "typescript"]);

    return (
        <FormGroup className="w-full max-w-sm">
            <FormLabel htmlFor="tags">{locale === "ja" ? "タグ" : "Tags"}</FormLabel>
            <FormControl>
                <TagInput
                    id="tags"
                    value={tags}
                    onValueChange={setTags}
                    placeholder={locale === "ja" ? "タグを追加..." : "Add tag..."}
                    removeLabel={locale === "ja" ? "タグを削除" : "Remove tag"}
                />
            </FormControl>
            <FormDescription>
                {tags.length === 0
                    ? locale === "ja"
                        ? "タグを入力して Enter キーまたはカンマで追加します。"
                        : "Type a tag and press Enter or comma."
                    : locale === "ja"
                        ? `タグ: [${tags.map((t) => `"${t}"`).join(", ")}]`
                        : `tags: [${tags.map((t) => `"${t}"`).join(", ")}]`}
            </FormDescription>
        </FormGroup>
    );
}
