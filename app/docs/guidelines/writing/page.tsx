"use client";

import { useEffect, useState } from "react";

import {
    IconAlertTriangle,
    IconCircleCheck,
    IconCircleDashed,
    IconClipboardCheck,
    IconLanguage,
    IconMessages,
    IconPhoto,
    IconPointerQuestion,
    IconTrash,
    IconX,
} from "@tabler/icons-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    DocNote,
    Kbd,
    Separator,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TextLink,
} from "@gunjo/ui";

import { useLocale } from "@/components/providers/LocaleProvider";

const navItems = [
    { id: "principles", ja: "基本原則", en: "Principles" },
    { id: "decision", ja: "判断の流れ", en: "Decision flow" },
    { id: "patterns", ja: "場面別パターン", en: "Patterns by context" },
    { id: "alt-text", ja: "画像と代替テキスト", en: "Images and alt text" },
    { id: "examples", ja: "良い例 / 悪い例", en: "Do / Don't" },
    { id: "catalog", ja: "メッセージ一覧", en: "Message catalog" },
    { id: "review", ja: "確認手順", en: "Review process" },
];

const principles = [
    {
        icon: IconCircleCheck,
        label: { ja: "結果", en: "Result" },
        title: { ja: "操作結果が先にわかる", en: "Make the result clear first" },
        description: {
            ja: "押した後に何が起こるかを、ボタンやツールチップで先に伝えます。",
            en: "Buttons and tooltips should state what happens after the action.",
        },
    },
    {
        icon: IconPointerQuestion,
        label: { ja: "次の行動", en: "Next action" },
        title: { ja: "迷った時の行動を書く", en: "Give a next action" },
        description: {
            ja: "空状態、エラー、無効化では、状態の説明だけで終わらせません。",
            en: "Empty, error, and disabled states should not stop at describing the state.",
        },
    },
    {
        icon: IconLanguage,
        label: { ja: "日英", en: "Locale" },
        title: { ja: "日本語と英語の粒度を揃える", en: "Align both languages" },
        description: {
            ja: "直訳ではなく、同じ操作意図と同じ情報量で読める文言にします。",
            en: "Copy should preserve intent and information density across locales.",
        },
    },
];

const decisionSteps = [
    {
        title: { ja: "誰が読むか", en: "Who reads this?" },
        description: {
            ja: "エンドユーザー向けか、実装者向けかを先に分けます。ユーザー向け文言に実装語を混ぜません。",
            en: "Separate user-facing copy from implementation guidance before writing.",
        },
    },
    {
        title: { ja: "何を判断する文言か", en: "What decision does it support?" },
        description: {
            ja: "操作、状態、エラー、確認、案内のどれかを決めます。目的が曖昧な文は削ります。",
            en: "Identify whether it supports an action, state, error, confirmation, or guidance.",
        },
    },
    {
        title: { ja: "次に何ができるか", en: "What can the user do next?" },
        description: {
            ja: "無効化、空状態、エラーでは、理由と次の行動をセットで書きます。",
            en: "Disabled, empty, and error states need both a reason and a next action.",
        },
    },
    {
        title: { ja: "日本語と英語で崩れないか", en: "Does it survive both locales?" },
        description: {
            ja: "短い日本語、長い英語、折り返し、ツールチップの見切れまで確認します。",
            en: "Check short Japanese, long English, wrapping, and tooltip clipping.",
        },
    },
];

const patterns = [
    {
        value: "actions",
        label: { ja: "操作", en: "Actions" },
        title: { ja: "操作文言は、実行後の状態がわかるようにする", en: "Action copy should describe the resulting state" },
        description: {
            ja: "短いラベルで足りない場合は、ツールチップや補助説明で補います。",
            en: "When a short label is not enough, use a tooltip or supporting description.",
        },
        examples: [
            { ja: "保存", en: "Save", noteJa: "成功時は「保存しました」。", noteEn: "Success feedback: “Saved”." },
            { ja: "コードをコピー", en: "Copy code", noteJa: "成功時は「コピーしました」。", noteEn: "Success feedback: “Copied”." },
            { ja: "完全に削除", en: "Delete permanently", noteJa: "取り消せない時だけ使う。", noteEn: "Use only for irreversible deletion." },
        ],
    },
    {
        value: "states",
        label: { ja: "状態", en: "States" },
        title: { ja: "状態文言は、理由と次の行動まで含める", en: "State copy should include the reason and next action" },
        description: {
            ja: "空状態、無効化、エラーは見た目だけでは伝わりません。必ず文言で補足します。",
            en: "Empty, disabled, and error states need copy because visual styling is not enough.",
        },
        examples: [
            { ja: "まだファイルがありません", en: "No files yet", noteJa: "次の操作を説明に入れる。", noteEn: "Add the next action in the description." },
            { ja: "権限がないため変更できません", en: "You do not have permission to change this", noteJa: "有効化条件を書く。", noteEn: "Explain how to enable it." },
            { ja: "保存できませんでした", en: "Could not save", noteJa: "回復方法を書く。", noteEn: "Add a recovery path." },
        ],
    },
    {
        value: "docs",
        label: { ja: "ドキュメント", en: "Docs" },
        title: { ja: "実装上の名前ではなく、使う場面で説明する", en: "Docs should translate implementation terms into usage decisions" },
        description: {
            ja: "コンポーネントの内部名やプロパティ名は、コード例では必要です。ただし本文では「どんな場面で使うか」が先に伝わる言葉にします。",
            en: "Do not expose terms like variant or destructive without explaining the usage intent.",
        },
        examples: [
            { ja: "削除など、取り消せない操作に使います", en: "Use it for irreversible actions such as delete", noteJa: "見た目の名前ではなく、使う場面として説明した例。", noteEn: "Explains destructive intent without exposing only the variant name." },
            { ja: "入力エラー時は、入力欄にエラー状態を付けます", en: "Mark the input as invalid when there is an error", noteJa: "属性名などの実装詳細は、コード例の中で説明する。", noteEn: "Explain `aria-invalid` in Usage code rather than user-facing guidance." },
            { ja: "選択中の項目を解除します", en: "Deselect the current item", noteJa: "選択状態のボタンやアイコンに使うツールチップ。", noteEn: "Tooltip copy for buttons or icons in a selected state." },
        ],
    },
];

const doDontExamples = [
    {
        context: { ja: "エラー", en: "Error" },
        dontJa: "エラーが発生しました。",
        doJa: "保存できませんでした。時間をおいてもう一度お試しください。",
        dontEn: "An error occurred.",
        doEn: "Could not save. Try again in a moment.",
        reason: {
            ja: "何が失敗したかと回復方法が必要。",
            en: "The copy needs the failed action and a recovery path.",
        },
    },
    {
        context: { ja: "無効化", en: "Disabled" },
        dontJa: "利用できません。",
        doJa: "権限がないため変更できません。管理者に依頼してください。",
        dontEn: "Unavailable.",
        doEn: "You do not have permission to change this. Ask an admin.",
        reason: {
            ja: "理由と次の行動がないと判断できない。",
            en: "Users need the reason and the next action.",
        },
    },
    {
        context: { ja: "実装語", en: "Implementation term" },
        dontJa: "destructive variant で表示します。",
        doJa: "削除など取り消せない操作に使います。",
        dontEn: "Shown as a destructive variant.",
        doEn: "Use it for irreversible actions such as delete.",
        reason: {
            ja: "利用者が判断できる言葉に置き換える。",
            en: "Translate implementation terms into user intent.",
        },
    },
    {
        context: { ja: "空状態", en: "Empty state" },
        dontJa: "データなし",
        doJa: "まだキャンペーンがありません。作成すると、ここに表示されます。",
        dontEn: "No data",
        doEn: "No campaigns yet. Create one to show it here.",
        reason: {
            ja: "対象と次の操作を明示する。",
            en: "Name the object and the next action.",
        },
    },
];

type LocalizedCopy = {
    ja: string;
    en: string;
};

type MessageCatalogItem = {
    purpose: LocalizedCopy;
    ja: string;
    en: string;
    messageJa?: string;
    messageEn?: string;
    note: LocalizedCopy;
};

type MessageCatalogCategory = {
    value: string;
    title: LocalizedCopy;
    description: LocalizedCopy;
    items: MessageCatalogItem[];
};

const messageCatalogCategories: MessageCatalogCategory[] = [
    {
        value: "actions",
        title: { ja: "操作ラベル", en: "Action labels" },
        description: {
            ja: "ボタン、メニュー、ツールバーで使う短い操作文言です。成功時のフィードバックとセットで管理します。",
            en: "Short labels for buttons, menus, and toolbars. Manage them together with success feedback.",
        },
        items: [
            { purpose: { ja: "保存", en: "Save" }, ja: "保存", en: "Save", messageJa: "キャンペーン設定を保存しました", messageEn: "Campaign settings saved", note: { ja: "対象が画面上で明確な時は短くする。", en: "Keep it short when the object is clear on screen." } },
            { purpose: { ja: "キャンセル", en: "Cancel" }, ja: "キャンセル", en: "Cancel", messageJa: "変更は保存されません", messageEn: "Changes will not be saved", note: { ja: "閉じる前の確認や補助文に使う。", en: "Use in confirmation or helper copy before closing." } },
            { purpose: { ja: "コピー", en: "Copy" }, ja: "コピー", en: "Copy", messageJa: "共有URLをコピーしました", messageEn: "Share URL copied", note: { ja: "コピー対象が曖昧なら対象名を書く。", en: "Name the copied object when needed." } },
            { purpose: { ja: "追加", en: "Add" }, ja: "追加", en: "Add", messageJa: "新しいフィルターを追加しました", messageEn: "New filter added", note: { ja: "追加後に何が増えたかを伝える。", en: "Say what was added." } },
            { purpose: { ja: "編集", en: "Edit" }, ja: "編集", en: "Edit", messageJa: "変更を保存しました", messageEn: "Changes saved", note: { ja: "編集開始ではなく保存結果を伝える。", en: "Feedback should describe the saved result." } },
            { purpose: { ja: "削除", en: "Delete" }, ja: "削除", en: "Delete", messageJa: "選択したファイルを削除しました", messageEn: "Selected files deleted", note: { ja: "確認ダイアログと組み合わせる。", en: "Pair with a confirmation dialog." } },
            { purpose: { ja: "完全削除", en: "Delete permanently" }, ja: "完全に削除", en: "Delete permanently", messageJa: "ファイルを完全に削除しました", messageEn: "File permanently deleted", note: { ja: "取り消せない時だけ使う。", en: "Use only for irreversible deletion." } },
            { purpose: { ja: "選択", en: "Select" }, ja: "選択します / 選択を外します", en: "Select / Deselect", messageJa: "3件を選択中", messageEn: "3 selected", note: { ja: "状態に応じてラベルとツールチップを切り替える。", en: "Switch labels and tooltips based on state." } },
        ],
    },
    {
        value: "feedback",
        title: { ja: "完了フィードバック", en: "Success feedback" },
        description: {
            ja: "操作後に一時表示するトーストやステータスバーの文言です。短く、結果だけを伝えます。",
            en: "Toast and status copy shown after an action. Keep it short and result-focused.",
        },
        items: [
            { purpose: { ja: "保存完了", en: "Saved" }, ja: "保存しました", en: "Saved", messageJa: "キャンペーン設定を保存しました", messageEn: "Campaign settings saved", note: { ja: "対象が曖昧なら対象名を含める。", en: "Include the object when context is unclear." } },
            { purpose: { ja: "コピー完了", en: "Copied" }, ja: "コピーしました", en: "Copied", messageJa: "共有URLをコピーしました", messageEn: "Share URL copied", note: { ja: "URL、コード、色など対象を具体化する。", en: "Name URL, code, color, or other target." } },
            { purpose: { ja: "更新完了", en: "Updated" }, ja: "更新しました", en: "Updated", messageJa: "一覧を最新の状態に更新しました", messageEn: "The list was updated", note: { ja: "一覧や設定の更新後に使う。", en: "Use after list or settings updates." } },
            { purpose: { ja: "作成完了", en: "Created" }, ja: "作成しました", en: "Created", messageJa: "新しいプロジェクトを作成しました", messageEn: "New project created", note: { ja: "作成対象が直前に見える場合。", en: "Use when the created object is visible." } },
            { purpose: { ja: "削除完了", en: "Deleted" }, ja: "削除しました", en: "Deleted", messageJa: "選択したファイルを削除しました", messageEn: "Selected files deleted", note: { ja: "取り消しがある場合はアクションを添える。", en: "Add undo when available." } },
            { purpose: { ja: "送信完了", en: "Sent" }, ja: "送信しました", en: "Sent", messageJa: "招待メールを送信しました", messageEn: "Invitation email sent", note: { ja: "メールや招待送信に使う。", en: "Use for email or invitation sends." } },
        ],
    },
    {
        value: "errors",
        title: { ja: "エラー", en: "Errors" },
        description: {
            ja: "失敗した操作、理由、回復方法の順番で書きます。原因不明なら原因を書き切らないようにします。",
            en: "Write the failed action, reason, then recovery path. Do not overstate unknown causes.",
        },
        items: [
            { purpose: { ja: "保存失敗", en: "Save failed" }, ja: "保存できませんでした", en: "Could not save", messageJa: "キャンペーン設定を保存できませんでした。通信が不安定です。時間をおいてもう一度お試しください。", messageEn: "Could not save campaign settings. The connection is unstable. Try again in a moment.", note: { ja: "再試行や入力修正を添える。", en: "Add retry or input guidance." } },
            { purpose: { ja: "読み込み失敗", en: "Load failed" }, ja: "読み込めませんでした", en: "Could not load", messageJa: "ファイル一覧を読み込めませんでした。再読み込みしてください。", messageEn: "Could not load the file list. Refresh and try again.", note: { ja: "対象がある時は対象を書く。", en: "Name the object when known." } },
            { purpose: { ja: "アップロード失敗", en: "Upload failed" }, ja: "アップロードできませんでした", en: "Could not upload", messageJa: "ファイルをアップロードできませんでした。容量と形式を確認してください。", messageEn: "Could not upload the file. Check the size and file type.", note: { ja: "容量、形式、通信などの理由を添える。", en: "Add size, type, or connection reason." } },
            { purpose: { ja: "入力形式", en: "Invalid format" }, ja: "入力形式を確認してください", en: "Check the input format", messageJa: "メールアドレスの形式を確認してください。", messageEn: "Check the email address format.", note: { ja: "入力した人を責めない。", en: "Do not blame the person entering data." } },
            { purpose: { ja: "権限不足", en: "Permission missing" }, ja: "権限がないため変更できません", en: "You do not have permission to change this", messageJa: "権限がないため変更できません。管理者に編集権限を依頼してください。", messageEn: "You do not have permission to change this. Ask an admin for edit access.", note: { ja: "依頼先や必要権限を書く。", en: "Name who can grant access." } },
            { purpose: { ja: "通信不安定", en: "Connection unstable" }, ja: "通信が不安定です", en: "Connection unstable", messageJa: "通信が不安定です。時間をおいてもう一度お試しください。", messageEn: "The connection is unstable. Try again in a moment.", note: { ja: "回復可能な失敗に使う。", en: "Use for recoverable failures." } },
        ],
    },
    {
        value: "empty",
        title: { ja: "空状態", en: "Empty states" },
        description: {
            ja: "何がないのか、なぜ空なのか、次に何ができるのかを短くまとめます。",
            en: "State what is missing, why it is empty, and what can happen next.",
        },
        items: [
            { purpose: { ja: "ファイルなし", en: "No files" }, ja: "まだファイルがありません", en: "No files yet", messageJa: "アップロードすると、ここに表示されます。", messageEn: "Upload files to show them here.", note: { ja: "アップロード導線を近くに置く。", en: "Place upload action nearby." } },
            { purpose: { ja: "検索結果なし", en: "No search results" }, ja: "一致する結果がありません", en: "No matching results", messageJa: "キーワードやフィルターを変更してください。", messageEn: "Change the keyword or filters.", note: { ja: "検索条件の変更を促す。", en: "Suggest changing filters or terms." } },
            { purpose: { ja: "通知なし", en: "No notifications" }, ja: "新しい通知はありません", en: "No new notifications", messageJa: "確認が必要な通知はありません。", messageEn: "No notifications need your attention.", note: { ja: "操作不要の空状態。", en: "An empty state with no required action." } },
            { purpose: { ja: "メンバーなし", en: "No members" }, ja: "まだメンバーがいません", en: "No members yet", messageJa: "招待すると、この一覧に表示されます。", messageEn: "Invite members to show them here.", note: { ja: "招待導線とセットにする。", en: "Pair with invitation action." } },
            { purpose: { ja: "下書きなし", en: "No drafts" }, ja: "下書きはありません", en: "No drafts", messageJa: "新しく作成すると下書きとして保存されます。", messageEn: "New work can be saved as a draft.", note: { ja: "作成済みでないことを伝える。", en: "Indicates nothing has been created." } },
            { purpose: { ja: "履歴なし", en: "No history" }, ja: "履歴はまだありません", en: "No history yet", messageJa: "操作すると履歴がここに表示されます。", messageEn: "Actions will appear here as history.", note: { ja: "履歴が発生する条件を書く。", en: "Explain when history appears." } },
        ],
    },
    {
        value: "disabled",
        title: { ja: "無効化", en: "Disabled controls" },
        description: {
            ja: "無効な理由と、有効にする条件をツールチップや補助テキストで伝えます。",
            en: "Explain why the control is disabled and what enables it.",
        },
        items: [
            { purpose: { ja: "権限不足", en: "Missing permission" }, ja: "権限がないため変更できません", en: "You do not have permission to change this", messageJa: "管理者に編集権限を依頼してください。", messageEn: "Ask an admin for edit permission.", note: { ja: "管理者への依頼を案内する。", en: "Point to an admin or owner." } },
            { purpose: { ja: "未選択", en: "No selection" }, ja: "対象を選択すると操作できます", en: "Select an item to use this action", messageJa: "項目を選択すると一括操作できます。", messageEn: "Select items to use bulk actions.", note: { ja: "一覧操作の無効化に使う。", en: "Use for list actions." } },
            { purpose: { ja: "処理中", en: "Processing" }, ja: "処理中は変更できません", en: "You cannot change this while it is processing", messageJa: "処理が完了するまでお待ちください。", messageEn: "Wait until processing is complete.", note: { ja: "一時的な無効化。", en: "Temporary disabled state." } },
            { purpose: { ja: "上限到達", en: "Limit reached" }, ja: "上限に達したため追加できません", en: "You reached the limit and cannot add more", messageJa: "不要な項目を削除してから追加してください。", messageEn: "Remove an item before adding another.", note: { ja: "上限数も近くに表示する。", en: "Show the limit nearby." } },
            { purpose: { ja: "必須未入力", en: "Required fields missing" }, ja: "必須項目を入力すると送信できます", en: "Complete required fields to submit", messageJa: "必須項目を入力すると送信できます。", messageEn: "Complete required fields to submit.", note: { ja: "フォーム送信前に使う。", en: "Use before form submission." } },
            { purpose: { ja: "接続なし", en: "Offline" }, ja: "オンラインになると実行できます", en: "You can run this when you are back online", messageJa: "オンラインになると実行できます。", messageEn: "You can run this when you are back online.", note: { ja: "通信状態に依存する操作。", en: "Use for connection-dependent actions." } },
        ],
    },
    {
        value: "validation",
        title: { ja: "入力と検証", en: "Input and validation" },
        description: {
            ja: "入力欄、フォーム、検索、フィルターで使う検証文言です。項目名、条件、修正方法を分けて書きます。",
            en: "Validation copy for fields, forms, search, and filters. Separate the field, condition, and correction path.",
        },
        items: [
            { purpose: { ja: "必須未入力", en: "Required field" }, ja: "入力してください", en: "Required", messageJa: "メールアドレスを入力してください。", messageEn: "Enter an email address.", note: { ja: "項目名を入れて、何を入力するかを明確にする。", en: "Name the field so the required input is clear." } },
            { purpose: { ja: "形式エラー", en: "Invalid format" }, ja: "形式を確認してください", en: "Check the format", messageJa: "電話番号はハイフンなしで入力してください。", messageEn: "Enter the phone number without hyphens.", note: { ja: "正しい形式を文中に含める。", en: "Include the expected format." } },
            { purpose: { ja: "文字数不足", en: "Too short" }, ja: "文字数が足りません", en: "Too short", messageJa: "パスワードは12文字以上で入力してください。", messageEn: "Enter at least 12 characters for the password.", note: { ja: "必要な文字数を数値で示す。", en: "Show the required length as a number." } },
            { purpose: { ja: "範囲外", en: "Out of range" }, ja: "範囲外です", en: "Out of range", messageJa: "1から100の範囲で入力してください。", messageEn: "Enter a value between 1 and 100.", note: { ja: "下限と上限を省略しない。", en: "Do not omit the minimum and maximum." } },
            { purpose: { ja: "重複", en: "Duplicate" }, ja: "すでに使われています", en: "Already in use", messageJa: "このタグ名はすでに使われています。", messageEn: "This tag name is already in use.", note: { ja: "別名に変えるなど次の行動を近くに置く。", en: "Place the next action, such as renaming, nearby." } },
            { purpose: { ja: "一致しない", en: "Mismatch" }, ja: "一致しません", en: "Does not match", messageJa: "確認用パスワードが一致しません。", messageEn: "The confirmation password does not match.", note: { ja: "どの項目同士が一致しないかを書く。", en: "Name which fields do not match." } },
        ],
    },
    {
        value: "files",
        title: { ja: "ファイル操作", en: "File operations" },
        description: {
            ja: "アップロード、ダウンロード、共有、画像プレビューなど、素材を扱う UI の文言です。",
            en: "Copy for uploading, downloading, sharing, and previewing files or assets.",
        },
        items: [
            { purpose: { ja: "アップロード中", en: "Uploading" }, ja: "アップロード中", en: "Uploading", messageJa: "ファイルをアップロードしています。", messageEn: "Uploading files.", note: { ja: "進行中は対象と処理中であることを伝える。", en: "Name the object and that work is in progress." } },
            { purpose: { ja: "アップロード完了", en: "Upload complete" }, ja: "アップロードしました", en: "Uploaded", messageJa: "3件のファイルをアップロードしました。", messageEn: "Uploaded 3 files.", note: { ja: "複数件では件数を入れる。", en: "Include the count for multiple files." } },
            { purpose: { ja: "容量超過", en: "File too large" }, ja: "容量が大きすぎます", en: "File is too large", messageJa: "10MB以下のファイルを選択してください。", messageEn: "Select a file under 10 MB.", note: { ja: "許可される上限を明記する。", en: "State the allowed maximum." } },
            { purpose: { ja: "形式未対応", en: "Unsupported type" }, ja: "対応していない形式です", en: "Unsupported file type", messageJa: "PNG、JPG、PDF のいずれかを選択してください。", messageEn: "Select a PNG, JPG, or PDF file.", note: { ja: "受け付ける形式を書く。", en: "List accepted types." } },
            { purpose: { ja: "ダウンロード開始", en: "Download started" }, ja: "ダウンロードを開始しました", en: "Download started", messageJa: "選択したファイルのダウンロードを開始しました。", messageEn: "Started downloading the selected files.", note: { ja: "完了ではなく開始であることを区別する。", en: "Distinguish started from completed." } },
            { purpose: { ja: "共有リンク作成", en: "Share link created" }, ja: "共有リンクを作成しました", en: "Share link created", messageJa: "リンクを知っている人が閲覧できます。", messageEn: "Anyone with the link can view it.", note: { ja: "共有範囲を必ず書く。", en: "Always state who can access it." } },
        ],
    },
    {
        value: "tables",
        title: { ja: "一覧とテーブル", en: "Lists and tables" },
        description: {
            ja: "一覧、テーブル、フィルター、並び替え、ページ送りで使う文言です。現在の状態と次の操作を分けます。",
            en: "Copy for lists, tables, filters, sorting, and pagination. Separate current state from next action.",
        },
        items: [
            { purpose: { ja: "フィルターなし", en: "No filters" }, ja: "フィルターなし", en: "No filters", messageJa: "すべての項目を表示しています。", messageEn: "Showing all items.", note: { ja: "現在の表示状態を伝える。", en: "State the current list state." } },
            { purpose: { ja: "絞り込み結果なし", en: "No filtered results" }, ja: "条件に一致する項目がありません", en: "No items match the filters", messageJa: "フィルターを変更してください。", messageEn: "Change the filters.", note: { ja: "空状態として扱い、解除導線を置く。", en: "Treat as an empty state and provide a reset path." } },
            { purpose: { ja: "昇順に並び替え", en: "Sort ascending" }, ja: "昇順に並び替え", en: "Sort ascending", messageJa: "名前を昇順に並び替えました。", messageEn: "Sorted by name in ascending order.", note: { ja: "現在の並びと次の並びをツールチップで分ける。", en: "Separate current and next sort direction in tooltips." } },
            { purpose: { ja: "降順に並び替え", en: "Sort descending" }, ja: "降順に並び替え", en: "Sort descending", messageJa: "更新日を降順に並び替えました。", messageEn: "Sorted by updated date in descending order.", note: { ja: "列名と方向を入れる。", en: "Include column name and direction." } },
            { purpose: { ja: "ページ移動", en: "Page changed" }, ja: "ページを移動しました", en: "Page changed", messageJa: "3ページ目を表示しています。", messageEn: "Showing page 3.", note: { ja: "ページ数と表示件数を近くに置く。", en: "Keep page and row counts nearby." } },
            { purpose: { ja: "一括選択", en: "Bulk selection" }, ja: "一括選択", en: "Select all", messageJa: "表示中の25件を選択しました。", messageEn: "Selected 25 visible items.", note: { ja: "全件か表示中かを必ず区別する。", en: "Distinguish all items from visible items." } },
        ],
    },
    {
        value: "auth",
        title: { ja: "認証と権限", en: "Auth and access" },
        description: {
            ja: "ログイン、セッション、招待、権限変更など、利用者のアクセス状態に関わる文言です。",
            en: "Copy for sign-in, sessions, invitations, and permission changes.",
        },
        items: [
            { purpose: { ja: "サインイン失敗", en: "Sign-in failed" }, ja: "サインインできませんでした", en: "Could not sign in", messageJa: "メールアドレスまたはパスワードを確認してください。", messageEn: "Check the email address or password.", note: { ja: "どちらが違うかを断定しない。", en: "Do not reveal which value is wrong." } },
            { purpose: { ja: "セッション切れ", en: "Session expired" }, ja: "セッションの有効期限が切れました", en: "Session expired", messageJa: "もう一度サインインしてください。", messageEn: "Sign in again to continue.", note: { ja: "続行方法を短く書く。", en: "Give a short continuation path." } },
            { purpose: { ja: "権限申請", en: "Permission requested" }, ja: "権限を申請しました", en: "Permission requested", messageJa: "管理者の承認を待っています。", messageEn: "Waiting for admin approval.", note: { ja: "次に誰が対応するかを書く。", en: "Name who needs to act next." } },
            { purpose: { ja: "ログアウト確認", en: "Sign-out confirmation" }, ja: "ログアウトしますか？", en: "Sign out?", messageJa: "保存していない変更がある場合は失われます。", messageEn: "Unsaved changes will be lost.", note: { ja: "未保存の影響がある時だけ補足する。", en: "Mention unsaved impact only when relevant." } },
            { purpose: { ja: "招待期限切れ", en: "Invitation expired" }, ja: "招待リンクの期限が切れています", en: "Invitation link expired", messageJa: "新しい招待を依頼してください。", messageEn: "Ask for a new invitation.", note: { ja: "誰に依頼するかが分かる導線を置く。", en: "Provide a path to request a new link." } },
            { purpose: { ja: "再設定メール送信", en: "Reset email sent" }, ja: "再設定メールを送信しました", en: "Reset email sent", messageJa: "メール内のリンクからパスワードを再設定してください。", messageEn: "Use the link in the email to reset your password.", note: { ja: "次の確認場所を伝える。", en: "Tell the user where to continue." } },
        ],
    },
    {
        value: "sharing",
        title: { ja: "共有と公開範囲", en: "Sharing and visibility" },
        description: {
            ja: "共有リンク、公開範囲、外部送信、権限変更など、情報が誰に届くかを扱う文言です。",
            en: "Copy for share links, visibility, external sends, and permission changes. Always state who can access the information.",
        },
        items: [
            { purpose: { ja: "公開リンク ON", en: "Public link on" }, ja: "公開リンクを有効にしました", en: "Public link enabled", messageJa: "リンクを知っている人が閲覧できます。", messageEn: "Anyone with the link can view it.", note: { ja: "リンクの有効範囲を必ず書く。", en: "Always state the link scope." } },
            { purpose: { ja: "公開リンク OFF", en: "Public link off" }, ja: "公開リンクを無効にしました", en: "Public link disabled", messageJa: "このリンクからは閲覧できなくなりました。", messageEn: "This link can no longer be used to view it.", note: { ja: "既存リンクへの影響を書く。", en: "Explain the impact on existing links." } },
            { purpose: { ja: "リンクコピー", en: "Copy share link" }, ja: "共有リンクをコピー", en: "Copy share link", messageJa: "共有リンクをコピーしました。", messageEn: "Share link copied.", note: { ja: "コピーだけでは共有が有効か分からない場合は補足する。", en: "Add visibility context when copying does not imply access." } },
            { purpose: { ja: "外部共有", en: "External sharing" }, ja: "外部に共有しますか？", en: "Share externally?", messageJa: "組織外のユーザーが閲覧できるようになります。", messageEn: "People outside your organization will be able to view it.", note: { ja: "外部に出る影響を確認する。", en: "Confirm the external exposure." } },
            { purpose: { ja: "閲覧権限", en: "View access" }, ja: "閲覧のみ許可", en: "Allow view only", messageJa: "閲覧はできますが、編集はできません。", messageEn: "They can view, but not edit.", note: { ja: "できることとできないことを対で書く。", en: "Pair what is allowed with what is not." } },
            { purpose: { ja: "編集権限", en: "Edit access" }, ja: "編集を許可", en: "Allow editing", messageJa: "内容の変更と共有設定の更新ができます。", messageEn: "They can change content and update sharing settings.", note: { ja: "権限の影響範囲を書く。", en: "State what the permission allows." } },
        ],
    },
    {
        value: "progress",
        title: { ja: "進行中と非同期処理", en: "Progress and async work" },
        description: {
            ja: "アップロード、生成、同期、処理待ちなど、完了まで時間がかかる操作の文言です。",
            en: "Copy for uploads, generation, sync, queued work, and other actions that take time to complete.",
        },
        items: [
            { purpose: { ja: "開始直後", en: "Starting" }, ja: "処理を開始しました", en: "Started processing", messageJa: "準備ができ次第、進行状況を表示します。", messageEn: "Progress will appear as soon as it is ready.", note: { ja: "すぐに数値が出ない時に使う。", en: "Use when a numeric value is not available yet." } },
            { purpose: { ja: "進行中", en: "In progress" }, ja: "処理中です", en: "Processing", messageJa: "残り 4 ファイルを処理しています。", messageEn: "Processing 4 files remaining.", note: { ja: "可能なら残数や対象を入れる。", en: "Include remaining count or object when possible." } },
            { purpose: { ja: "待機中", en: "Queued" }, ja: "順番を待っています", en: "Queued", messageJa: "前の処理が完了すると自動で開始します。", messageEn: "This starts automatically after the previous task finishes.", note: { ja: "ユーザー操作が必要ないことを明示する。", en: "State when no user action is required." } },
            { purpose: { ja: "一時停止", en: "Paused" }, ja: "一時停止中", en: "Paused", messageJa: "再開すると、停止した位置から続行します。", messageEn: "Resume to continue from where it stopped.", note: { ja: "再開後の挙動を書く。", en: "Explain what happens after resuming." } },
            { purpose: { ja: "完了", en: "Complete" }, ja: "完了しました", en: "Complete", messageJa: "すべてのファイルを処理しました。", messageEn: "All files were processed.", note: { ja: "結果と件数を短く伝える。", en: "Summarize result and count." } },
            { purpose: { ja: "失敗後の再試行", en: "Retry after failure" }, ja: "もう一度試す", en: "Try again", messageJa: "3件の処理に失敗しました。もう一度試してください。", messageEn: "3 items failed. Try again.", note: { ja: "失敗件数と再試行導線を近くに置く。", en: "Keep failure count and retry action together." } },
        ],
    },
    {
        value: "tooltips",
        title: { ja: "ツールチップと補足", en: "Tooltips and helper copy" },
        description: {
            ja: "アイコンだけの操作、切り替え、無効化理由、別タブ遷移など、見た目だけでは分からない操作の補足文言です。",
            en: "Supplemental copy for icon-only actions, toggles, disabled reasons, new-tab links, and controls whose outcome is not visible.",
        },
        items: [
            { purpose: { ja: "アイコン操作", en: "Icon action" }, ja: "コードをコピー", en: "Copy code", messageJa: "クリックすると表示中のコードをコピーします。", messageEn: "Copies the currently visible code.", note: { ja: "aria-label と意味を揃える。", en: "Match the aria-label meaning." } },
            { purpose: { ja: "状態切替", en: "Toggle state" }, ja: "公開リンクを有効にする", en: "Enable public link", messageJa: "ON にするとリンクを知っている人が閲覧できます。", messageEn: "When on, anyone with the link can view it.", note: { ja: "ON/OFF の結果を入れる。", en: "State the result of on/off." } },
            { purpose: { ja: "別タブ", en: "New tab" }, ja: "新しいタブで開きます", en: "Opens in a new tab", messageJa: "外部サイトを新しいタブで開きます。", messageEn: "Opens the external site in a new tab.", note: { ja: "外部リンクアイコンと併用する。", en: "Pair with the external-link icon." } },
            { purpose: { ja: "無効化理由", en: "Disabled reason" }, ja: "対象を選択すると使えます", en: "Select an item to use this", messageJa: "1件以上選択すると削除できます。", messageEn: "Select at least one item to delete.", note: { ja: "有効化条件を具体的に書く。", en: "State the enablement condition specifically." } },
            { purpose: { ja: "危険操作", en: "Danger action" }, ja: "完全に削除", en: "Delete permanently", messageJa: "確認後、元に戻せません。", messageEn: "After confirmation, this cannot be undone.", note: { ja: "実行前の確認がある場合でも補足する。", en: "Keep the tooltip even when confirmation follows." } },
            { purpose: { ja: "現在値", en: "Current value" }, ja: "現在の表示幅: スマートフォン", en: "Current viewport: mobile", messageJa: "クリックすると表示幅を切り替えます。", messageEn: "Click to change the viewport.", note: { ja: "現在状態と次の操作を分ける。", en: "Separate current state from next action." } },
        ],
    },
    {
        value: "confirmation",
        title: { ja: "確認", en: "Confirmations" },
        description: {
            ja: "対象、影響、取り消せるかを確認します。破壊的操作は赤い実行ボタンと組み合わせます。",
            en: "Confirm the target, impact, and reversibility. Pair destructive actions with a red action button.",
        },
        items: [
            { purpose: { ja: "削除確認", en: "Delete confirmation" }, ja: "このファイルを削除しますか？", en: "Delete this file?", messageJa: "brief_document.pdf を削除します。この操作は取り消せません。", messageEn: "Delete brief_document.pdf. This action cannot be undone.", note: { ja: "対象名を本文かタイトルに含める。", en: "Include the object name in title or body." } },
            { purpose: { ja: "完全削除確認", en: "Permanent delete" }, ja: "この操作は取り消せません", en: "This action cannot be undone", messageJa: "ゴミ箱からも削除されます。元に戻せません。", messageEn: "This removes it from trash too. It cannot be restored.", note: { ja: "不可逆性を明記する。", en: "State irreversibility clearly." } },
            { purpose: { ja: "未保存確認", en: "Unsaved changes" }, ja: "保存していない変更があります", en: "You have unsaved changes", messageJa: "このまま閉じると変更は保存されません。", messageEn: "Closing now discards unsaved changes.", note: { ja: "破棄、保存、キャンセルを明確にする。", en: "Clarify discard, save, and cancel." } },
            { purpose: { ja: "公開確認", en: "Publish confirmation" }, ja: "公開すると閲覧できるようになります", en: "Publishing makes this visible", messageJa: "公開するとチーム全員が閲覧できます。", messageEn: "Publishing makes this visible to everyone on the team.", note: { ja: "公開範囲を書く。", en: "Name who can see it." } },
            { purpose: { ja: "一括操作確認", en: "Bulk action" }, ja: "選択中の項目に適用します", en: "This applies to selected items", messageJa: "選択中の12件に適用します。", messageEn: "This applies to 12 selected items.", note: { ja: "件数を合わせて表示する。", en: "Show the selected count." } },
            { purpose: { ja: "権限変更確認", en: "Permission change" }, ja: "権限を変更しますか？", en: "Change permissions?", messageJa: "閲覧できるメンバーが変更されます。", messageEn: "This changes who can view it.", note: { ja: "変更後の影響を添える。", en: "Explain the impact." } },
        ],
    },
    {
        value: "docs",
        title: { ja: "ドキュメント説明", en: "Documentation copy" },
        description: {
            ja: "コンポーネント詳細ページでは、実装語だけでなく用途と判断基準を書きます。",
            en: "Component docs should explain usage and decision criteria, not only implementation terms.",
        },
        items: [
            { purpose: { ja: "用途", en: "Purpose" }, ja: "短い補助情報を表示する時に使います", en: "Use this to show short supporting information", note: { ja: "何に使うかから始める。", en: "Start with what it is for." } },
            { purpose: { ja: "状態", en: "State" }, ja: "選択中は背景色で現在地を示します", en: "Selected items use background color to show the current state", note: { ja: "見た目と意味を結びつける。", en: "Tie appearance to meaning." } },
            { purpose: { ja: "無効化", en: "Disabled" }, ja: "無効化時は理由をツールチップで伝えます", en: "Disabled controls explain the reason in a tooltip", note: { ja: "GunjoUI の共通ルール。", en: "GunjoUI shared rule." } },
            { purpose: { ja: "アクセシビリティ", en: "Accessibility" }, ja: "アイコンだけの操作には aria-label を付けます", en: "Icon-only actions need an aria-label", note: { ja: "Tooltip と意味を揃える。", en: "Match the tooltip meaning." } },
            { purpose: { ja: "実装上の注意", en: "Implementation note" }, ja: "入力エラー時は、入力欄に aria-invalid を設定します", en: "Set aria-invalid on the input when it has an error", note: { ja: "コード例や Usage で扱う実装説明。本文説明では用途に置き換える。", en: "Implementation detail for code examples and Usage. Translate it into intent in body copy." } },
            { purpose: { ja: "注意", en: "Caution" }, ja: "長いラベルでは折り返しと見切れを確認します", en: "Check wrapping and clipping with long labels", note: { ja: "日英両方で確認する。", en: "Check both locales." } },
        ],
    },
];

const reviewItems = [
    { ja: "日本語ページで英語だけの説明が残っていない。", en: "Japanese pages do not contain English-only descriptions." },
    { ja: "英語ページで日本語だけの説明が残っていない。", en: "English pages do not contain Japanese-only descriptions." },
    { ja: "ラベル、説明、表示メッセージを分け、文脈で不足する情報を本文メッセージに入れている。", en: "Labels, descriptions, and displayed messages are separated, and body copy fills missing context." },
    { ja: "画像の代替テキストが、装飾、内容、操作、データ可視化の役割に合っている。", en: "Image alt text matches the image role: decorative, informative, actionable, or data visualization." },
    { ja: "ボタン、アイコン、ツールチップが操作結果を示している。", en: "Buttons, icons, and tooltips state the action result." },
    { ja: "無効化 UI に理由と有効化条件がある。", en: "Disabled controls include a reason and enablement condition." },
    { ja: "エラーに回復方法がある。", en: "Errors include a recovery path." },
    { ja: "破壊的操作に確認がある。", en: "Destructive actions require confirmation." },
    { ja: "新しい文言が既存のメッセージ一覧にない場合は、追加候補として issue または作業ログに残している。", en: "New copy that is not in the catalog is recorded as a catalog candidate in an issue or work log." },
    { ja: "日本語と英語の長さで UI が崩れていない。", en: "The UI holds up with both Japanese and English copy lengths." },
];

function LocalNav({ isJa }: { isJa: boolean }) {
    return (
        <Card className="border-muted bg-muted/20">
            <CardHeader className="pb-3">
                <CardTitle className="text-base">{isJa ? "このページで決めること" : "What this page defines"}</CardTitle>
                <CardDescription>
                    {isJa
                        ? "読む順番を固定し、必要な時だけ詳細へ進める構成にしています。"
                        : "Use this order to move from decision rules to detailed examples."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <nav aria-label={isJa ? "ページ内ナビゲーション" : "On-page navigation"}>
                    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <a
                                    href={`#${item.id}`}
                                    className="flex items-center justify-between rounded-md border bg-background px-3 py-2 text-sm font-medium transition-colors hover:border-primary-border hover:text-primary"
                                >
                                    <span>{isJa ? item.ja : item.en}</span>
                                    <IconCircleDashed className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </CardContent>
        </Card>
    );
}

function MessageAnatomy({ isJa }: { isJa: boolean }) {
    const parts = [
        {
            label: { ja: "状態", en: "State" },
            text: {
                ja: "何が起きたかを最初に書く。",
                en: "State what happened first.",
            },
            example: { ja: "保存できませんでした", en: "Could not save" },
        },
        {
            label: { ja: "理由", en: "Reason" },
            text: {
                ja: "原因がわかる場合だけ、短く添える。",
                en: "Add the reason only when it is known.",
            },
            example: {
                ja: "通信が不安定です",
                en: "The connection is unstable",
            },
        },
        {
            label: { ja: "次の行動", en: "Next action" },
            text: {
                ja: "ユーザーが次にできる操作を書く。",
                en: "Name the next action the user can take.",
            },
            example: {
                ja: "時間をおいてもう一度お試しください",
                en: "Try again in a moment",
            },
        },
    ];

    return (
        <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/30">
                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{isJa ? "分解例" : "Anatomy"}</Badge>
                    <Badge variant="outline">Error</Badge>
                    <Badge variant="outline">Toast</Badge>
                </div>
                <CardTitle className="text-xl">
                    {isJa ? "良い文言は、状態・理由・次の行動に分けられる" : "Good copy separates state, reason, and next action"}
                </CardTitle>
                <CardDescription>
                    {isJa
                        ? "長く書くのではなく、ユーザーが判断する順番に情報を並べます。"
                        : "The goal is not longer copy. It is copy ordered around how users decide."}
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 pt-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div className="space-y-3">
                    <div className="text-sm font-medium text-muted-foreground">
                        {isJa ? "実際のメッセージ例" : "Message example"}
                    </div>
                    <div className="rounded-lg border bg-background p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive-subtle text-destructive-subtle-foreground">
                                <IconAlertTriangle className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <div className="min-w-0 space-y-1">
                                <div className="text-sm font-semibold text-foreground">
                                    {isJa ? "保存できませんでした" : "Could not save"}
                                </div>
                                <p className="text-sm leading-6 text-muted-foreground">
                                    {isJa
                                        ? "通信が不安定です。時間をおいてもう一度お試しください。"
                                        : "The connection is unstable. Try again in a moment."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="text-sm font-medium text-muted-foreground">
                        {isJa ? "文言の役割" : "Copy roles"}
                    </div>
                    <div className="grid gap-3">
                        {parts.map((part) => (
                            <div key={part.label.en} className="rounded-lg border bg-muted/20 p-3">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="outline">{isJa ? part.label.ja : part.label.en}</Badge>
                                    <span className="text-sm font-medium">{isJa ? part.example.ja : part.example.en}</span>
                                </div>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    {isJa ? part.text.ja : part.text.en}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function PatternPreview({ isJa }: { isJa: boolean }) {
    return (
        <div className="grid gap-4 lg:grid-cols-3">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">{isJa ? "空状態" : "Empty state"}</CardTitle>
                    <CardDescription>{isJa ? "対象と次の操作をセットで書く。" : "Pair the object with the next action."}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border border-dashed p-5 text-center">
                        <IconCircleDashed className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden="true" />
                        <div className="mt-3 font-medium">{isJa ? "まだファイルがありません" : "No files yet"}</div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {isJa ? "アップロードすると、ここに表示されます。" : "Upload files to show them here."}
                        </p>
                        <Button className="mt-4" size="sm">{isJa ? "アップロード" : "Upload"}</Button>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">{isJa ? "無効化" : "Disabled"}</CardTitle>
                    <CardDescription>{isJa ? "理由と有効化条件を隠さない。" : "Do not hide the reason or enablement condition."}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button disabled className="w-full">{isJa ? "公開する" : "Publish"}</Button>
                    <p className="text-sm text-muted-foreground">
                        {isJa
                            ? "承認権限がないため公開できません。管理者に依頼してください。"
                            : "You do not have approval permission. Ask an admin."}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">{isJa ? "破壊的操作" : "Destructive action"}</CardTitle>
                    <CardDescription>{isJa ? "実行前に対象と不可逆性を確認する。" : "Confirm the object and irreversibility before running."}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border p-4">
                        <div className="flex items-start gap-3">
                            <IconTrash className="mt-1 h-5 w-5 text-destructive" aria-hidden="true" />
                            <div className="space-y-1">
                                <div className="font-medium">{isJa ? "ファイルを削除しますか？" : "Delete this file?"}</div>
                                <p className="text-sm text-muted-foreground">
                                    {isJa ? "この操作は取り消せません。" : "This action cannot be undone."}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <Button variant="outline" size="sm">{isJa ? "キャンセル" : "Cancel"}</Button>
                            <Button variant="destructive" size="sm">{isJa ? "削除" : "Delete"}</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function AltTextGuidance({ isJa }: { isJa: boolean }) {
    const rules = [
        {
            role: { ja: "装飾", en: "Decorative" },
            rule: {
                ja: "見た目の装飾だけで、内容や操作を伝えない画像は `alt=\"\"` にします。",
                en: "Use `alt=\"\"` for images that are purely decorative and do not communicate content or action.",
            },
            example: { ja: "背景装飾、区切り用の画像", en: "Background decoration or separator imagery" },
        },
        {
            role: { ja: "内容を伝える画像", en: "Informative image" },
            rule: {
                ja: "見た目ではなく、ユーザーに伝える内容を書きます。",
                en: "Describe what the image communicates, not just how it looks.",
            },
            example: { ja: "オフィスデスクの写真", en: "Office desk" },
        },
        {
            role: { ja: "商品・素材画像", en: "Product or asset image" },
            rule: {
                ja: "ファイル名だけにせず、対象名や内容がわかる言葉にします。",
                en: "Use the object name or content, not only the file name.",
            },
            example: { ja: "ノートパソコンの商品写真", en: "Laptop product photo" },
        },
        {
            role: { ja: "画像ボタン", en: "Image button" },
            rule: {
                ja: "操作は画像の `alt` ではなく、ボタンの `aria-label` とツールチップで説明します。",
                en: "Put the action in the button `aria-label` and tooltip, not in the image alt text.",
            },
            example: { ja: "拡大表示する / 画像を閉じる", en: "Open preview / Close image" },
        },
        {
            role: { ja: "グラフ・地図", en: "Charts and maps" },
            rule: {
                ja: "`alt` だけで完結させず、近くに要約や表を置きます。",
                en: "Do not rely on alt text alone. Add a nearby summary or table.",
            },
            example: { ja: "東京都インシデントは新宿区が最多です。", en: "Shinjuku has the most Tokyo incidents." },
        },
    ];
    const references = [
        {
            title: "W3C WAI: Decorative Images",
            href: "https://www.w3.org/WAI/tutorials/images/decorative/",
        },
        {
            title: "W3C WCAG Technique H67",
            href: "https://www.w3.org/WAI/WCAG21/Techniques/html/H67.html",
        },
        {
            title: "MDN: HTMLImageElement alt",
            href: "https://developer.mozilla.org/docs/Web/API/HTMLImageElement/alt",
        },
    ];

    return (
        <section className="space-y-6" id="alt-text">
            <div className="space-y-2">
                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    {isJa ? "画像と代替テキスト" : "Images and Alt Text"}
                </h2>
                <p className="max-w-3xl text-muted-foreground">
                    {isJa
                        ? "画像の `alt` は翻訳のついでではなく、画像が UI の中で何を担っているかを説明する文言です。Img、ImagePreview、AssetCard、Avatar、グラフ、地図を確認する時は必ず見ます。"
                        : "Image alt text is not an afterthought. It explains what the image does in the UI. Review it for Img, ImagePreview, AssetCard, Avatar, charts, and maps."}
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <IconPhoto className="h-5 w-5 text-primary" aria-hidden="true" />
                        {isJa ? "役割ごとに書き分ける" : "Write by image role"}
                    </CardTitle>
                    <CardDescription>
                        {isJa
                            ? "「画像」「写真」「イメージ」だけで終わらせず、必要な時だけ具体化します。"
                            : "Avoid labels that only say “image”, “photo”, or “illustration”. Add concrete meaning when the image carries it."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="overflow-x-auto rounded-lg border">
                            <Table striped className="min-w-[760px]">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[20%]">{isJa ? "役割" : "Role"}</TableHead>
                                        <TableHead className="w-[48%]">{isJa ? "ルール" : "Rule"}</TableHead>
                                        <TableHead>{isJa ? "例" : "Example"}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rules.map((rule) => (
                                        <TableRow key={rule.role.en}>
                                            <TableCell className="font-semibold text-foreground">{isJa ? rule.role.ja : rule.role.en}</TableCell>
                                            <TableCell className="font-medium leading-6 text-foreground">{isJa ? rule.rule.ja : rule.rule.en}</TableCell>
                                            <TableCell className="font-medium text-foreground">{isJa ? rule.example.ja : rule.example.en}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <DocNote heading={isJa ? "参考文献" : "References"}>
                            {references.map((reference, index) => (
                                <span key={reference.href}>
                                    <TextLink
                                        href={reference.href}
                                        target="_blank"
                                        newTabLabel={isJa ? "新しいタブで開きます" : "opens in a new tab"}
                                    >
                                        {reference.title}
                                    </TextLink>
                                    {index < references.length - 1 ? <span aria-hidden="true"> / </span> : null}
                                </span>
                            ))}
                        </DocNote>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}

export default function WritingGuidelinesPage() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [catalogLocale, setCatalogLocale] = useState<"ja" | "en">(locale);
    const catalogIsJa = catalogLocale === "ja";

    useEffect(() => {
        setCatalogLocale(locale);
    }, [locale]);

    return (
        <div className="space-y-14">
            <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
                <div className="space-y-5">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">Guidelines</Badge>
                        <Badge variant="secondary">Issue #234</Badge>
                    </div>
                    <div className="space-y-3">
                        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
                            {isJa ? "文言" : "Voice & Tone"}
                            <span className="ml-3 text-2xl font-medium text-muted-foreground lg:text-3xl">
                                {isJa ? "Voice & Tone" : "文言"}
                            </span>
                        </h1>
                        <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
                            {isJa
                                ? "GunjoUI のボタン、説明文、エラー、空状態、ツールチップ、トーストを、同じ判断基準で設計するためのガイドラインです。文言は翻訳の後工程ではなく、コンポーネント品質の一部として扱います。"
                                : "Guidelines for designing GunjoUI button labels, descriptions, errors, empty states, tooltips, and toasts with a shared content model. Copy is part of component quality, not a translation afterthought."}
                        </p>
                    </div>
                </div>
                <Card className="bg-muted/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <IconClipboardCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                            {isJa ? "このページの使い方" : "How to use this page"}
                        </CardTitle>
                        <CardDescription>
                            {isJa
                                ? "新しいコンポーネント docs を直す時は、先に判断の流れを見てから、場面別パターンとメッセージ一覧を参照します。"
                                : "For component docs work, start with the decision flow, then use the patterns and message catalog."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        <Kbd>{isJa ? "判断" : "Decide"}</Kbd>
                        <Kbd>{isJa ? "書く" : "Write"}</Kbd>
                        <Kbd>{isJa ? "確認" : "Review"}</Kbd>
                    </CardContent>
                </Card>
            </section>

            <LocalNav isJa={isJa} />

            <section className="space-y-6" id="principles">
                <div className="space-y-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        {isJa ? "基本原則" : "Principles"}
                    </h2>
                    <p className="max-w-3xl text-muted-foreground">
                        {isJa
                            ? "文言は、UI の余白を埋めるものではありません。操作を決めるための情報として置きます。"
                            : "Copy is not filler. It is information that helps people decide and act."}
                    </p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    {principles.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Card key={item.title.en} className="relative overflow-hidden">
                                <CardHeader className="space-y-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-subtle text-primary-subtle-foreground">
                                            <Icon className="h-5 w-5" aria-hidden="true" />
                                        </div>
                                        <Badge variant="outline">{isJa ? item.label.ja : item.label.en}</Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg">{isJa ? item.title.ja : item.title.en}</CardTitle>
                                        <CardDescription>{isJa ? item.description.ja : item.description.en}</CardDescription>
                                    </div>
                                </CardHeader>
                            </Card>
                        );
                    })}
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]" id="decision">
                <div className="space-y-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        {isJa ? "判断の流れ" : "Decision Flow"}
                    </h2>
                    <p className="text-muted-foreground">
                        {isJa
                            ? "先に文言の目的を決めると、長いだけの説明や実装語の混入を避けられます。"
                            : "Deciding the purpose first prevents long filler copy and implementation terms from leaking in."}
                    </p>
                </div>
                <Card>
                    <CardContent className="grid gap-3 pt-6">
                        {decisionSteps.map((step, index) => (
                            <div key={step.title.en} className="grid gap-3 rounded-lg border bg-muted/20 p-4 sm:grid-cols-[3rem_minmax(0,1fr)]">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-subtle text-sm font-semibold text-primary-subtle-foreground">
                                    {index + 1}
                                </div>
                                <div className="min-w-0 space-y-1">
                                    <h3 className="text-base font-semibold">{isJa ? step.title.ja : step.title.en}</h3>
                                    <p className="text-sm leading-6 text-muted-foreground">
                                        {isJa ? step.description.ja : step.description.en}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </section>

            <MessageAnatomy isJa={isJa} />

            <section className="space-y-6" id="patterns">
                <div className="space-y-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        {isJa ? "場面別パターン" : "Patterns by Context"}
                    </h2>
                    <p className="max-w-3xl text-muted-foreground">
                        {isJa
                            ? "読む人が最初に知りたいのは、文言の分類ではなく、いま見ている UI で何を書けばよいかです。"
                            : "People do not start with taxonomy. They start with the UI in front of them and what it needs to say."}
                    </p>
                </div>
                <div className="grid gap-4">
                    {patterns.map((pattern) => (
                        <Card key={pattern.value}>
                            <CardHeader className="border-b bg-muted/20">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="secondary">{isJa ? pattern.label.ja : pattern.label.en}</Badge>
                                </div>
                                <CardTitle className="text-xl">{isJa ? pattern.title.ja : pattern.title.en}</CardTitle>
                                <CardDescription>{isJa ? pattern.description.ja : pattern.description.en}</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-3 pt-5 md:grid-cols-3">
                                {pattern.examples.map((example) => (
                                    <div key={example.en} className="rounded-lg border bg-background p-3">
                                        <div className="text-sm font-semibold">{isJa ? example.ja : example.en}</div>
                                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                            {isJa ? example.noteJa : example.noteEn}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <PatternPreview isJa={isJa} />

            <AltTextGuidance isJa={isJa} />

            <section className="space-y-6" id="examples">
                <div className="space-y-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        {isJa ? "良い例 / 悪い例" : "Do / Don’t"}
                    </h2>
                    <p className="max-w-3xl text-muted-foreground">
                        {isJa
                            ? "短いだけ、実装語のまま、理由がない文言は直します。比較で見ると判断しやすくなります。"
                            : "Copy that is merely short, implementation-heavy, or missing a reason should be revised. Comparisons make the rule easier to apply."}
                    </p>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                    {doDontExamples.map((item) => (
                        <Card key={item.context.en}>
                            <CardHeader>
                                <CardTitle className="text-lg">{isJa ? item.context.ja : item.context.en}</CardTitle>
                                <CardDescription>{isJa ? item.reason.ja : item.reason.en}</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-md border border-destructive-border bg-destructive-subtle p-3">
                                    <div className="mb-2 flex items-center gap-2 text-xs font-medium text-destructive">
                                        <IconX className="h-4 w-4" aria-hidden="true" />
                                        {isJa ? "避ける" : "Don’t"}
                                    </div>
                                    <p className="text-sm">{isJa ? item.dontJa : item.dontEn}</p>
                                </div>
                                <div className="rounded-md border border-primary-border bg-primary-subtle p-3">
                                    <div className="mb-2 flex items-center gap-2 text-xs font-medium text-primary">
                                        <IconCircleCheck className="h-4 w-4" aria-hidden="true" />
                                        {isJa ? "推奨" : "Do"}
                                    </div>
                                    <p className="text-sm">{isJa ? item.doJa : item.doEn}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="space-y-6" id="catalog">
                <div className="space-y-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        {isJa ? "メッセージ一覧" : "Message Catalog"}
                    </h2>
                    <p className="max-w-3xl text-muted-foreground">
                        {isJa
                            ? "文言は最終的に大量の辞書になります。ここではまず頻出する操作、状態、エラー、確認、docs 説明をカテゴリ別に並べ、今後追加する候補も同じ形式で増やします。"
                            : "Copy eventually becomes a large catalog. This page starts with common actions, states, errors, confirmations, and docs copy so future candidates can be added in the same format."}
                    </p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{isJa ? `${messageCatalogCategories.reduce((sum, category) => sum + category.items.length, 0)} 件` : `${messageCatalogCategories.reduce((sum, category) => sum + category.items.length, 0)} entries`}</Badge>
                        <Badge variant="outline">{isJa ? "追加前提の辞書" : "Expandable catalog"}</Badge>
                    </div>
                    <div
                        className="inline-flex rounded-md border bg-background p-1"
                        aria-label={isJa ? "メッセージ一覧の表示言語" : "Message catalog language"}
                    >
                        <Button
                            size="sm"
                            variant={catalogIsJa ? "secondary" : "ghost"}
                            className="h-8 px-3"
                            onClick={() => setCatalogLocale("ja")}
                        >
                            日本語
                        </Button>
                        <Button
                            size="sm"
                            variant={!catalogIsJa ? "secondary" : "ghost"}
                            className="h-8 px-3"
                            onClick={() => setCatalogLocale("en")}
                        >
                            English
                        </Button>
                    </div>
                </div>
                <Accordion type="multiple" defaultValue={["actions", "feedback", "errors"]} className="w-full rounded-lg">
                    {messageCatalogCategories.map((category) => (
                        <AccordionItem key={category.value} value={category.value}>
                            <AccordionTrigger openLabel={isJa ? "開く" : "Open"} closeLabel={isJa ? "閉じる" : "Close"}>
                                <span className="flex flex-wrap items-center gap-2">
                                    <span>{catalogIsJa ? category.title.ja : category.title.en}</span>
                                    <Badge variant="outline">{category.items.length}</Badge>
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="mb-3 text-sm leading-6 text-muted-foreground">
                                    {catalogIsJa ? category.description.ja : category.description.en}
                                </p>
                                <div className="overflow-x-auto rounded-lg border">
                                    <Table striped className="min-w-[860px]">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[20%]">{catalogIsJa ? "用途" : "Purpose"}</TableHead>
                                                <TableHead className="w-[22%]">{catalogIsJa ? "ラベル / 見出し" : "Label / heading"}</TableHead>
                                                <TableHead className="w-[36%]">{catalogIsJa ? "表示メッセージ" : "Displayed message"}</TableHead>
                                                <TableHead>{catalogIsJa ? "確認ポイント" : "Review point"}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {category.items.map((item) => (
                                                <TableRow key={`${category.value}-${item.en}`}>
                                                    <TableCell className="text-base font-semibold leading-6 text-foreground">
                                                        {catalogIsJa ? item.purpose.ja : item.purpose.en}
                                                    </TableCell>
                                                    <TableCell className="font-medium text-foreground">{catalogIsJa ? item.ja : item.en}</TableCell>
                                                    <TableCell className="font-medium leading-6 text-foreground">{catalogIsJa ? item.messageJa ?? item.ja : item.messageEn ?? item.en}</TableCell>
                                                    <TableCell className="font-medium text-foreground">{catalogIsJa ? item.note.ja : item.note.en}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>

            <section className="space-y-6" id="review">
                <div className="space-y-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        {isJa ? "確認手順" : "Review Process"}
                    </h2>
                    <p className="max-w-3xl text-muted-foreground">
                        {isJa
                            ? "コンポーネント詳細ページやパターンを更新する時は、見た目、操作、文言をまとめて確認します。"
                            : "When updating component docs or patterns, review visual quality, behavior, and copy together."}
                    </p>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <ul className="grid gap-3 md:grid-cols-2">
                            {reviewItems.map((item) => (
                                <li key={item.en} className="flex gap-3">
                                    <IconCircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                                    <span className="text-sm leading-6">{isJa ? item.ja : item.en}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </section>

            <Separator />

            <section className="space-y-4" id="source">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <IconMessages className="h-4 w-4" aria-hidden="true" />
                    {isJa ? "作業用SSOT" : "Working source of truth"}
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                    <Badge variant="outline">docs/content-guidelines.md</Badge>
                    <Badge variant="outline">GitHub Issue #234</Badge>
                    <Badge variant="outline">component docs audit</Badge>
                </div>
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                    {isJa
                        ? "このページは公開向けの基準です。運用メモ、棚卸し、今後追加するメッセージ候補はリポジトリ内の docs/content-guidelines.md と Issue #234 で管理します。"
                        : "This page is the public-facing standard. Operating notes, audits, and future message candidates remain tracked in docs/content-guidelines.md and Issue #234."}
                </p>
            </section>
        </div>
    );
}
