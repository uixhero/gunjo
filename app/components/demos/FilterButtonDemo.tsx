"use client";

import { FilterButton } from "@gunjo/ui";
import { useState } from "react";

export function FilterButtonDemo() {
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const options = [
        { label: "Pending", value: "pending" },
        { label: "In Progress", value: "in_progress" },
        { label: "Completed", value: "completed" },
        { label: "Archived", value: "archived" },
    ];

    return (
        <div className="flex justify-center h-40 items-start">
            <FilterButton
                title="Status"
                options={options}
                selectedValues={selected}
                onFilterChange={setSelected}
            />
        </div>
    );
}
