"use client";

import type { ComponentProps } from "react";
import { ChartDocPage } from "@/components/doc/ChartDocPage";
import displayMetadata from "@design/display-metadata.json";
import { RetentionCohortCard } from "@gunjo/ui";

type Locale = "en" | "ja";
type DataItem = ComponentProps<typeof RetentionCohortCard>["cohorts"][number];
const periodsByLocale: Record<Locale, string[]> = { en: ["M0", "M1", "M2", "M3", "M4", "M5", "M6", "M7"], ja: ["初月", "1か月", "2か月", "3か月", "4か月", "5か月", "6か月", "7か月"] };
const cohortsByLocale: Record<Locale, DataItem[]> = {
    en: [
        { label: "Jan cohort", size: 1240, values: [{ value: 100 }, { value: 76 }, { value: 64 }, { value: 58 }, { value: 51 }, { value: 46 }, { value: 41 }, { value: 36 }] },
        { label: "Feb cohort", size: 1144, values: [{ value: 100 }, { value: 72 }, { value: 62 }, { value: 62 }, { value: 48 }, { value: 42 }, { value: 37 }] },
        { label: "Mar cohort", size: 1048, values: [{ value: 100 }, { value: 68 }, { value: 56 }, { value: 49 }, { value: 43 }, { value: 38 }] },
        { label: "Apr cohort", size: 952, values: [{ value: 100 }, { value: 70 }, { value: 59 }, { value: 50 }, { value: 44 }] },
        { label: "May cohort", size: 856, values: [{ value: 100 }, { value: 66 }, { value: 53 }, { value: 47 }] },
        { label: "Jun cohort", size: 760, values: [{ value: 100 }, { value: 63 }, { value: 51 }] },
    ],
    ja: [
        { label: "1月コホート", size: 1240, values: [{ value: 100 }, { value: 76 }, { value: 64 }, { value: 58 }, { value: 51 }, { value: 46 }, { value: 41 }, { value: 36 }] },
        { label: "2月コホート", size: 1144, values: [{ value: 100 }, { value: 72 }, { value: 62 }, { value: 62 }, { value: 48 }, { value: 42 }, { value: 37 }] },
        { label: "3月コホート", size: 1048, values: [{ value: 100 }, { value: 68 }, { value: 56 }, { value: 49 }, { value: 43 }, { value: 38 }] },
        { label: "4月コホート", size: 952, values: [{ value: 100 }, { value: 70 }, { value: 59 }, { value: 50 }, { value: 44 }] },
        { label: "5月コホート", size: 856, values: [{ value: 100 }, { value: 66 }, { value: 53 }, { value: 47 }] },
        { label: "6月コホート", size: 760, values: [{ value: 100 }, { value: 63 }, { value: 51 }] },
    ],
};

const cohortCode = {
    en: `const periods = ["M0", "M1", "M2", "M3", "M4", "M5", "M6", "M7"];
const cohorts = [
    { label: "Jan cohort", size: 1240, values: [{ value: 100 }, { value: 76 }, { value: 64 }, { value: 58 }, { value: 51 }, { value: 46 }, { value: 41 }, { value: 36 }] },
    { label: "Feb cohort", size: 1144, values: [{ value: 100 }, { value: 72 }, { value: 62 }, { value: 62 }, { value: 48 }, { value: 42 }, { value: 37 }] },
    { label: "Mar cohort", size: 1048, values: [{ value: 100 }, { value: 68 }, { value: 56 }, { value: 49 }, { value: 43 }, { value: 38 }] },
    { label: "Apr cohort", size: 952, values: [{ value: 100 }, { value: 70 }, { value: 59 }, { value: 50 }, { value: 44 }] },
    { label: "May cohort", size: 856, values: [{ value: 100 }, { value: 66 }, { value: 53 }, { value: 47 }] },
    { label: "Jun cohort", size: 760, values: [{ value: 100 }, { value: 63 }, { value: 51 }] },
];`,
    ja: `const periods = ["初月", "1か月", "2か月", "3か月", "4か月", "5か月", "6か月", "7か月"];
const cohorts = [
    { label: "1月コホート", size: 1240, values: [{ value: 100 }, { value: 76 }, { value: 64 }, { value: 58 }, { value: 51 }, { value: 46 }, { value: 41 }, { value: 36 }] },
    { label: "2月コホート", size: 1144, values: [{ value: 100 }, { value: 72 }, { value: 62 }, { value: 62 }, { value: 48 }, { value: 42 }, { value: 37 }] },
    { label: "3月コホート", size: 1048, values: [{ value: 100 }, { value: 68 }, { value: 56 }, { value: 49 }, { value: 43 }, { value: 38 }] },
    { label: "4月コホート", size: 952, values: [{ value: 100 }, { value: 70 }, { value: 59 }, { value: 50 }, { value: 44 }] },
    { label: "5月コホート", size: 856, values: [{ value: 100 }, { value: 66 }, { value: 53 }, { value: 47 }] },
    { label: "6月コホート", size: 760, values: [{ value: 100 }, { value: 63 }, { value: 51 }] },
];`,
} as const;

const code = { en: `import { RetentionCohortCard } from "@gunjo/ui";

const periods = ["M0", "M1", "M2", "M3", "M4", "M5", "M6", "M7"];
const cohorts = [
    {
      label: "Jan cohort",
      size: 1240,
      values: [
        { value: 100 },
        { value: 76 },
        { value: 64 },
        { value: 58 },
        { value: 51 },
        { value: 46 },
        { value: 41 },
        { value: 36 },
      ],
    },
    {
      label: "Feb cohort",
      size: 1144,
      values: [
        { value: 100 },
        { value: 72 },
        { value: 62 },
        { value: 62 },
        { value: 48 },
        { value: 42 },
        { value: 37 },
      ],
    },
    {
      label: "Mar cohort",
      size: 1048,
      values: [
        { value: 100 },
        { value: 68 },
        { value: 56 },
        { value: 49 },
        { value: 43 },
        { value: 38 },
      ],
    },
    {
      label: "Apr cohort",
      size: 952,
      values: [
        { value: 100 },
        { value: 70 },
        { value: 59 },
        { value: 50 },
        { value: 44 },
      ],
    },
    {
      label: "May cohort",
      size: 856,
      values: [{ value: 100 }, { value: 66 }, { value: 53 }, { value: 47 }],
    },
    {
      label: "Jun cohort",
      size: 760,
      values: [{ value: 100 }, { value: 63 }, { value: 51 }],
    },
];

export function CohortRetentionTable() {
    return (
        <RetentionCohortCard
            title="Cohort retention"
            description="Feb cohort / M3 selected"
            value="62%"
            delta="-38pt"
            deltaDescription="Change from the first cohort period."
            periods={periods}
            cohorts={cohorts}
            selectedCell={{ cohortIndex: 1, periodIndex: 3 }}
            caption="Compare period retention across cohorts."
        />
    );
}`, ja: `import { RetentionCohortCard } from "@gunjo/ui";

const periods = ["初月", "1か月", "2か月", "3か月", "4か月", "5か月", "6か月", "7か月"];
const cohorts = [
    {
      label: "1月コホート",
      size: 1240,
      values: [
        { value: 100 },
        { value: 76 },
        { value: 64 },
        { value: 58 },
        { value: 51 },
        { value: 46 },
        { value: 41 },
        { value: 36 },
      ],
    },
    {
      label: "2月コホート",
      size: 1144,
      values: [
        { value: 100 },
        { value: 72 },
        { value: 62 },
        { value: 62 },
        { value: 48 },
        { value: 42 },
        { value: 37 },
      ],
    },
    {
      label: "3月コホート",
      size: 1048,
      values: [
        { value: 100 },
        { value: 68 },
        { value: 56 },
        { value: 49 },
        { value: 43 },
        { value: 38 },
      ],
    },
    {
      label: "4月コホート",
      size: 952,
      values: [
        { value: 100 },
        { value: 70 },
        { value: 59 },
        { value: 50 },
        { value: 44 },
      ],
    },
    {
      label: "5月コホート",
      size: 856,
      values: [{ value: 100 }, { value: 66 }, { value: 53 }, { value: 47 }],
    },
    {
      label: "6月コホート",
      size: 760,
      values: [{ value: 100 }, { value: 63 }, { value: 51 }],
    },
];

export function CohortRetentionTable() {
    return (
        <RetentionCohortCard
            title="コホート継続率"
            description="2月コホート / 3か月 選択中"
            value="62%"
            delta="-38pt"
            deltaDescription="初月からの変化量です。"
            periods={periods}
            cohorts={cohorts}
            selectedCell={{ cohortIndex: 1, periodIndex: 3 }}
            caption="期間別の継続率をコホートごとに比較します。"
        />
    );
}` } as const;
const usageCode = { en: `import { RetentionCohortCard } from "@gunjo/ui";

const periods = ["M0", "M1", "M2", "M3", "M4", "M5", "M6", "M7"];
const cohorts = [
    {
      label: "Jan cohort",
      size: 1240,
      values: [
        { value: 100 },
        { value: 76 },
        { value: 64 },
        { value: 58 },
        { value: 51 },
        { value: 46 },
        { value: 41 },
        { value: 36 },
      ],
    },
    {
      label: "Feb cohort",
      size: 1144,
      values: [
        { value: 100 },
        { value: 72 },
        { value: 62 },
        { value: 62 },
        { value: 48 },
        { value: 42 },
        { value: 37 },
      ],
    },
    {
      label: "Mar cohort",
      size: 1048,
      values: [
        { value: 100 },
        { value: 68 },
        { value: 56 },
        { value: 49 },
        { value: 43 },
        { value: 38 },
      ],
    },
    {
      label: "Apr cohort",
      size: 952,
      values: [
        { value: 100 },
        { value: 70 },
        { value: 59 },
        { value: 50 },
        { value: 44 },
      ],
    },
    {
      label: "May cohort",
      size: 856,
      values: [{ value: 100 }, { value: 66 }, { value: 53 }, { value: 47 }],
    },
    {
      label: "Jun cohort",
      size: 760,
      values: [{ value: 100 }, { value: 63 }, { value: 51 }],
    },
];

export function CohortRetentionVariants() {
    return (
        <div className="grid gap-6">
            <RetentionCohortCard periods={periods} cohorts={cohorts} />
            <RetentionCohortCard periods={periods} cohorts={cohorts} showValues={false} />
            <RetentionCohortCard periods={periods} cohorts={cohorts} variant="compact" />
        </div>
    );
}`, ja: `import { RetentionCohortCard } from "@gunjo/ui";

const periods = ["初月", "1か月", "2か月", "3か月", "4か月", "5か月", "6か月", "7か月"];
const cohorts = [
    {
      label: "1月コホート",
      size: 1240,
      values: [
        { value: 100 },
        { value: 76 },
        { value: 64 },
        { value: 58 },
        { value: 51 },
        { value: 46 },
        { value: 41 },
        { value: 36 },
      ],
    },
    {
      label: "2月コホート",
      size: 1144,
      values: [
        { value: 100 },
        { value: 72 },
        { value: 62 },
        { value: 62 },
        { value: 48 },
        { value: 42 },
        { value: 37 },
      ],
    },
    {
      label: "3月コホート",
      size: 1048,
      values: [
        { value: 100 },
        { value: 68 },
        { value: 56 },
        { value: 49 },
        { value: 43 },
        { value: 38 },
      ],
    },
    {
      label: "4月コホート",
      size: 952,
      values: [
        { value: 100 },
        { value: 70 },
        { value: 59 },
        { value: 50 },
        { value: 44 },
      ],
    },
    {
      label: "5月コホート",
      size: 856,
      values: [{ value: 100 }, { value: 66 }, { value: 53 }, { value: 47 }],
    },
    {
      label: "6月コホート",
      size: 760,
      values: [{ value: 100 }, { value: 63 }, { value: 51 }],
    },
];

export function CohortRetentionVariants() {
    return (
        <div className="grid gap-6">
            <RetentionCohortCard periods={periods} cohorts={cohorts} />
            <RetentionCohortCard periods={periods} cohorts={cohorts} showValues={false} />
            <RetentionCohortCard periods={periods} cohorts={cohorts} variant="compact" />
        </div>
    );
}` } as const;
const propsData = { en: [{"name":"cohorts","type":"RetentionCohortRow[]","description":"Cohort rows and their period values."},{"name":"periods","type":"ReactNode[]","description":"Column labels such as M0, M1, or elapsed months."},{"name":"selectedCell","type":"{ cohortIndex: number; periodIndex: number }","description":"Highlights the inspected cell."}], ja: [{"name":"cohorts","type":"RetentionCohortRow[]","description":"コホート行と各期間の値です。"},{"name":"periods","type":"ReactNode[]","description":"初月、1か月など列に表示する期間ラベルです。"},{"name":"selectedCell","type":"{ cohortIndex: number; periodIndex: number }","description":"確認中のセルを強調します。"}] } as const;
const states = { en: [{ key: "default", title: "Default", description: "Standard cohort table with values.", preview: <RetentionCohortCard title="Cohort retention" periods={periodsByLocale.en} cohorts={cohortsByLocale.en} />, previewBodyWidth: "xl", code: `import { RetentionCohortCard } from "@gunjo/ui";

const periods = ["M0", "M1", "M2", "M3", "M4", "M5", "M6", "M7"];
const cohorts = [
    {
      label: "Jan cohort",
      size: 1240,
      values: [
        { value: 100 },
        { value: 76 },
        { value: 64 },
        { value: 58 },
        { value: 51 },
        { value: 46 },
        { value: 41 },
        { value: 36 },
      ],
    },
    {
      label: "Feb cohort",
      size: 1144,
      values: [
        { value: 100 },
        { value: 72 },
        { value: 62 },
        { value: 62 },
        { value: 48 },
        { value: 42 },
        { value: 37 },
      ],
    },
    {
      label: "Mar cohort",
      size: 1048,
      values: [
        { value: 100 },
        { value: 68 },
        { value: 56 },
        { value: 49 },
        { value: 43 },
        { value: 38 },
      ],
    },
    {
      label: "Apr cohort",
      size: 952,
      values: [
        { value: 100 },
        { value: 70 },
        { value: 59 },
        { value: 50 },
        { value: 44 },
      ],
    },
    {
      label: "May cohort",
      size: 856,
      values: [{ value: 100 }, { value: 66 }, { value: 53 }, { value: 47 }],
    },
    {
      label: "Jun cohort",
      size: 760,
      values: [{ value: 100 }, { value: 63 }, { value: 51 }],
    },
];

export function CohortRetentionTable() {
    return <RetentionCohortCard periods={periods} cohorts={cohorts} />;
}` }, { key: "selected", title: "Selected cell", description: "Highlights one cohort period.", preview: <RetentionCohortCard title="Cohort retention" periods={periodsByLocale.en} cohorts={cohortsByLocale.en} selectedCell={{ cohortIndex: 1, periodIndex: 2 }} />, previewBodyWidth: "xl", code: `import { RetentionCohortCard } from "@gunjo/ui";

const periods = ["M0", "M1", "M2", "M3", "M4", "M5", "M6", "M7"];
const cohorts = [
    {
      label: "Jan cohort",
      size: 1240,
      values: [
        { value: 100 },
        { value: 76 },
        { value: 64 },
        { value: 58 },
        { value: 51 },
        { value: 46 },
        { value: 41 },
        { value: 36 },
      ],
    },
    {
      label: "Feb cohort",
      size: 1144,
      values: [
        { value: 100 },
        { value: 72 },
        { value: 62 },
        { value: 62 },
        { value: 48 },
        { value: 42 },
        { value: 37 },
      ],
    },
    {
      label: "Mar cohort",
      size: 1048,
      values: [
        { value: 100 },
        { value: 68 },
        { value: 56 },
        { value: 49 },
        { value: 43 },
        { value: 38 },
      ],
    },
    {
      label: "Apr cohort",
      size: 952,
      values: [
        { value: 100 },
        { value: 70 },
        { value: 59 },
        { value: 50 },
        { value: 44 },
      ],
    },
    {
      label: "May cohort",
      size: 856,
      values: [{ value: 100 }, { value: 66 }, { value: 53 }, { value: 47 }],
    },
    {
      label: "Jun cohort",
      size: 760,
      values: [{ value: 100 }, { value: 63 }, { value: 51 }],
    },
];

export function SelectedCellCohortRetention() {
    return (
        <RetentionCohortCard
          periods={periods}
          cohorts={cohorts}
          selectedCell={{ cohortIndex: 1, periodIndex: 2 }}
        />
    );
}` }, { key: "no-values", title: "No values", description: "Keeps intensity while hiding cell text.", preview: <RetentionCohortCard title="Cohort retention" periods={periodsByLocale.en} cohorts={cohortsByLocale.en} showValues={false} />, previewBodyWidth: "xl", code: `import { RetentionCohortCard } from "@gunjo/ui";

const periods = ["M0", "M1", "M2", "M3", "M4", "M5", "M6", "M7"];
const cohorts = [
    {
      label: "Jan cohort",
      size: 1240,
      values: [
        { value: 100 },
        { value: 76 },
        { value: 64 },
        { value: 58 },
        { value: 51 },
        { value: 46 },
        { value: 41 },
        { value: 36 },
      ],
    },
    {
      label: "Feb cohort",
      size: 1144,
      values: [
        { value: 100 },
        { value: 72 },
        { value: 62 },
        { value: 62 },
        { value: 48 },
        { value: 42 },
        { value: 37 },
      ],
    },
    {
      label: "Mar cohort",
      size: 1048,
      values: [
        { value: 100 },
        { value: 68 },
        { value: 56 },
        { value: 49 },
        { value: 43 },
        { value: 38 },
      ],
    },
    {
      label: "Apr cohort",
      size: 952,
      values: [
        { value: 100 },
        { value: 70 },
        { value: 59 },
        { value: 50 },
        { value: 44 },
      ],
    },
    {
      label: "May cohort",
      size: 856,
      values: [{ value: 100 }, { value: 66 }, { value: 53 }, { value: 47 }],
    },
    {
      label: "Jun cohort",
      size: 760,
      values: [{ value: 100 }, { value: 63 }, { value: 51 }],
    },
];

export function CohortRetentionWithoutValues() {
    return <RetentionCohortCard periods={periods} cohorts={cohorts} showValues={false} />;
}` }, { key: "compact", title: "Compact", description: "Compact density for dashboard grids.", preview: <RetentionCohortCard title="Cohort retention" periods={periodsByLocale.en} cohorts={cohortsByLocale.en} variant="compact" />, previewBodyWidth: "lg", code: `import { RetentionCohortCard } from "@gunjo/ui";

const periods = ["M0", "M1", "M2", "M3", "M4", "M5", "M6", "M7"];
const cohorts = [
    {
      label: "Jan cohort",
      size: 1240,
      values: [
        { value: 100 },
        { value: 76 },
        { value: 64 },
        { value: 58 },
        { value: 51 },
        { value: 46 },
        { value: 41 },
        { value: 36 },
      ],
    },
    {
      label: "Feb cohort",
      size: 1144,
      values: [
        { value: 100 },
        { value: 72 },
        { value: 62 },
        { value: 62 },
        { value: 48 },
        { value: 42 },
        { value: 37 },
      ],
    },
    {
      label: "Mar cohort",
      size: 1048,
      values: [
        { value: 100 },
        { value: 68 },
        { value: 56 },
        { value: 49 },
        { value: 43 },
        { value: 38 },
      ],
    },
    {
      label: "Apr cohort",
      size: 952,
      values: [
        { value: 100 },
        { value: 70 },
        { value: 59 },
        { value: 50 },
        { value: 44 },
      ],
    },
    {
      label: "May cohort",
      size: 856,
      values: [{ value: 100 }, { value: 66 }, { value: 53 }, { value: 47 }],
    },
    {
      label: "Jun cohort",
      size: 760,
      values: [{ value: 100 }, { value: 63 }, { value: 51 }],
    },
];

export function CompactCohortRetention() {
    return <RetentionCohortCard periods={periods} cohorts={cohorts} variant="compact" />;
}` }], ja: [{ key: "default", title: "標準表示", description: "値付きの標準コホート表です。", preview: <RetentionCohortCard title="コホート継続率" periods={periodsByLocale.ja} cohorts={cohortsByLocale.ja} />, previewBodyWidth: "xl", code: `import { RetentionCohortCard } from "@gunjo/ui";

const periods = ["初月", "1か月", "2か月", "3か月", "4か月", "5か月", "6か月", "7か月"];
const cohorts = [
    {
      label: "1月コホート",
      size: 1240,
      values: [
        { value: 100 },
        { value: 76 },
        { value: 64 },
        { value: 58 },
        { value: 51 },
        { value: 46 },
        { value: 41 },
        { value: 36 },
      ],
    },
    {
      label: "2月コホート",
      size: 1144,
      values: [
        { value: 100 },
        { value: 72 },
        { value: 62 },
        { value: 62 },
        { value: 48 },
        { value: 42 },
        { value: 37 },
      ],
    },
    {
      label: "3月コホート",
      size: 1048,
      values: [
        { value: 100 },
        { value: 68 },
        { value: 56 },
        { value: 49 },
        { value: 43 },
        { value: 38 },
      ],
    },
    {
      label: "4月コホート",
      size: 952,
      values: [
        { value: 100 },
        { value: 70 },
        { value: 59 },
        { value: 50 },
        { value: 44 },
      ],
    },
    {
      label: "5月コホート",
      size: 856,
      values: [{ value: 100 }, { value: 66 }, { value: 53 }, { value: 47 }],
    },
    {
      label: "6月コホート",
      size: 760,
      values: [{ value: 100 }, { value: 63 }, { value: 51 }],
    },
];

export function CohortRetentionTable() {
    return <RetentionCohortCard periods={periods} cohorts={cohorts} />;
}` }, { key: "selected", title: "選択セル", description: "確認中のコホート期間を強調します。", preview: <RetentionCohortCard title="コホート継続率" periods={periodsByLocale.ja} cohorts={cohortsByLocale.ja} selectedCell={{ cohortIndex: 1, periodIndex: 2 }} />, previewBodyWidth: "xl", code: `import { RetentionCohortCard } from "@gunjo/ui";

const periods = ["初月", "1か月", "2か月", "3か月", "4か月", "5か月", "6か月", "7か月"];
const cohorts = [
    {
      label: "1月コホート",
      size: 1240,
      values: [
        { value: 100 },
        { value: 76 },
        { value: 64 },
        { value: 58 },
        { value: 51 },
        { value: 46 },
        { value: 41 },
        { value: 36 },
      ],
    },
    {
      label: "2月コホート",
      size: 1144,
      values: [
        { value: 100 },
        { value: 72 },
        { value: 62 },
        { value: 62 },
        { value: 48 },
        { value: 42 },
        { value: 37 },
      ],
    },
    {
      label: "3月コホート",
      size: 1048,
      values: [
        { value: 100 },
        { value: 68 },
        { value: 56 },
        { value: 49 },
        { value: 43 },
        { value: 38 },
      ],
    },
    {
      label: "4月コホート",
      size: 952,
      values: [
        { value: 100 },
        { value: 70 },
        { value: 59 },
        { value: 50 },
        { value: 44 },
      ],
    },
    {
      label: "5月コホート",
      size: 856,
      values: [{ value: 100 }, { value: 66 }, { value: 53 }, { value: 47 }],
    },
    {
      label: "6月コホート",
      size: 760,
      values: [{ value: 100 }, { value: 63 }, { value: 51 }],
    },
];

export function SelectedCellCohortRetention() {
    return (
        <RetentionCohortCard
          periods={periods}
          cohorts={cohorts}
          selectedCell={{ cohortIndex: 1, periodIndex: 2 }}
        />
    );
}` }, { key: "no-values", title: "値なし", description: "セル内テキストを消して濃淡だけで確認します。", preview: <RetentionCohortCard title="コホート継続率" periods={periodsByLocale.ja} cohorts={cohortsByLocale.ja} showValues={false} />, previewBodyWidth: "xl", code: `import { RetentionCohortCard } from "@gunjo/ui";

const periods = ["初月", "1か月", "2か月", "3か月", "4か月", "5か月", "6か月", "7か月"];
const cohorts = [
    {
      label: "1月コホート",
      size: 1240,
      values: [
        { value: 100 },
        { value: 76 },
        { value: 64 },
        { value: 58 },
        { value: 51 },
        { value: 46 },
        { value: 41 },
        { value: 36 },
      ],
    },
    {
      label: "2月コホート",
      size: 1144,
      values: [
        { value: 100 },
        { value: 72 },
        { value: 62 },
        { value: 62 },
        { value: 48 },
        { value: 42 },
        { value: 37 },
      ],
    },
    {
      label: "3月コホート",
      size: 1048,
      values: [
        { value: 100 },
        { value: 68 },
        { value: 56 },
        { value: 49 },
        { value: 43 },
        { value: 38 },
      ],
    },
    {
      label: "4月コホート",
      size: 952,
      values: [
        { value: 100 },
        { value: 70 },
        { value: 59 },
        { value: 50 },
        { value: 44 },
      ],
    },
    {
      label: "5月コホート",
      size: 856,
      values: [{ value: 100 }, { value: 66 }, { value: 53 }, { value: 47 }],
    },
    {
      label: "6月コホート",
      size: 760,
      values: [{ value: 100 }, { value: 63 }, { value: 51 }],
    },
];

export function CohortRetentionWithoutValues() {
    return <RetentionCohortCard periods={periods} cohorts={cohorts} showValues={false} />;
}` }, { key: "compact", title: "コンパクト", description: "ダッシュボードグリッド向けの密度です。", preview: <RetentionCohortCard title="コホート継続率" periods={periodsByLocale.ja} cohorts={cohortsByLocale.ja} variant="compact" />, previewBodyWidth: "lg", code: `import { RetentionCohortCard } from "@gunjo/ui";

const periods = ["初月", "1か月", "2か月", "3か月", "4か月", "5か月", "6か月", "7か月"];
const cohorts = [
    {
      label: "1月コホート",
      size: 1240,
      values: [
        { value: 100 },
        { value: 76 },
        { value: 64 },
        { value: 58 },
        { value: 51 },
        { value: 46 },
        { value: 41 },
        { value: 36 },
      ],
    },
    {
      label: "2月コホート",
      size: 1144,
      values: [
        { value: 100 },
        { value: 72 },
        { value: 62 },
        { value: 62 },
        { value: 48 },
        { value: 42 },
        { value: 37 },
      ],
    },
    {
      label: "3月コホート",
      size: 1048,
      values: [
        { value: 100 },
        { value: 68 },
        { value: 56 },
        { value: 49 },
        { value: 43 },
        { value: 38 },
      ],
    },
    {
      label: "4月コホート",
      size: 952,
      values: [
        { value: 100 },
        { value: 70 },
        { value: 59 },
        { value: 50 },
        { value: 44 },
      ],
    },
    {
      label: "5月コホート",
      size: 856,
      values: [{ value: 100 }, { value: 66 }, { value: 53 }, { value: 47 }],
    },
    {
      label: "6月コホート",
      size: 760,
      values: [{ value: 100 }, { value: 63 }, { value: 51 }],
    },
];

export function CompactCohortRetention() {
    return <RetentionCohortCard periods={periods} cohorts={cohorts} variant="compact" />;
}` }] } as const;

const designDecisions = {
    ja: (
        <>
            <li>
                <strong>濃さは1色の透明度で作る。</strong>升目の色は期間ごとに変えず、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">color</code> に渡した1色の不透明度を 0.08 から 1.00 まで動かして作ります。虹色にすると「濃い＝多い」が読めなくなるためです。数字を重ねるかどうかは <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">showValues</code> で切り替えます（升目が小さいときは畳みます）。
            </li>
            <li>
                <strong>横スクロールをこのカードの中に閉じ込めた。</strong>升目の表は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">overflow-x-auto</code> の入れ物に入れ、スマホでは最低 34rem を確保して中で横に流します。カードの外枠は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">overflow-hidden</code> です。これが無いと、期間の多いコホート表がページ全体の横スクロールを引き起こします。
            </li>
            <li>
                <strong>升目の無いところは押せない空欄にした。</strong>まだ来ていない期間は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-hidden</code> の空欄で、ボタンにしていません。<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">onCellSelect</code> を渡したときだけ升目が <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">button</code> になり、渡さなければ読むだけの表のままです。
                <br />
                一般のカードの設計は UIXHERO の「カード」にあります。{" "}
                <a
                    className="underline underline-offset-4"
                    href="https://www.uixhero.com/resources/ui-components/card"
                    target="_blank"
                    rel="noreferrer"
                >
                    UIXHERO: カード（Card）
                </a>
            </li>
        </>
    ),
    en: (
        <>
            <li>
                <strong>Depth is one hue at varying opacity.</strong> Cells never change colour by period; the single <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">color</code> is drawn at an opacity that runs from 0.08 to 1.00. A rainbow would destroy the darker-means-more reading. Whether the number is printed on top is a separate switch, <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">showValues</code>, so small cells can drop it.
            </li>
            <li>
                <strong>Horizontal scrolling is contained inside this card.</strong> The grid sits in an <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">overflow-x-auto</code> box and holds a 34rem floor on phones so it scrolls within itself; the card shell is <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">overflow-hidden</code>. Without that, a cohort table with many periods leaks page-level horizontal scroll.
            </li>
            <li>
                <strong>Missing cells are inert blanks.</strong> Periods that have not happened yet render as <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-hidden</code> blanks rather than buttons. Cells become <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">button</code> elements only when <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">onCellSelect</code> is supplied; otherwise the grid is something you read, not something you operate.
                <br />
                The general design of cards is covered by UIXHERO&rsquo;s card article.{" "}
                <a
                    className="underline underline-offset-4"
                    href="https://www.uixhero.com/resources/ui-components/card"
                    target="_blank"
                    rel="noreferrer"
                >
                    UIXHERO: Card (in Japanese)
                </a>
            </li>
        </>
    ),
};

export default function RetentionCohortCardPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;

    return <ChartDocPage designDecisions={designDecisions} title={{ en: meta.retentionCohortCard.title, ja: "継続率コホートカード" }} description={{ en: meta.retentionCohortCard.description, ja: "獲得月や開始時期ごとの継続率を、期間別のセルで比較するコホートカードです。" }} code={code} usageCode={usageCode} propsData={propsData} demo="retention-cohort-card" embedBase="/embed/retention-cohort-card" previewHeight={460} states={states} usedComponents={{ en: [{ name: "RetentionCohortCard", href: "/docs/components/retention-cohort-card" }, { name: "ChartLegend", href: "/docs/components/chart-legend" }, { name: "Tooltip", href: "/docs/components/tooltip" }], ja: [{ name: "継続率コホートカード", href: "/docs/components/retention-cohort-card" }, { name: "チャート凡例", href: "/docs/components/chart-legend" }, { name: "ツールチップ", href: "/docs/components/tooltip" }] }} relatedComponents={{ en: [{"name":"HeatmapChart","href":"/docs/components/heatmap-chart"},{"name":"Table","href":"/docs/components/table"}], ja: [{"name":"ヒートマップ","href":"/docs/components/heatmap-chart"},{"name":"テーブル","href":"/docs/components/table"}] }} />;
}
