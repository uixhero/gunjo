"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge, DataTable } from "@gunjo/ui";

type Person = {
    id: string;
    name: string;
    email: string;
    status: "active" | "pending" | "inactive";
};

const data: Person[] = [
    { id: "1", name: "Alice Chen", email: "alice@example.com", status: "active" },
    { id: "2", name: "Bob Tanaka", email: "bob@example.com", status: "pending" },
    { id: "3", name: "Carol Lee", email: "carol@example.com", status: "active" },
    { id: "4", name: "Dan Park", email: "dan@example.com", status: "inactive" },
    { id: "5", name: "Erin Liu", email: "erin@example.com", status: "active" },
    { id: "6", name: "Frank Yu", email: "frank@example.com", status: "pending" },
    { id: "7", name: "Grace Kim", email: "grace@example.com", status: "active" },
    { id: "8", name: "Henry Suzuki", email: "henry@example.com", status: "inactive" },
    { id: "9", name: "Iris Watanabe", email: "iris@example.com", status: "active" },
    { id: "10", name: "Jack Sato", email: "jack@example.com", status: "pending" },
    { id: "11", name: "Kate Ito", email: "kate@example.com", status: "active" },
    { id: "12", name: "Leo Mori", email: "leo@example.com", status: "active" },
];

const columns: ColumnDef<Person>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            const variant =
                status === "active"
                    ? "default"
                    : status === "pending"
                      ? "secondary"
                      : "outline";
            return <Badge variant={variant as "default" | "secondary" | "outline"}>{status}</Badge>;
        },
    },
];

export function DataTableDemo() {
    return (
        <DataTable
            columns={columns}
            data={data}
            filter={{ columnId: "name", placeholder: "Filter by name..." }}
            pageSize={5}
        />
    );
}
