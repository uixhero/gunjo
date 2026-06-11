"use client";

import type React from "react";
import Link from "next/link";
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Checkbox,
    Input,
    RadioGroup,
    RadioGroupItem,
    RangeSlider,
    Separator,
    Slider,
    Switch,
    Textarea,
    Toggle,
    ToggleGroup,
    ToggleGroupItem,
} from "@gunjo/ui";
import {
    IconAlertTriangle,
    IconAt,
    IconArrowRight,
    IconCalendar,
    IconCheck,
    IconChevronDown,
    IconClock,
    IconCopy,
    IconEye,
    IconFilter,
    IconForms,
    IconHash,
    IconListCheck,
    IconPencil,
    IconSearch,
    IconSelector,
    IconSortAscending,
    IconTextCaption,
    IconUpload,
} from "@tabler/icons-react";

import { useLocale } from "@/components/providers/LocaleProvider";

type Localized = {
    ja: string;
    en: string;
};

type ComponentGuide = {
    name: string;
    href: string;
    preview: ComponentPreviewKind;
    purpose: Localized;
    useWhen: Localized;
};

type ComponentPreviewKind =
    | "button"
    | "tooltipButton"
    | "input"
    | "label"
    | "checkbox"
    | "switch"
    | "textarea"
    | "radioGroup"
    | "slider"
    | "rangeSlider"
    | "select"
    | "toggleGroup"
    | "toggle"
    | "numberInput"
    | "passwordInput"
    | "passwordGroup"
    | "passwordRequirementList"
    | "passwordStrengthMeter"
    | "phoneInput"
    | "postalCodeInput"
    | "searchInput"
    | "inputOTP"
    | "calendar"
    | "filterButton"
    | "sortButton"
    | "editableField"
    | "form"
    | "combobox"
    | "datePicker"
    | "dateRangePicker"
    | "timePicker"
    | "tagInput"
    | "mention"
    | "fileUploader";

const componentGroups: Array<{
    title: Localized;
    description: Localized;
    icon: typeof IconTextCaption;
    items: ComponentGuide[];
}> = [
    {
        title: { ja: "文字と数値", en: "Text and numeric input" },
        description: {
            ja: "ユーザーが直接値を書き込む基本入力です。",
            en: "Base controls for values typed directly by the user.",
        },
        icon: IconTextCaption,
        items: [
            {
                name: "Input",
                href: "/docs/components/input",
                preview: "input",
                purpose: { ja: "短いテキスト", en: "Short text" },
                useWhen: { ja: "名前、タイトル、検索前の単一行入力。", en: "Names, titles, and single-line values." },
            },
            {
                name: "SearchInput",
                href: "/docs/components/search-input",
                preview: "searchInput",
                purpose: { ja: "検索", en: "Search" },
                useWhen: { ja: "一覧、コマンド、メディアの絞り込み。", en: "Filtering lists, commands, and media." },
            },
            {
                name: "Textarea",
                href: "/docs/components/textarea",
                preview: "textarea",
                purpose: { ja: "長いテキスト", en: "Long text" },
                useWhen: { ja: "メモ、説明、問い合わせ本文。", en: "Notes, descriptions, and message bodies." },
            },
            {
                name: "NumberInput",
                href: "/docs/components/number-input",
                preview: "numberInput",
                purpose: { ja: "数値", en: "Numeric values" },
                useWhen: { ja: "増減ボタンや最小/最大値が必要な数値。", en: "Numbers that need steppers, min, or max." },
            },
            {
                name: "PasswordInput",
                href: "/docs/components/password-input",
                preview: "passwordInput",
                purpose: { ja: "パスワード", en: "Passwords" },
                useWhen: { ja: "表示/非表示を切り替える秘匿入力。", en: "Secret values with show/hide control." },
            },
            {
                name: "PasswordGroup",
                href: "/docs/components/password-group",
                preview: "passwordGroup",
                purpose: { ja: "要件付きパスワード", en: "Password policy field" },
                useWhen: { ja: "要件、強度、エラーを1つのパスワード入力として見せる。", en: "Show requirements, strength, and errors with a password field." },
            },
            {
                name: "PasswordRequirementList",
                href: "/docs/components/password-requirement-list",
                preview: "passwordRequirementList",
                purpose: { ja: "パスワード要件", en: "Password requirements" },
                useWhen: { ja: "要件チェックリストを単体でも表示したい時。", en: "Standalone checklist for password policy requirements." },
            },
            {
                name: "PasswordStrengthMeter",
                href: "/docs/components/password-strength-meter",
                preview: "passwordStrengthMeter",
                purpose: { ja: "パスワード強度", en: "Password strength" },
                useWhen: { ja: "強度評価だけを別の場所に表示したい時。", en: "Standalone display for password strength feedback." },
            },
            {
                name: "PhoneInput",
                href: "/docs/components/phone-input",
                preview: "phoneInput",
                purpose: { ja: "電話番号", en: "Phone number" },
                useWhen: { ja: "国番号や入力整形が必要な電話番号。", en: "Phone values that need calling-code and formatting affordances." },
            },
            {
                name: "PostalCodeInput",
                href: "/docs/components/postal-code-input",
                preview: "postalCodeInput",
                purpose: { ja: "郵便番号", en: "Postal code" },
                useWhen: { ja: "3桁-4桁など、入力整形が必要な郵便番号。", en: "Postal codes that need formatting assistance." },
            },
            {
                name: "InputOTP",
                href: "/docs/components/input-otp",
                preview: "inputOTP",
                purpose: { ja: "確認コード", en: "Verification codes" },
                useWhen: { ja: "一時コードや二段階認証。電話番号や郵便番号には使わない。", en: "One-time codes and 2FA. Not phone or postal inputs." },
            },
            {
                name: "Label",
                href: "/docs/components/label",
                preview: "label",
                purpose: { ja: "入力名", en: "Field label" },
                useWhen: { ja: "入力欄、チェック項目、選択肢の名前を操作対象と紐づける。", en: "Bind field names to inputs, checks, and choices." },
            },
        ],
    },
    {
        title: { ja: "選択", en: "Selection" },
        description: {
            ja: "候補から選ぶ、または状態を切り替える入力です。",
            en: "Controls for choosing options or toggling states.",
        },
        icon: IconSelector,
        items: [
            {
                name: "Select",
                href: "/docs/components/select",
                preview: "select",
                purpose: { ja: "固定候補から1つ選ぶ", en: "Pick one fixed option" },
                useWhen: { ja: "候補が少なく、検索が不要な選択。", en: "Small option lists that do not need search." },
            },
            {
                name: "Combobox",
                href: "/docs/components/combobox",
                preview: "combobox",
                purpose: { ja: "検索して選ぶ", en: "Search and select" },
                useWhen: { ja: "候補が多い、または絞り込みが必要な選択。", en: "Large option sets that need filtering." },
            },
            {
                name: "Checkbox",
                href: "/docs/components/checkbox",
                preview: "checkbox",
                purpose: { ja: "複数選択・同意", en: "Multiple choice or agreement" },
                useWhen: { ja: "複数選べる項目、同意、確認。", en: "Multiple selections, agreement, or confirmation." },
            },
            {
                name: "RadioGroup",
                href: "/docs/components/radio-group",
                preview: "radioGroup",
                purpose: { ja: "排他的な選択", en: "Exclusive choice" },
                useWhen: { ja: "見えている候補から必ず1つ選ぶ。", en: "Choose exactly one visible option." },
            },
            {
                name: "Switch",
                href: "/docs/components/switch",
                preview: "switch",
                purpose: { ja: "即時に切り替わる設定", en: "Immediate setting toggle" },
                useWhen: { ja: "オン/オフがすぐ反映される設定。", en: "Settings that apply immediately." },
            },
            {
                name: "Toggle",
                href: "/docs/components/toggle",
                preview: "toggle",
                purpose: { ja: "単独の押下状態", en: "Single pressed state" },
                useWhen: { ja: "表示切り替えやツールボタンのオン/オフ。", en: "On/off states for view or tool buttons." },
            },
            {
                name: "ToggleGroup",
                href: "/docs/components/toggle-group",
                preview: "toggleGroup",
                purpose: { ja: "複数の押下状態", en: "Grouped pressed states" },
                useWhen: { ja: "整列、表示密度、編集ツールなどのまとまった切り替え。", en: "Alignment, density, and grouped editor tools." },
            },
        ],
    },
    {
        title: { ja: "日時と範囲", en: "Date, time, and range" },
        description: {
            ja: "日付、時刻、連続値を扱う入力です。",
            en: "Inputs for dates, times, and continuous values.",
        },
        icon: IconCalendar,
        items: [
            {
                name: "Calendar",
                href: "/docs/components/calendar",
                preview: "calendar",
                purpose: { ja: "日付の面表示", en: "Calendar surface" },
                useWhen: { ja: "日付選択 UI の中核として使う。", en: "Core calendar surface for date selection." },
            },
            {
                name: "DatePicker",
                href: "/docs/components/date-picker",
                preview: "datePicker",
                purpose: { ja: "単一の日付", en: "Single date" },
                useWhen: { ja: "入力とカレンダー選択の両方が必要な日付。", en: "A date that can be typed or selected." },
            },
            {
                name: "DateRangePicker",
                href: "/docs/components/date-range-picker",
                preview: "dateRangePicker",
                purpose: { ja: "開始日と終了日", en: "Start and end date" },
                useWhen: { ja: "キャンペーン期間、集計期間、予約期間。", en: "Campaign, reporting, and booking ranges." },
            },
            {
                name: "TimePicker",
                href: "/docs/components/time-picker",
                preview: "timePicker",
                purpose: { ja: "時刻", en: "Time" },
                useWhen: { ja: "時間と分を選ぶ。日付とは分けて扱う。", en: "Select hours and minutes separately from dates." },
            },
            {
                name: "Slider",
                href: "/docs/components/slider",
                preview: "slider",
                purpose: { ja: "単一の連続値", en: "Single continuous value" },
                useWhen: { ja: "音量、ズーム、強さなどを目安で調整する。", en: "Approximate controls such as volume, zoom, or intensity." },
            },
            {
                name: "RangeSlider",
                href: "/docs/components/range-slider",
                preview: "rangeSlider",
                purpose: { ja: "範囲の連続値", en: "Continuous range" },
                useWhen: { ja: "価格、容量、期間などの最小値と最大値を同時に指定する。", en: "Choose min and max values for price, size, duration, and similar ranges." },
            },
        ],
    },
    {
        title: { ja: "入力補助と編集", en: "Input helpers and editing" },
        description: {
            ja: "入力操作の周辺に置く補助コンポーネントです。",
            en: "Supporting components around input workflows.",
        },
        icon: IconForms,
        items: [
            {
                name: "Button",
                href: "/docs/components/button",
                preview: "button",
                purpose: { ja: "操作の実行", en: "Action" },
                useWhen: { ja: "送信、保存、削除、移動などの明示的な操作。", en: "Explicit actions such as submit, save, delete, and navigate." },
            },
            {
                name: "TooltipButton",
                href: "/docs/components/tooltip-button",
                preview: "tooltipButton",
                purpose: { ja: "説明付きの操作", en: "Action with explanation" },
                useWhen: { ja: "アイコンだけのボタンや、押す前に補足が必要な操作。", en: "Icon-only actions or actions that need explanation before use." },
            },
            {
                name: "Form",
                href: "/docs/components/form",
                preview: "form",
                purpose: { ja: "フォーム構造", en: "Form structure" },
                useWhen: { ja: "ラベル、説明、エラー、送信をまとめる。", en: "Group labels, descriptions, errors, and submission." },
            },
            {
                name: "EditableField",
                href: "/docs/components/editable-field",
                preview: "editableField",
                purpose: { ja: "明示的な編集", en: "Explicit editing" },
                useWhen: { ja: "読み取り表示から編集、保存、キャンセルへ切り替える。", en: "Switch from display to edit, save, and cancel." },
            },
            {
                name: "FileUploader",
                href: "/docs/components/file-uploader",
                preview: "fileUploader",
                purpose: { ja: "ファイル選択とアップロード", en: "File selection and upload" },
                useWhen: { ja: "ドラッグ、選択、進行状況、成功・失敗状態を扱う。", en: "Handle drag, select, progress, success, and failure states." },
            },
            {
                name: "FilterButton",
                href: "/docs/components/filter-button",
                preview: "filterButton",
                purpose: { ja: "絞り込み", en: "Filtering" },
                useWhen: { ja: "一覧や検索結果に条件を追加する。", en: "Add conditions to lists or search results." },
            },
            {
                name: "SortButton",
                href: "/docs/components/sort-button",
                preview: "sortButton",
                purpose: { ja: "並び替え", en: "Sorting" },
                useWhen: { ja: "なし、昇順、降順を切り替える。", en: "Cycle none, ascending, and descending." },
            },
            {
                name: "TagInput",
                href: "/docs/components/tag-input",
                preview: "tagInput",
                purpose: { ja: "タグの複数入力", en: "Multiple tags" },
                useWhen: { ja: "キーワード、カテゴリ、ラベルを複数追加する。", en: "Add multiple keywords, categories, or labels." },
            },
            {
                name: "Mention",
                href: "/docs/components/mention",
                preview: "mention",
                purpose: { ja: "本文内の参照", en: "Inline references" },
                useWhen: { ja: "本文中で担当者や対象を候補から挿入する。", en: "Insert assignees or entities from suggestions inside text." },
            },
        ],
    },
];

const commonRules: Array<{ title: Localized; description: Localized }> = [
    {
        title: { ja: "ラベルは操作対象と紐づける", en: "Labels are bound to controls" },
        description: {
            ja: "Input、Checkbox、RadioGroup などは、表示ラベルと操作対象をアクセシブルに接続します。",
            en: "Connect visible labels to controls for Input, Checkbox, RadioGroup, and similar fields.",
        },
    },
    {
        title: { ja: "補助テキストとエラーは同じ領域で扱う", en: "Helper and error text share the field area" },
        description: {
            ja: "通常時は説明、検証後はエラーを表示し、入力中に不要なエラーを出しすぎないようにします。",
            en: "Show helper text normally and validation errors after validation, without over-reporting while typing.",
        },
    },
    {
        title: { ja: "無効化には理由を付ける", en: "Disabled controls explain why" },
        description: {
            ja: "操作できない理由は Tooltip と補助テキストで補足します。見た目だけで終わらせません。",
            en: "Explain disabled reasons with Tooltip and helper text instead of relying on appearance alone.",
        },
    },
    {
        title: { ja: "幅と高さはフォーム単位で揃える", en: "Width and height align at form level" },
        description: {
            ja: "入力欄、セレクト、ボタン、補助 UI が同じフォーム内でばらつかないようにします。",
            en: "Keep fields, selects, buttons, and helper controls aligned within the same form.",
        },
    },
    {
        title: { ja: "保存や失敗にはフィードバックを返す", en: "Save and failure return feedback" },
        description: {
            ja: "保存、アップロード、編集確定などの操作には Toast やインライン表示で結果を返します。",
            en: "Return results for save, upload, and edit actions with Toast or inline feedback.",
        },
    },
];

const decisionPairs: Array<{ title: Localized; body: Localized; primary: string; secondary: string }> = [
    {
        title: { ja: "Select と Combobox", en: "Select vs. Combobox" },
        body: {
            ja: "候補が少なく固定なら Select。候補が多く検索が必要なら Combobox。",
            en: "Use Select for small fixed lists. Use Combobox when options need search.",
        },
        primary: "Select",
        secondary: "Combobox",
    },
    {
        title: { ja: "Checkbox と Switch", en: "Checkbox vs. Switch" },
        body: {
            ja: "フォーム送信まで確定しない同意や選択は Checkbox。即時反映される設定は Switch。",
            en: "Use Checkbox for form choices. Use Switch for settings that apply immediately.",
        },
        primary: "Checkbox",
        secondary: "Switch",
    },
    {
        title: { ja: "Slider と RangeSlider", en: "Slider vs. RangeSlider" },
        body: {
            ja: "1つの値なら Slider。最小値と最大値を同時に扱うなら RangeSlider。",
            en: "Use Slider for one value. Use RangeSlider when selecting min and max together.",
        },
        primary: "Slider",
        secondary: "RangeSlider",
    },
    {
        title: { ja: "InputOTP と専用入力", en: "InputOTP vs. formatted fields" },
        body: {
            ja: "OTP は確認コード専用。電話番号、郵便番号、パスワード条件表示は別コンポーネント候補として扱います。",
            en: "InputOTP is only for verification codes. Phone, postal, and password-rule fields should be separate components.",
        },
        primary: "InputOTP",
        secondary: "Future inputs",
    },
];

const futureItems = [
    "PasswordGroup",
    "PhoneInput",
    "PostalCodeInput",
    "DateTimePicker",
    "MaskedInput",
];

function pickText(locale: "ja" | "en", text: Localized) {
    return text[locale];
}

function PreviewShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-24 w-full min-w-[160px] items-center justify-center rounded-md border bg-muted/20 p-3 sm:w-48">
            {children}
        </div>
    );
}

function MiniCalendar() {
    const days = ["", "", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

    return (
        <div className="w-28 rounded-md border bg-background p-2 shadow-sm">
            <div className="mb-2 flex items-center justify-between text-[10px] font-medium">
                <span>2026</span>
                <span>5月</span>
            </div>
            <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => (
                    <span
                        key={`${day}-${index}`}
                        className={[
                            "flex h-4 items-center justify-center rounded text-[9px]",
                            day === "8" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                            !day ? "bg-muted/60" : "",
                        ].join(" ")}
                    >
                        {day}
                    </span>
                ))}
            </div>
        </div>
    );
}

function ComponentPreview({ kind }: { kind: ComponentPreviewKind }) {
    switch (kind) {
        case "button":
            return (
                <PreviewShell>
                    <Button size="sm" tabIndex={-1}>
                        保存
                    </Button>
                </PreviewShell>
            );
        case "tooltipButton":
            return (
                <PreviewShell>
                    <Button size="icon" variant="outline" tabIndex={-1} aria-label="AI用仕様">
                        <IconCopy className="h-4 w-4" />
                    </Button>
                </PreviewShell>
            );
        case "input":
            return (
                <PreviewShell>
                    <Input className="pointer-events-none h-8 w-36" value="タイトル" readOnly tabIndex={-1} />
                </PreviewShell>
            );
        case "searchInput":
            return (
                <PreviewShell>
                    <div className="relative">
                        <IconSearch className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input className="pointer-events-none h-8 w-36 pl-8" value="検索" readOnly tabIndex={-1} />
                    </div>
                </PreviewShell>
            );
        case "textarea":
            return (
                <PreviewShell>
                    <Textarea className="pointer-events-none h-14 w-36 resize-none" value="メモを入力" readOnly tabIndex={-1} />
                </PreviewShell>
            );
        case "numberInput":
            return (
                <PreviewShell>
                    <div className="flex h-8 w-28 items-center justify-between rounded-lg border bg-background px-3 text-sm shadow-sm">
                        <span>12</span>
                        <span className="text-xs text-muted-foreground">+ / -</span>
                    </div>
                </PreviewShell>
            );
        case "passwordInput":
            return (
                <PreviewShell>
                    <div className="flex h-8 w-36 items-center justify-between rounded-lg border bg-background px-3 text-sm shadow-sm">
                        <span>••••••••</span>
                        <IconEye className="h-4 w-4 text-muted-foreground" />
                    </div>
                </PreviewShell>
            );
        case "passwordGroup":
            return (
                <PreviewShell>
                    <div className="grid w-40 gap-1.5">
                        <div className="flex h-8 items-center justify-between rounded-lg border bg-background px-3 text-sm shadow-sm">
                            <span>••••••••</span>
                            <IconEye className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                            {[0, 1, 2].map((item) => (
                                <span key={item} className="h-1 rounded-full bg-success" />
                            ))}
                            <span className="h-1 rounded-full bg-muted" />
                        </div>
                    </div>
                </PreviewShell>
            );
        case "passwordRequirementList":
            return (
                <PreviewShell>
                    <div className="grid gap-1 text-xs">
                        <span className="inline-flex items-center gap-1 text-success-strong"><IconCheck className="h-3 w-3" /> 12文字</span>
                        <span className="inline-flex items-center gap-1 text-muted-foreground"><IconAlertTriangle className="h-3 w-3" /> 記号</span>
                    </div>
                </PreviewShell>
            );
        case "passwordStrengthMeter":
            return (
                <PreviewShell>
                    <div className="grid w-36 gap-1">
                        <div className="grid grid-cols-4 gap-1">
                            {[0, 1, 2].map((item) => (
                                <span key={item} className="h-1.5 rounded-full bg-success" />
                            ))}
                            <span className="h-1.5 rounded-full bg-muted" />
                        </div>
                        <span className="text-xs text-muted-foreground">強い</span>
                    </div>
                </PreviewShell>
            );
        case "phoneInput":
            return (
                <PreviewShell>
                    <div className="flex h-8 w-40 items-center rounded-lg border bg-background text-sm shadow-sm">
                        <span className="border-r px-2 text-muted-foreground">+81</span>
                        <span className="truncate px-2">090-1234</span>
                    </div>
                </PreviewShell>
            );
        case "postalCodeInput":
            return (
                <PreviewShell>
                    <div className="flex h-8 w-36 items-center rounded-lg border bg-background text-sm shadow-sm">
                        <span className="border-r px-2 text-muted-foreground">〒</span>
                        <span className="px-2">150-0001</span>
                    </div>
                </PreviewShell>
            );
        case "inputOTP":
            return (
                <PreviewShell>
                    <div className="flex gap-1.5">
                        {["4", "8", "", ""].map((value, index) => (
                            <span key={index} className="flex h-8 w-7 items-center justify-center rounded-md border bg-background text-sm shadow-sm">
                                {value}
                            </span>
                        ))}
                    </div>
                </PreviewShell>
            );
        case "label":
            return (
                <PreviewShell>
                    <label className="flex items-center gap-2 text-sm">
                        <Checkbox checked tabIndex={-1} className="pointer-events-none" />
                        通知を受け取る
                    </label>
                </PreviewShell>
            );
        case "select":
            return (
                <PreviewShell>
                    <div className="flex h-8 w-36 items-center justify-between rounded-lg border bg-background px-3 text-sm shadow-sm">
                        <span>東京</span>
                        <IconChevronDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                </PreviewShell>
            );
        case "combobox":
            return (
                <PreviewShell>
                    <div className="space-y-1.5">
                        <div className="flex h-8 w-36 items-center gap-2 rounded-lg border bg-background px-3 text-sm shadow-sm">
                            <IconSearch className="h-4 w-4 text-muted-foreground" />
                            <span>田中</span>
                        </div>
                        <div className="h-5 w-28 rounded border bg-muted/50" />
                    </div>
                </PreviewShell>
            );
        case "checkbox":
            return (
                <PreviewShell>
                    <div className="flex items-center gap-3">
                        <Checkbox checked tabIndex={-1} className="pointer-events-none" />
                        <span className="text-sm">選択済み</span>
                    </div>
                </PreviewShell>
            );
        case "radioGroup":
            return (
                <PreviewShell>
                    <RadioGroup value="a" className="gap-2">
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="a" tabIndex={-1} className="pointer-events-none" />
                            <span className="text-sm">Pro</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="b" tabIndex={-1} className="pointer-events-none" />
                            <span className="text-sm text-muted-foreground">Free</span>
                        </div>
                    </RadioGroup>
                </PreviewShell>
            );
        case "switch":
            return (
                <PreviewShell>
                    <Switch checked tabIndex={-1} className="pointer-events-none" />
                </PreviewShell>
            );
        case "toggle":
            return (
                <PreviewShell>
                    <Toggle pressed tabIndex={-1} className="pointer-events-none">
                        <IconPencil className="h-4 w-4" />
                    </Toggle>
                </PreviewShell>
            );
        case "toggleGroup":
            return (
                <PreviewShell>
                    <ToggleGroup type="single" value="bold" className="pointer-events-none">
                        <ToggleGroupItem value="bold" tabIndex={-1}>B</ToggleGroupItem>
                        <ToggleGroupItem value="italic" tabIndex={-1}>I</ToggleGroupItem>
                    </ToggleGroup>
                </PreviewShell>
            );
        case "calendar":
            return (
                <PreviewShell>
                    <MiniCalendar />
                </PreviewShell>
            );
        case "datePicker":
            return (
                <PreviewShell>
                    <div className="flex h-8 w-40 items-center justify-between rounded-lg border bg-background px-3 text-sm shadow-sm">
                        <span>2026-05-17</span>
                        <IconCalendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                </PreviewShell>
            );
        case "dateRangePicker":
            return (
                <PreviewShell>
                    <div className="flex h-8 w-44 items-center justify-between rounded-lg border bg-background px-3 text-xs shadow-sm">
                        <span>05-17 - 05-30</span>
                        <IconCalendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                </PreviewShell>
            );
        case "timePicker":
            return (
                <PreviewShell>
                    <div className="flex h-8 w-28 items-center justify-between rounded-lg border bg-background px-3 text-sm shadow-sm">
                        <span>09:30</span>
                        <IconClock className="h-4 w-4 text-muted-foreground" />
                    </div>
                </PreviewShell>
            );
        case "slider":
            return (
                <PreviewShell>
                    <Slider className="pointer-events-none w-36" value={60} tabIndex={-1} />
                </PreviewShell>
            );
        case "rangeSlider":
            return (
                <PreviewShell>
                    <RangeSlider className="pointer-events-none w-36" value={[25, 75]} tabIndex={-1} />
                </PreviewShell>
            );
        case "form":
            return (
                <PreviewShell>
                    <div className="space-y-1.5">
                        <div className="h-2 w-14 rounded bg-muted-foreground/30" />
                        <Input className="pointer-events-none h-7 w-36" value="you@example.com" readOnly tabIndex={-1} />
                    </div>
                </PreviewShell>
            );
        case "editableField":
            return (
                <PreviewShell>
                    <div className="flex w-40 items-center justify-between rounded-md border bg-background px-3 py-2 text-sm shadow-sm">
                        <span className="truncate">spring_banner.png</span>
                        <IconPencil className="h-4 w-4 text-muted-foreground" />
                    </div>
                </PreviewShell>
            );
        case "fileUploader":
            return (
                <PreviewShell>
                    <div className="flex h-14 w-36 flex-col items-center justify-center rounded-md border border-dashed bg-background text-xs text-muted-foreground">
                        <IconUpload className="mb-1 h-4 w-4" />
                        PNG / JPG
                    </div>
                </PreviewShell>
            );
        case "filterButton":
            return (
                <PreviewShell>
                    <Button size="sm" variant="outline" tabIndex={-1}>
                        <IconFilter className="h-4 w-4" />
                        条件
                        <Badge variant="secondary" className="ml-1 h-5 px-1.5">2</Badge>
                    </Button>
                </PreviewShell>
            );
        case "sortButton":
            return (
                <PreviewShell>
                    <Button size="sm" variant="outline" tabIndex={-1}>
                        <IconSortAscending className="h-4 w-4" />
                        日付
                    </Button>
                </PreviewShell>
            );
        case "tagInput":
            return (
                <PreviewShell>
                    <div className="flex w-40 flex-wrap gap-1.5 rounded-lg border bg-background p-2 shadow-sm">
                        <Badge variant="secondary">UI</Badge>
                        <Badge variant="secondary">Docs</Badge>
                    </div>
                </PreviewShell>
            );
        case "mention":
            return (
                <PreviewShell>
                    <div className="flex h-8 w-36 items-center gap-1 rounded-lg border bg-background px-3 text-sm shadow-sm">
                        <IconAt className="h-4 w-4 text-primary" />
                        <span>田中</span>
                    </div>
                </PreviewShell>
            );
        default:
            return (
                <PreviewShell>
                    <IconHash className="h-5 w-5 text-muted-foreground" />
                </PreviewShell>
            );
    }
}

export default function InputsOverviewPage() {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <div className="space-y-12 pb-10" data-doc-category-overview="true">
            <header className="space-y-4">
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                            {isJa ? "入力" : "Inputs"}
                        </h1>
                        <span className="text-2xl font-medium text-muted-foreground lg:text-3xl">
                            {isJa ? "Inputs" : "入力"}
                        </span>
                    </div>
                    <p className="max-w-3xl text-lg text-muted-foreground">
                        {isJa
                            ? "入力系コンポーネントの一覧、共通ルール、迷いやすい使い分けをまとめたカテゴリ概要です。完成例を見るページではなく、どのコンポーネントから確認するべきかを判断するための入口です。"
                            : "A category overview for input components, shared rules, and common decision points. This is an entry point for choosing the right component, not a Showcase page."}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{isJa ? "カテゴリ概要" : "Category overview"}</Badge>
                    <Badge variant="outline">{isJa ? "コンポーネント一覧" : "Component list"}</Badge>
                    <Badge variant="outline">{isJa ? "共通ルール" : "Shared rules"}</Badge>
                </div>
            </header>

            <section className="space-y-6" id="selection-guide">
                <div className="space-y-2 border-b pb-3">
                    <h2 className="text-2xl font-semibold tracking-tight">{isJa ? "コンポーネント一覧" : "Input components"}</h2>
                    <p className="text-muted-foreground">
                        {isJa
                            ? "入力系に含まれるコンポーネント、役割、代表的な用途をカテゴリごとに確認できます。サムネイルはページを重くしないため、挙動を再現しすぎない軽量プレビューにしています。"
                            : "Review the components in the Inputs category, what each contains, and where each is useful. Thumbnails are lightweight previews to keep the page fast."}
                    </p>
                </div>
                <div className="space-y-8">
                    {componentGroups.map((group) => {
                        const Icon = group.icon;

                        return (
                            <div key={group.title.en} className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-subtle text-primary-subtle-foreground">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-semibold tracking-tight">{pickText(locale, group.title)}</h3>
                                        <p className="text-sm text-muted-foreground">{pickText(locale, group.description)}</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {group.items.map((item) => (
                                        <Card key={item.name} data-input-component-row>
                                            <CardContent className="grid gap-4 p-4 sm:grid-cols-[12rem_minmax(0,1fr)_auto] sm:items-center">
                                                <ComponentPreview kind={item.preview} />
                                                <div className="min-w-0 space-y-1">
                                                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                                        <h4 className="text-base font-semibold">{item.name}</h4>
                                                        <span className="text-sm text-muted-foreground">{pickText(locale, item.purpose)}</span>
                                                    </div>
                                                    <p className="text-sm leading-6 text-muted-foreground">{pickText(locale, item.useWhen)}</p>
                                                </div>
                                                <Button asChild variant="outline" size="sm" className="justify-self-start sm:justify-self-end">
                                                    <Link href={item.href}>
                                                        {isJa ? "詳細を見る" : "View details"}
                                                        <IconArrowRight className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="space-y-10" id="supplemental-info">
                <div className="space-y-2 border-b pb-3">
                    <h2 className="text-2xl font-semibold tracking-tight">{isJa ? "補足情報" : "Supplemental information"}</h2>
                    <p className="text-muted-foreground">
                        {isJa
                            ? "一覧でコンポーネントを選んだあとに確認する、入力全体のルールと判断基準です。"
                            : "Shared rules and decision points to review after choosing the relevant component."}
                    </p>
                </div>

                <section className="space-y-6" id="common-rules">
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold tracking-tight">{isJa ? "入力の共通ルール" : "Shared input rules"}</h3>
                        <p className="text-muted-foreground">
                            {isJa
                                ? "個別コンポーネントの見た目より先に、入力体験として揃えるべきルールです。"
                                : "Rules that should be consistent across the input experience before individual component styling."}
                        </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        {commonRules.map((rule) => (
                            <Card key={rule.title.en}>
                                <CardHeader>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-primary-subtle-foreground">
                                            <IconCheck className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <CardTitle className="text-base">{pickText(locale, rule.title)}</CardTitle>
                                            <CardDescription>{pickText(locale, rule.description)}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="space-y-6" id="decision-points">
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold tracking-tight">{isJa ? "迷いやすい使い分け" : "Common decision points"}</h3>
                        <p className="text-muted-foreground">
                            {isJa
                                ? "似た入力を見た目だけで選ばないための判断基準です。"
                                : "Decision rules for choosing between visually similar controls."}
                        </p>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-2">
                        {decisionPairs.map((pair) => (
                            <Card key={pair.title.en}>
                                <CardHeader>
                                    <CardTitle className="text-lg">{pickText(locale, pair.title)}</CardTitle>
                                    <CardDescription>{pickText(locale, pair.body)}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-wrap items-center gap-2">
                                    <Badge variant="secondary">{pair.primary}</Badge>
                                    <span className="text-sm text-muted-foreground">/</span>
                                    <Badge variant="outline">{pair.secondary}</Badge>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="space-y-6" id="future-components">
                    <Card>
                        <CardHeader>
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-warning-subtle text-warning-subtle-foreground">
                                    <IconAlertTriangle className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <CardTitle>{isJa ? "今後追加する候補" : "Future component candidates"}</CardTitle>
                                    <CardDescription>
                                        {isJa
                                            ? "今回の Inputs 整備で必要性が見えたものです。個別対応ではなく、GunjoUI コンポーネントとして設計します。"
                                            : "Needs found during the Inputs sweep. These should be designed as GunjoUI components, not one-off page fixes."}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {futureItems.map((item) => (
                                    <Badge key={item} variant="outline">
                                        {item}
                                    </Badge>
                                ))}
                            </div>
                            <Separator />
                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                <IconListCheck className="mt-0.5 h-4 w-4 shrink-0" />
                                <p>
                                    {isJa
                                        ? "候補の追加は、SSOT、docs、デモ、アクセシビリティ、無効化理由、入力幅ルールまで含めて扱います。"
                                        : "Future additions should include SSOT, docs, demos, accessibility, disabled-reason behavior, and field-width rules."}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </section>
        </div>
    );
}
