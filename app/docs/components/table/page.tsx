"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@gunjo/ui";

const codeByLocale = {
    ja: `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gunjo/ui";

export function Example() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>項目</TableHead>
          <TableHead>状態</TableHead>
          <TableHead className="text-right">金額</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">API</TableCell>
          <TableCell>完了</TableCell>
          <TableCell className="text-right">¥12,000</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">ドキュメント</TableCell>
          <TableCell>確認中</TableCell>
          <TableCell className="text-right">¥8,000</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}`,
    en: `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gunjo/ui";

export function Example() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">API</TableCell>
          <TableCell>Done</TableCell>
          <TableCell className="text-right">$120.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Docs</TableCell>
          <TableCell>Reviewing</TableCell>
          <TableCell className="text-right">$80.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}`,
} as const;

const stripedCodeByLocale = {
    ja: `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gunjo/ui";

export function StripedRows() {
  return (
    <Table striped>
      <TableHeader>
        <TableRow>
          <TableHead>項目</TableHead>
          <TableHead>状態</TableHead>
          <TableHead>担当</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow><TableCell>API</TableCell><TableCell>完了</TableCell><TableCell>佐藤</TableCell></TableRow>
        <TableRow><TableCell>ドキュメント</TableCell><TableCell>確認中</TableCell><TableCell>鈴木</TableCell></TableRow>
        <TableRow><TableCell>デザイン</TableCell><TableCell>未着手</TableCell><TableCell>高橋</TableCell></TableRow>
      </TableBody>
    </Table>
  );
}`,
    en: `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gunjo/ui";

export function StripedRows() {
  return (
    <Table striped>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Owner</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow><TableCell>API</TableCell><TableCell>Done</TableCell><TableCell>Sato</TableCell></TableRow>
        <TableRow><TableCell>Docs</TableCell><TableCell>Reviewing</TableCell><TableCell>Suzuki</TableCell></TableRow>
        <TableRow><TableCell>Design</TableCell><TableCell>Not started</TableCell><TableCell>Takahashi</TableCell></TableRow>
      </TableBody>
    </Table>
  );
}`,
} as const;

const footerCodeByLocale = {
    ja: `import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@gunjo/ui";

export function SummaryTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow><TableHead>項目</TableHead><TableHead className="text-right">金額</TableHead></TableRow>
      </TableHeader>
      <TableBody>
        <TableRow><TableCell>API</TableCell><TableCell className="text-right">¥12,000</TableCell></TableRow>
        <TableRow><TableCell>ドキュメント</TableCell><TableCell className="text-right">¥8,000</TableCell></TableRow>
      </TableBody>
      <TableFooter>
        <TableRow><TableCell>合計</TableCell><TableCell className="text-right">¥20,000</TableCell></TableRow>
      </TableFooter>
    </Table>
  );
}`,
    en: `import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@gunjo/ui";

export function SummaryTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow><TableHead>Item</TableHead><TableHead className="text-right">Amount</TableHead></TableRow>
      </TableHeader>
      <TableBody>
        <TableRow><TableCell>API</TableCell><TableCell className="text-right">$120.00</TableCell></TableRow>
        <TableRow><TableCell>Docs</TableCell><TableCell className="text-right">$80.00</TableCell></TableRow>
      </TableBody>
      <TableFooter>
        <TableRow><TableCell>Total</TableCell><TableCell className="text-right">$200.00</TableCell></TableRow>
      </TableFooter>
    </Table>
  );
}`,
} as const;

const captionCodeByLocale = {
    ja: `import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@gunjo/ui";

export function CaptionedTable() {
  return (
    <Table>
      <TableCaption>リリース前確認の担当一覧です。</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>項目</TableHead>
          <TableHead>期限</TableHead>
          <TableHead>担当</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>アクセシビリティ確認</TableCell>
          <TableCell>5月28日</TableCell>
          <TableCell>佐藤</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>公開前レビュー</TableCell>
          <TableCell>5月30日</TableCell>
          <TableCell>鈴木</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}`,
    en: `import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@gunjo/ui";

export function CaptionedTable() {
  return (
    <Table>
      <TableCaption>Pre-release review owners.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Due</TableHead>
          <TableHead>Owner</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Accessibility check</TableCell>
          <TableCell>May 28</TableCell>
          <TableCell>Sato</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Pre-publish review</TableCell>
          <TableCell>May 30</TableCell>
          <TableCell>Suzuki</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}`,
} as const;

const horizontalScrollCodeByLocale = {
    ja: `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gunjo/ui";

export function HorizontalScrollTable() {
  return (
    <div className="w-full max-w-xs">
      <Table className="min-w-[640px]">
        <TableHeader>
          <TableRow>
            <TableHead>項目</TableHead>
            <TableHead>状態</TableHead>
            <TableHead>担当</TableHead>
            <TableHead>期限</TableHead>
            <TableHead>最終更新</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>アクセシビリティ確認</TableCell>
            <TableCell>確認中</TableCell>
            <TableCell>佐藤</TableCell>
            <TableCell>5月28日</TableCell>
            <TableCell>5月26日 10:00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>公開前レビュー</TableCell>
            <TableCell>未着手</TableCell>
            <TableCell>鈴木</TableCell>
            <TableCell>5月30日</TableCell>
            <TableCell>5月25日 18:30</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}`,
    en: `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gunjo/ui";

export function HorizontalScrollTable() {
  return (
    <div className="w-full max-w-xs">
      <Table className="min-w-[640px]">
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Due</TableHead>
            <TableHead>Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Accessibility check</TableCell>
            <TableCell>Reviewing</TableCell>
            <TableCell>Sato</TableCell>
            <TableCell>May 28</TableCell>
            <TableCell>May 26 10:00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Pre-publish review</TableCell>
            <TableCell>Not started</TableCell>
            <TableCell>Suzuki</TableCell>
            <TableCell>May 30</TableCell>
            <TableCell>May 25 18:30</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}`,
} as const;

const tablePropsByLocale = {
    ja: [
        { name: "striped", type: "boolean", default: "false", description: "本文行の背景色を交互に変えます。" },
        { name: "className", type: "string", description: "表全体の幅やセルの見え方を調整するクラスです。" },
    ],
    en: [
        { name: "striped", type: "boolean", default: "false", description: "Alternates body row background color." },
        { name: "className", type: "string", description: "Optional class added to the table element." },
    ],
} as const;

const rowPropsByLocale = {
    ja: [
        { name: "className", type: "string", description: "行、見出し、セルに追加するクラスです。" },
        { name: "children", type: "ReactNode", required: true, description: "見出し行、本文行、フッター行、セルなどの内容です。" },
    ],
    en: [
        { name: "className", type: "string", description: "Optional class added to rows, headers, or cells." },
        { name: "children", type: "ReactNode", required: true, description: "Content for each table part." },
    ],
} as const;

function AmountTable({ withFooter = false, locale }: { withFooter?: boolean; locale: "ja" | "en" }) {
    const rows = locale === "ja"
        ? [
            { item: "API", status: "完了", amount: "¥12,000" },
            { item: "ドキュメント", status: "確認中", amount: "¥8,000" },
        ]
        : [
            { item: "API", status: "Done", amount: "$120.00" },
            { item: "Docs", status: "Reviewing", amount: "$80.00" },
        ];

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{locale === "ja" ? "項目" : "Item"}</TableHead>
                    <TableHead>{locale === "ja" ? "状態" : "Status"}</TableHead>
                    <TableHead className="text-right">{locale === "ja" ? "金額" : "Amount"}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.item}>
                        <TableCell className="font-medium">{row.item}</TableCell>
                        <TableCell>{row.status}</TableCell>
                        <TableCell className="text-right">{row.amount}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            {withFooter ? (
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={2}>{locale === "ja" ? "合計" : "Total"}</TableCell>
                        <TableCell className="text-right">{locale === "ja" ? "¥20,000" : "$200.00"}</TableCell>
                    </TableRow>
                </TableFooter>
            ) : null}
        </Table>
    );
}

function StatusOwnerTable({ locale }: { locale: "ja" | "en" }) {
    const rows = locale === "ja"
        ? [
            { item: "API", status: "完了", owner: "佐藤" },
            { item: "ドキュメント", status: "確認中", owner: "鈴木" },
            { item: "デザイン", status: "未着手", owner: "高橋" },
        ]
        : [
            { item: "API", status: "Done", owner: "Sato" },
            { item: "Docs", status: "Reviewing", owner: "Suzuki" },
            { item: "Design", status: "Not started", owner: "Takahashi" },
        ];

    return (
        <Table striped>
            <TableHeader>
                <TableRow>
                    <TableHead>{locale === "ja" ? "項目" : "Item"}</TableHead>
                    <TableHead>{locale === "ja" ? "状態" : "Status"}</TableHead>
                    <TableHead>{locale === "ja" ? "担当" : "Owner"}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.item}>
                        <TableCell className="font-medium">{row.item}</TableCell>
                        <TableCell>{row.status}</TableCell>
                        <TableCell>{row.owner}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

function ReviewTable({ locale }: { locale: "ja" | "en" }) {
    const rows = locale === "ja"
        ? [
            { item: "アクセシビリティ確認", due: "5月28日", owner: "佐藤" },
            { item: "公開前レビュー", due: "5月30日", owner: "鈴木" },
        ]
        : [
            { item: "Accessibility check", due: "May 28", owner: "Sato" },
            { item: "Pre-publish review", due: "May 30", owner: "Suzuki" },
        ];

    return (
        <Table>
            <TableCaption>{locale === "ja" ? "リリース前確認の担当一覧です。" : "Pre-release review owners."}</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>{locale === "ja" ? "項目" : "Item"}</TableHead>
                    <TableHead>{locale === "ja" ? "期限" : "Due"}</TableHead>
                    <TableHead>{locale === "ja" ? "担当" : "Owner"}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.item}>
                        <TableCell className="font-medium">{row.item}</TableCell>
                        <TableCell>{row.due}</TableCell>
                        <TableCell>{row.owner}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

function HorizontalScrollTable({ locale }: { locale: "ja" | "en" }) {
    const rows = locale === "ja"
        ? [
            { item: "アクセシビリティ確認", status: "確認中", owner: "佐藤", due: "5月28日", updated: "5月26日 10:00" },
            { item: "公開前レビュー", status: "未着手", owner: "鈴木", due: "5月30日", updated: "5月25日 18:30" },
        ]
        : [
            { item: "Accessibility check", status: "Reviewing", owner: "Sato", due: "May 28", updated: "May 26 10:00" },
            { item: "Pre-publish review", status: "Not started", owner: "Suzuki", due: "May 30", updated: "May 25 18:30" },
        ];

    return (
        <div className="w-full max-w-xs">
            <Table className="min-w-[640px]">
                <TableHeader>
                    <TableRow>
                        <TableHead>{locale === "ja" ? "項目" : "Item"}</TableHead>
                        <TableHead>{locale === "ja" ? "状態" : "Status"}</TableHead>
                        <TableHead>{locale === "ja" ? "担当" : "Owner"}</TableHead>
                        <TableHead>{locale === "ja" ? "期限" : "Due"}</TableHead>
                        <TableHead>{locale === "ja" ? "最終更新" : "Updated"}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.item}>
                            <TableCell className="font-medium">{row.item}</TableCell>
                            <TableCell>{row.status}</TableCell>
                            <TableCell>{row.owner}</TableCell>
                            <TableCell>{row.due}</TableCell>
                            <TableCell>{row.updated}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default function TablePage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/table", locale);
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const code = codeByLocale[locale];

    return (
        <ComponentLayout
            title={content?.title ?? meta.table.title}
            description={content?.description ?? meta.table.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Table", href: "/docs/components/table" },
                { name: "TableHeader", href: "/docs/components/table" },
                { name: "TableBody", href: "/docs/components/table" },
                { name: "TableRow", href: "/docs/components/table" },
                { name: "TableCell", href: "/docs/components/table" },
                { name: "TableCaption", href: "/docs/components/table" },
            ]}
            relatedComponents={[
                { name: "DataTable", href: "/docs/components/data-table" },
                { name: "MetadataList", href: "/docs/components/metadata-list" },
                { name: "MarkdownRenderer", href: "/docs/components/markdown-renderer" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewBodyWidth="lg" previewHeight="auto">
                <AmountTable locale={locale} />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "striped",
                            title: locale === "ja" ? "ストライプ" : "Striped",
                            description: locale === "ja"
                                ? "行数が多い読み取り専用の表では、交互の背景色で横方向の読み取りを補助します。"
                                : "Use striped rows for dense read-only tables.",
                            preview: <StatusOwnerTable locale={locale} />,
                            code: stripedCodeByLocale[locale],
                        },
                        {
                            key: "footer",
                            title: locale === "ja" ? "フッター" : "Footer",
                            description: locale === "ja"
                                ? "合計や集計値はフッター行にまとめ、本文の明細行と分けて示します。"
                                : "Use TableFooter for totals and summary values.",
                            preview: <AmountTable locale={locale} withFooter />,
                            code: footerCodeByLocale[locale],
                        },
                        {
                            key: "caption",
                            title: locale === "ja" ? "キャプション" : "Caption",
                            description: locale === "ja"
                                ? "表の対象期間や集計範囲を、表の構造に含めて補足します。"
                                : "Use TableCaption to describe the table's period, scope, or summary context.",
                            preview: <ReviewTable locale={locale} />,
                            code: captionCodeByLocale[locale],
                        },
                        {
                            key: "horizontal-scroll",
                            title: locale === "ja" ? "横スクロール" : "Horizontal scroll",
                            description: locale === "ja"
                                ? "小さい画面では列を無理に縮めず、表に最小幅を持たせて横方向にスクロールできるようにします。"
                                : "On small screens, preserve column width with a minimum table width and let the table scroll horizontally.",
                            preview: <HorizontalScrollTable locale={locale} />,
                            code: horizontalScrollCodeByLocale[locale],
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {sectionLabels.props}
                </h2>
                <h3 className="text-xl font-semibold">Table</h3>
                <PropsTable data={tablePropsByLocale[locale]} />
                <h3 className="text-xl font-semibold">{locale === "ja" ? "Table の構成要素" : "Table parts"}</h3>
                <PropsTable data={rowPropsByLocale[locale]} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={code} />
                </div>
                <CodeBlock code={code} />
            </div>
        </ComponentLayout>
    );
}
