"use client";

import * as React from "react";
import { CurrencyInput, formatCurrency } from "@gunjo/ui";

export function CurrencyInputDemo() {
    const [amount, setAmount] = React.useState<number | undefined>(1200000);

    return (
        <div className="flex w-full max-w-xs flex-col gap-2">
            <label htmlFor="currency-demo" className="text-sm font-medium text-foreground">
                請求金額
            </label>
            <CurrencyInput
                id="currency-demo"
                value={amount}
                onValueChange={setAmount}
                min={0}
            />
            <p className="text-xs text-muted-foreground">
                数値: {amount ?? "（未入力）"} ／ 表示: {amount !== undefined ? formatCurrency(amount) : "—"}
            </p>
        </div>
    );
}
