"use client";

import * as React from "react";
import {
    EditableDataTable,
    type EditableColumn,
    Input,
    NumberInput,
    formatCurrency,
} from "@gunjo/ui";

interface LineItem {
    id: string;
    name: string;
    qty: number;
    price: number;
}

export function EditableDataTableDemo() {
    const [rows, setRows] = React.useState<LineItem[]>([
        { id: "1", name: "デザイン制作", qty: 10, price: 12000 },
        { id: "2", name: "ホスティング", qty: 1, price: 5000 },
    ]);
    const idRef = React.useRef(2);

    const update = (index: number, patch: Partial<LineItem>) =>
        setRows((rs) => rs.map((r, i) => (i === index ? { ...r, ...patch } : r)));

    const columns: EditableColumn<LineItem>[] = [
        {
            id: "name",
            header: "品目",
            minWidth: "12rem",
            cell: (row, ctx) => (
                <Input
                    value={row.name}
                    aria-label={ctx.ariaLabel}
                    onChange={(e) => update(ctx.rowIndex, { name: e.target.value })}
                />
            ),
        },
        {
            id: "qty",
            header: "数量",
            align: "right",
            width: "6.5rem",
            cell: (row, ctx) => (
                <NumberInput
                    value={row.qty}
                    min={0}
                    aria-label={ctx.ariaLabel}
                    onValueChange={(v) => update(ctx.rowIndex, { qty: v })}
                />
            ),
        },
        {
            id: "price",
            header: "単価",
            align: "right",
            width: "8rem",
            cell: (row, ctx) => (
                <NumberInput
                    value={row.price}
                    min={0}
                    step={100}
                    aria-label={ctx.ariaLabel}
                    onValueChange={(v) => update(ctx.rowIndex, { price: v })}
                />
            ),
        },
        {
            id: "amount",
            header: "金額",
            align: "right",
            width: "8rem",
            cell: (row) => (
                <span className="tabular-nums">{formatCurrency(row.qty * row.price)}</span>
            ),
        },
    ];

    const total = rows.reduce((sum, r) => sum + r.qty * r.price, 0);

    return (
        <EditableDataTable
            columns={columns}
            rows={rows}
            getRowId={(r) => r.id}
            minRows={1}
            onAddRow={() => {
                idRef.current += 1;
                setRows((rs) => [...rs, { id: String(idRef.current), name: "", qty: 1, price: 0 }]);
            }}
            onRemoveRow={(index) => setRows((rs) => rs.filter((_, i) => i !== index))}
            getRowError={(row) => (row.name.trim() === "" ? "品目を入力してください" : undefined)}
            labels={{
                addRow: "明細を追加",
                removeRow: (i) => `${i + 1}行目を削除`,
            }}
            rowLabel={(i) => `${i + 1}行目`}
            renderFooterCell={(column) =>
                column.id === "name" ? (
                    <span>合計</span>
                ) : column.id === "amount" ? (
                    <span className="tabular-nums">{formatCurrency(total)}</span>
                ) : null
            }
        />
    );
}
