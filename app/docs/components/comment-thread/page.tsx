"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { IconMessageOff } from "@tabler/icons-react";
import {
  Button,
  CommentThread,
  EmptyState,
  Icon,
  type CommentItem,
  type CommentThreadLabels,
} from "@gunjo/ui";

type Locale = "ja" | "en";

const metadata = displayMetadata as Record<"commentThread", { title: string; description: string }>;

function labelsFor(locale: Locale): CommentThreadLabels {
  return locale === "ja"
    ? {
        resolved: "解決済み",
        unresolved: "未解決",
        markResolved: "解決にする",
        markUnresolved: "未解決に戻す",
        reply: "返信",
        replies: "返信",
      }
    : {
        resolved: "Resolved",
        unresolved: "Open",
        markResolved: "Resolve",
        markUnresolved: "Reopen",
        reply: "Reply",
        replies: "Replies",
      };
}

function seedComments(locale: Locale): CommentItem[] {
  return locale === "ja"
    ? [
        {
          id: "c1",
          author: { name: "岩井 遼", affiliation: "デジタル推進本部 データ基盤部" },
          timestamp: "7月22日 09:55",
          body: "第7条の損害賠償の上限が委託料の12か月分になっています。当社基準は契約金額までなので、このままだと超過します。",
          resolved: false,
          replies: [
            {
              id: "c1r1",
              author: { name: "池田 亮太", affiliation: "法務・コンプライアンス部" },
              timestamp: "7月22日 14:10",
              body: "確認しました。上限を契約金額に戻す修正案を先方に返します。",
            },
          ],
        },
        {
          id: "c2",
          author: { name: "森野 千尋", affiliation: "法務・コンプライアンス部 マネージャー" },
          timestamp: "7月21日 17:30",
          body: "再委託は認める方針で相違ないでしょうか。認める場合は事前承諾を条件に付けます。",
          resolved: true,
          replies: [
            {
              id: "c2r1",
              author: { name: "岩井 遼", affiliation: "デジタル推進本部 データ基盤部" },
              timestamp: "7月21日 18:02",
              body: "認める方針で問題ありません。事前承諾の条件もお願いします。",
            },
          ],
        },
        {
          id: "c3",
          author: { name: "システム", affiliation: "自動通知" },
          timestamp: "7月20日 09:00",
          body: "第3版（先方回答）が登録されました。",
        },
      ]
    : [
        {
          id: "c1",
          author: { name: "Ryo Iwai", affiliation: "Data Platform, Digital" },
          timestamp: "Jul 22, 09:55",
          body: "Clause 7 caps liability at 12 months of fees. Our standard is the contract value, so this exceeds it.",
          resolved: false,
          replies: [
            {
              id: "c1r1",
              author: { name: "Ryota Ikeda", affiliation: "Legal & Compliance" },
              timestamp: "Jul 22, 14:10",
              body: "Confirmed. I will send back a redline restoring the contract-value cap.",
            },
          ],
        },
        {
          id: "c2",
          author: { name: "Chihiro Morino", affiliation: "Legal & Compliance, Manager" },
          timestamp: "Jul 21, 17:30",
          body: "Can you confirm the business is happy to permit subcontracting? We will add prior consent as a condition.",
          resolved: true,
          replies: [
            {
              id: "c2r1",
              author: { name: "Ryo Iwai", affiliation: "Data Platform, Digital" },
              timestamp: "Jul 21, 18:02",
              body: "Permitting it is fine. Please add the prior-consent condition.",
            },
          ],
        },
        {
          id: "c3",
          author: { name: "System", affiliation: "Automated notice" },
          timestamp: "Jul 20, 09:00",
          body: "Revision 3 (counterparty response) was uploaded.",
        },
      ];
}

function CommentThreadPreview({
  locale,
  collapseResolved: collapseProp,
  showToggle = true,
}: {
  locale: Locale;
  collapseResolved?: boolean;
  showToggle?: boolean;
}) {
  const [comments, setComments] = React.useState<CommentItem[]>(() => seedComments(locale));
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    setComments(seedComments(locale));
  }, [locale]);

  const collapseResolved = collapseProp ?? collapsed;
  const open = comments.filter((c) => c.resolved === false).length;

  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {locale === "ja" ? `未解決 ${open} 件` : `${open} open`}
        </p>
        {showToggle ? (
          <Button
            variant="outline"
            size="sm"
            aria-pressed={collapsed}
            onClick={() => setCollapsed((v) => !v)}
          >
            {locale === "ja"
              ? collapsed
                ? "解決済みも開く"
                : "解決済みを畳む"
              : collapsed
                ? "Expand resolved"
                : "Collapse resolved"}
          </Button>
        ) : null}
      </div>

      <CommentThread
        comments={comments}
        label={locale === "ja" ? "依頼元とのやり取り" : "Thread with the requester"}
        labels={labelsFor(locale)}
        collapseResolved={collapseResolved}
        onResolvedChange={(id, resolved) =>
          setComments((prev) => prev.map((c) => (c.id === id ? { ...c, resolved } : c)))
        }
      />
    </div>
  );
}

function EmptyPreview({ locale }: { locale: Locale }) {
  return (
    <div className="w-full max-w-2xl">
      <CommentThread
        comments={[]}
        labels={labelsFor(locale)}
        emptyState={
          <EmptyState
            icon={<Icon icon={IconMessageOff} size="lg" decorative />}
            title={locale === "ja" ? "まだやり取りはありません" : "No comments yet"}
            description={
              locale === "ja"
                ? "この案件について気になる点があれば書き込んでください。"
                : "Raise anything that needs the other side's input."
            }
            headingLevel={4}
          />
        }
      />
    </div>
  );
}

const usageCode = `import { CommentThread, type CommentItem } from "@gunjo/ui"

const comments: CommentItem[] = [
  {
    id: "c1",
    author: { name: "岩井 遼", affiliation: "デジタル推進本部 データ基盤部" },
    timestamp: "7月22日 09:55",
    body: "第7条の損害賠償の上限が当社基準を超えています。",
    resolved: false,
    replies: [
      {
        id: "c1r1",
        author: { name: "池田 亮太", affiliation: "法務・コンプライアンス部" },
        timestamp: "7月22日 14:10",
        body: "修正案を先方に返します。",
      },
    ],
  },
]

<CommentThread
  comments={comments}
  label="依頼元とのやり取り"
  labels={{
    resolved: "解決済み",
    unresolved: "未解決",
    markResolved: "解決にする",
    markUnresolved: "未解決に戻す",
    reply: "返信",
    replies: "返信",
  }}
  onResolvedChange={(id, resolved) => save(id, resolved)}
/>`;

export default function CommentThreadDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/comment-thread", locale);
  const title = content?.title ?? metadata.commentThread.title;
  const description = content?.description ?? metadata.commentThread.description;

  const propsData = [
    {
      name: "comments",
      type: "CommentItem[]",
      description:
        locale === "ja"
          ? "投稿の配列。各項目は id / author / body を持ち、timestamp・resolved・replies・trailing は任意です。"
          : "The posts. Each carries id / author / body; timestamp, resolved, replies and trailing are optional.",
    },
    {
      name: "headingLevel",
      type: "2 | 3 | 4 | 5 | 6",
      defaultValue: "4",
      description:
        locale === "ja"
          ? "各投稿の投稿者名の見出しレベル。読み上げで投稿間を移動できるように、投稿は必ず見出しになります。"
          : "Heading level for each post's author line. Posts are always real headings so they can be navigated.",
    },
    {
      name: "collapseResolved",
      type: "boolean",
      defaultValue: "false",
      description:
        locale === "ja"
          ? "解決済みの投稿の本文と返信を畳みます。状態は呼び出し側が持ちます。"
          : "Collapse the body and replies of resolved posts. Caller-controlled.",
    },
    {
      name: "onResolvedChange",
      type: "(id: string, resolved: boolean) => void",
      description:
        locale === "ja"
          ? "解決状態が切り替わったとき。省略すると切り替えボタンを出しません。"
          : "Called when resolution toggles. Omit to hide the toggle.",
    },
    {
      name: "onReply",
      type: "(id: string) => void",
      description:
        locale === "ja"
          ? "返信が押されたとき。省略すると返信ボタンを出しません。"
          : "Called when reply is pressed. Omit to hide the reply button.",
    },
    {
      name: "emptyState",
      type: "React.ReactNode",
      description:
        locale === "ja"
          ? "comments が空のときに代わりに描画します。"
          : "Rendered instead of the list when comments is empty.",
    },
    {
      name: "label",
      type: "string",
      description:
        locale === "ja" ? "スレッド領域のアクセシブルな名前。" : "Accessible name for the thread region.",
    },
    {
      name: "labels",
      type: "Partial<CommentThreadLabels>",
      description:
        locale === "ja"
          ? "組み込み文言。既定は英語なので、日本語の画面では渡します。"
          : "Built-in strings. English by default.",
    },
    {
      name: "className",
      type: "string",
      description: locale === "ja" ? "追加のクラス名。" : "Additional CSS class names.",
    },
  ];

  return (
    <ComponentLayout title={title} description={description}>
      <ComponentPreview
        code={usageCode}
        codeBlock={<CodeBlock code={usageCode} />}
        sectionLabels={sectionLabels}
        previewHeight="auto"
      >
        <CommentThreadPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2
          className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0"
          id="states"
        >
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "open-and-resolved",
              title: locale === "ja" ? "未解決と解決済み" : "Open and resolved",
              description:
                locale === "ja"
                  ? "resolved を持つ投稿にはバッジと切り替えが出ます。resolved を省いた投稿（システム通知など）には出ません。"
                  : "Posts carrying resolved get a badge and a toggle. Posts without it (a system notice) get neither.",
              preview: <CommentThreadPreview locale={locale} showToggle={false} />,
              code: usageCode,
            },
            {
              key: "collapse-resolved",
              title: locale === "ja" ? "解決済みを畳む" : "Collapsed resolved",
              description:
                locale === "ja"
                  ? "collapseResolved を渡すと、解決済みの本文と返信を隠して見出しだけ残します。長いスレッドで未解決だけを追うときに使います。"
                  : "collapseResolved hides the body and replies of resolved posts, leaving the header — for following only what is still open.",
              preview: <CommentThreadPreview locale={locale} collapseResolved showToggle={false} />,
              code: `<CommentThread comments={comments} collapseResolved />`,
            },
            {
              key: "empty",
              title: locale === "ja" ? "空状態" : "Empty",
              description:
                locale === "ja"
                  ? "emptyState を渡すと、やり取りがまだ無いときにそれを描画します。"
                  : "emptyState renders when there are no comments yet.",
              preview: <EmptyPreview locale={locale} />,
              code: `<CommentThread comments={[]} emptyState={<EmptyState title="まだやり取りはありません" headingLevel={4} />} />`,
            },
          ]}
        />
      </section>

      <section className="space-y-4">
        <h2
          className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0"
          id="props"
        >
          Props
        </h2>
        <PropsTable data={propsData} />
      </section>
    </ComponentLayout>
  );
}
