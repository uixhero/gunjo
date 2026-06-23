"use client";

import * as React from "react";
import { SignedRecord, Textarea, type SignedRecordValue } from "@gunjo/ui";

export function SignedRecordDemo() {
    const [body, setBody] = React.useState(
        "経過良好。創部に感染兆候なし。本日退院とする。退院後は外来でフォロー。"
    );
    const [record, setRecord] = React.useState<SignedRecordValue>({ status: "draft", addenda: [] });

    return (
        <div className="w-full max-w-lg">
            <SignedRecord
                value={record}
                onChange={setRecord}
                signerId="dr-yamada"
                canSign={body.trim().length > 0}
            >
                {({ readOnly }) => (
                    <div className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-foreground">退院時サマリ本文</span>
                        {readOnly ? (
                            <p className="rounded-md border bg-muted/30 p-3 text-sm leading-relaxed text-foreground">
                                {body}
                            </p>
                        ) : (
                            <Textarea
                                rows={3}
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                aria-label="退院時サマリ本文"
                            />
                        )}
                    </div>
                )}
            </SignedRecord>

            {record.status === "signed" ? (
                <button
                    type="button"
                    className="mt-3 text-xs text-muted-foreground underline"
                    onClick={() => setRecord({ status: "draft", addenda: [] })}
                >
                    リセット（下書きに戻す）
                </button>
            ) : null}
        </div>
    );
}
