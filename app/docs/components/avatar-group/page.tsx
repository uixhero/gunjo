"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
} from "@gunjo/ui";

type TeamMember = {
    id: string;
    initials: string;
    name: { ja: string; en: string };
    status: { ja: string; en: string };
};

const TEAM: TeamMember[] = [
    { id: "1", initials: "青", name: { ja: "青井 花", en: "Aoi Hana" }, status: { ja: "オンライン", en: "Online" } },
    { id: "2", initials: "田", name: { ja: "田中 空", en: "Sora Tanaka" }, status: { ja: "離席中", en: "Away" } },
    { id: "3", initials: "山", name: { ja: "山本 優", en: "Yu Yamamoto" }, status: { ja: "取り込み中", en: "Busy" } },
    { id: "4", initials: "小", name: { ja: "小林 真央", en: "Mao Kobayashi" }, status: { ja: "オフライン", en: "Offline" } },
    { id: "5", initials: "中", name: { ja: "中村 蓮", en: "Ren Nakamura" }, status: { ja: "オンライン", en: "Online" } },
];

const OVERFLOW_MEMBERS: TeamMember[] = Array.from({ length: 25 }, (_, index) => {
    const jaNames = [
        "佐藤 芽衣",
        "鈴木 悠真",
        "高橋 結衣",
        "伊藤 莉子",
        "渡辺 蒼",
        "加藤 ひなた",
        "吉田 晴",
        "山口 凛",
        "松本 蓮",
        "井上 葵",
    ];
    const enNames = [
        "Mei Sato",
        "Yuma Suzuki",
        "Yui Takahashi",
        "Riko Ito",
        "Ao Watanabe",
        "Hinata Kato",
        "Haru Yoshida",
        "Rin Yamaguchi",
        "Ren Matsumoto",
        "Aoi Inoue",
    ];
    const nameIndex = index % jaNames.length;

    return {
        id: `extra-${index + 1}`,
        initials: jaNames[nameIndex].slice(0, 1),
        name: {
            ja: index === 17 ? "佐々木 クリストファー 真" : jaNames[nameIndex],
            en: index === 17 ? "Christopher Makoto Sasaki" : enNames[nameIndex],
        },
        status: index % 4 === 0
            ? { ja: "オンライン", en: "Online" }
            : index % 4 === 1
                ? { ja: "離席中", en: "Away" }
                : index % 4 === 2
                    ? { ja: "取り込み中", en: "Busy" }
                    : { ja: "オフライン", en: "Offline" },
    };
});

const LARGE_TEAM = [...TEAM, ...OVERFLOW_MEMBERS];

function getMemberName(member: TeamMember, locale: string) {
    return locale === "ja" ? member.name.ja : member.name.en;
}

function getMemberStatus(member: TeamMember, locale: string) {
    return locale === "ja" ? member.status.ja : member.status.en;
}

function renderMemberTooltip(member: TeamMember, locale: string) {
    return (
        <span className="grid gap-0.5 text-left">
            <span>{getMemberName(member, locale)}</span>
            <span className="text-xs text-muted-foreground">{getMemberStatus(member, locale)}</span>
        </span>
    );
}

function renderOverflowTooltip(members: TeamMember[], locale: string) {
    const previewMembers = members.slice(0, 5);
    const remaining = Math.max(0, members.length - previewMembers.length);

    return (
        <span className="grid gap-1 text-left">
            <span>{locale === "ja" ? "非表示のメンバー" : "Hidden members"}</span>
            <span className="text-xs text-muted-foreground">
                {previewMembers.map((member) => getMemberName(member, locale)).join(" / ")}
            </span>
            {remaining > 0 ? (
                <span className="text-xs text-muted-foreground">
                    {locale === "ja" ? `ほか ${remaining} 名` : `and ${remaining} more`}
                </span>
            ) : null}
        </span>
    );
}

function renderMemberList(members: TeamMember[], locale: string) {
    return (
        <div className="overflow-hidden rounded-md">
            <div className="border-b px-4 py-3">
                <p className="text-sm font-medium">
                    {locale === "ja" ? "メンバー一覧" : "Member list"}
                </p>
                <p className="text-xs text-muted-foreground">
                    {locale === "ja" ? `${members.length} 名` : `${members.length} members`}
                </p>
            </div>
            <div className="max-h-[min(16rem,calc(var(--radix-popover-content-available-height)-4.5rem))] overflow-y-auto p-2">
                {members.map((member) => (
                    <div
                        key={member.id}
                        className="flex min-w-0 items-center gap-3 rounded-md px-2 py-2 text-sm"
                    >
                        <Avatar className="h-8 w-8" aria-hidden="true">
                            <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                        </Avatar>
                        <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium">{getMemberName(member, locale)}</span>
                            <span className="block truncate text-xs text-muted-foreground">
                                {getMemberStatus(member, locale)}
                            </span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function AvatarGroupPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/avatar-group", locale);
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const title = content?.title ?? meta.avatarGroup.title;
    const description = content?.description ?? meta.avatarGroup.description;

    const code = locale === "ja"
        ? `import { Avatar, AvatarFallback, AvatarGroup } from "@gunjo/ui";

export function Example() {
  const hiddenMembers = team.slice(5);

  return (
    <AvatarGroup
      max={5}
      overflowTooltip={formatHiddenMembers(hiddenMembers, { maxNames: 5 })}
      overflowAriaLabel="メンバー一覧を表示"
      overflowContent={<MemberList members={team} />}
    >
      {team.map((member) => (
        <Avatar key={member.id} aria-label={member.name} tooltip={member.name}>
          <AvatarFallback>{member.initials}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}`
        : `import { Avatar, AvatarFallback, AvatarGroup } from "@gunjo/ui";

export function Example() {
  const hiddenMembers = team.slice(5);

  return (
    <AvatarGroup
      max={5}
      overflowTooltip={formatHiddenMembers(hiddenMembers, { maxNames: 5 })}
      overflowAriaLabel="Show member list"
      overflowContent={<MemberList members={team} />}
    >
      {team.map((member) => (
        <Avatar key={member.id} aria-label={member.name} tooltip={member.name}>
          <AvatarFallback>{member.initials}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}`;

    const usageCode = locale === "ja"
        ? `import { Avatar, AvatarFallback, AvatarGroup } from "@gunjo/ui";

export function TeamAvatars({ team }) {
  return (
    <AvatarGroup max={4}>
      {team.map((member) => (
        <Avatar key={member.id} aria-label={member.name} tooltip={member.name}>
          <AvatarFallback>{member.initials}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}`
        : `import { Avatar, AvatarFallback, AvatarGroup } from "@gunjo/ui";

export function TeamAvatars({ team }) {
  return (
    <AvatarGroup max={4}>
      {team.map((member) => (
        <Avatar key={member.id} aria-label={member.name} tooltip={member.name}>
          <AvatarFallback>{member.initials}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}`;

    const propsData = [
        {
            name: "max",
            type: "number",
            description: locale === "ja" ? "+N 表示にまとめる前に表示する最大人数です。" : "Maximum avatars to show before collapsing into a +N indicator.",
        },
        {
            name: "overlap",
            type: "number",
            default: "8",
            description: locale === "ja" ? "隣り合うアバターを重ねる幅です。" : "Pixel overlap between adjacent avatars.",
        },
        {
            name: "avatarClassName",
            type: "string",
            description: locale === "ja" ? "各アバターの外側ラッパーに付与する className です。" : "Class applied to each Avatar wrapper.",
        },
        {
            name: "overflowTooltip",
            type: "ReactNode",
            description: locale === "ja" ? "+N 表示にまとめたメンバーを説明するツールチップです。" : "Tooltip content for the +N overflow avatar.",
        },
        {
            name: "overflowContent",
            type: "ReactNode",
            description: locale === "ja" ? "+N 表示をクリックした時に開くポップオーバーの内容です。全メンバー一覧などを渡します。" : "Popover content opened from the +N overflow avatar, such as a full member list.",
        },
        {
            name: "overflowAriaLabel",
            type: "string",
            description: locale === "ja" ? "クリック可能な +N 表示のアクセシブルラベルです。" : "Accessible label for the clickable +N overflow avatar.",
        },
        {
            name: "overflowContentClassName",
            type: "string",
            description: locale === "ja" ? "+N 表示のポップオーバー内容に付与する className です。" : "Class applied to the +N overflow popover content.",
        },
        {
            name: "overflowPortalContainer",
            type: "HTMLElement | null",
            description: locale === "ja" ? "+N 表示のポップオーバーを描画するポータル先です。" : "Portal container for the +N overflow popover.",
        },
        {
            name: "overflowContentSide",
            type: '"top" | "right" | "bottom" | "left"',
            default: '"bottom"',
            description: locale === "ja" ? "+N 表示のポップオーバーを開く方向です。" : "Side used by the +N overflow popover.",
        },
        {
            name: "overflowContentAlign",
            type: '"start" | "center" | "end"',
            default: '"end"',
            description: locale === "ja" ? "+N 表示のポップオーバーの揃え位置です。" : "Alignment used by the +N overflow popover.",
        },
        {
            name: "overflowContentAvoidCollisions",
            type: "boolean",
            description: locale === "ja" ? "+N 表示のポップオーバーを画面端で反転させるかどうかです。" : "Whether the +N overflow popover may flip to avoid viewport collisions.",
        },
    ];

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Avatar", href: "/docs/components/avatar" },
                { name: "AvatarGroup", href: "/docs/components/avatar-group" },
            ]}
            relatedComponents={[
                { name: "Tooltip", href: "/docs/components/tooltip" },
                { name: "HoverCard", href: "/docs/components/hover-card" },
                { name: "MetadataList", href: "/docs/components/metadata-list" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewHeight={220}>
                <AvatarGroup
                    max={5}
                    overflowTooltip={renderOverflowTooltip(LARGE_TEAM.slice(5), locale)}
                    overflowAriaLabel={
                        locale === "ja"
                            ? "メンバー一覧を表示"
                            : "Show member list"
                    }
                    overflowContent={renderMemberList(LARGE_TEAM, locale)}
                    overflowContentAlign="center"
                    overflowContentClassName="max-h-[calc(var(--radix-popover-content-available-height)-0.5rem)] w-[min(calc(100vw-2rem),18rem)] overflow-hidden"
                >
                    {LARGE_TEAM.map((member) => (
                        <Avatar
                            key={member.id}
                            aria-label={getMemberName(member, locale)}
                            tooltip={renderMemberTooltip(member, locale)}
                        >
                            <AvatarFallback>{member.initials}</AvatarFallback>
                        </Avatar>
                    ))}
                </AvatarGroup>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "overflow",
                            title: locale === "ja" ? "+N 表示" : "With +N overflow",
                            description: locale === "ja"
                                ? "max を指定すると、表示しきれない人数を +N としてまとめます。長い一覧ではツールチップを最大 5 名までに抑え、クリックでメンバー一覧を開けます。"
                                : "Set max to cap visible avatars and summarize the rest as +N. Long lists can show up to five names in the tooltip and open a member list on click.",
                            preview: (
                                <AvatarGroup
                                    max={5}
                                    overflowTooltip={renderOverflowTooltip(LARGE_TEAM.slice(5), locale)}
                                    overflowAriaLabel={
                                        locale === "ja"
                                            ? "メンバー一覧を表示"
                                            : "Show member list"
                                    }
                                    overflowContent={renderMemberList(LARGE_TEAM, locale)}
                                    overflowContentAlign="center"
                                    overflowContentClassName="max-h-[calc(var(--radix-popover-content-available-height)-0.5rem)] w-[min(calc(100vw-2rem),18rem)] overflow-hidden"
                                >
                                    {LARGE_TEAM.map((member) => (
                                        <Avatar
                                            key={member.id}
                                            aria-label={getMemberName(member, locale)}
                                            tooltip={getMemberName(member, locale)}
                                        >
                                            <AvatarFallback>{member.initials}</AvatarFallback>
                                        </Avatar>
                                    ))}
                                </AvatarGroup>
                            ),
                            code,
                        },
                        {
                            key: "tooltips",
                            title: locale === "ja" ? "名前のツールチップ" : "With name tooltips",
                            description: locale === "ja"
                                ? "省略表示でも誰か分かるように、各アバターのツールチップに名前を渡します。"
                                : "Pass a name to each Avatar tooltip so people remain identifiable.",
                            preview: (
                                <AvatarGroup
                                    max={4}
                                    overflowTooltip={renderOverflowTooltip(TEAM.slice(4), locale)}
                                    overflowAriaLabel={locale === "ja" ? "メンバー一覧を表示" : "Show member list"}
                                    overflowContent={renderMemberList(TEAM, locale)}
                                    overflowContentAlign="center"
                                    overflowContentClassName="max-h-[calc(var(--radix-popover-content-available-height)-0.5rem)] w-[min(calc(100vw-2rem),18rem)] overflow-hidden"
                                >
                                    {TEAM.map((member) => (
                                        <Avatar
                                            key={member.id}
                                            aria-label={getMemberName(member, locale)}
                                            tooltip={getMemberName(member, locale)}
                                        >
                                            <AvatarFallback>{member.initials}</AvatarFallback>
                                        </Avatar>
                                    ))}
                                </AvatarGroup>
                            ),
                            code: locale === "ja"
                                ? `import { Avatar, AvatarFallback, AvatarGroup } from "@gunjo/ui";

export function NamedAvatars({ team }) {
  return (
    <AvatarGroup max={4}>
      {team.map((member) => (
        <Avatar key={member.id} aria-label={member.name} tooltip={member.name}>
          <AvatarFallback>{member.initials}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}`
                                : `import { Avatar, AvatarFallback, AvatarGroup } from "@gunjo/ui";

export function NamedAvatars({ team }) {
  return (
    <AvatarGroup max={4}>
      {team.map((member) => (
        <Avatar key={member.id} aria-label={member.name} tooltip={member.name}>
          <AvatarFallback>{member.initials}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}`,
                        },
                        {
                            key: "presence",
                            title: locale === "ja" ? "在席表示" : "With presence",
                            description: locale === "ja"
                                ? "在席状態を表示する場合は、ツールチップに名前と状態を含めます。"
                                : "When showing presence, include both name and status in each Avatar tooltip.",
                            preview: (
                                <AvatarGroup
                                    max={4}
                                    overflowTooltip={renderOverflowTooltip(TEAM.slice(4), locale)}
                                    overflowAriaLabel={locale === "ja" ? "メンバー一覧を表示" : "Show member list"}
                                    overflowContent={renderMemberList(TEAM, locale)}
                                    overflowContentAlign="center"
                                    overflowContentClassName="max-h-[calc(var(--radix-popover-content-available-height)-0.5rem)] w-[min(calc(100vw-2rem),18rem)] overflow-hidden"
                                >
                                    {TEAM.map((member, index) => (
                                        <Avatar
                                            key={member.id}
                                            aria-label={getMemberName(member, locale)}
                                            tooltip={renderMemberTooltip(member, locale)}
                                            presence={index === 1 ? "away" : index === 2 ? "busy" : index === 3 ? "offline" : "online"}
                                            presenceLabel={getMemberStatus(member, locale)}
                                        >
                                            <AvatarFallback>{member.initials}</AvatarFallback>
                                        </Avatar>
                                    ))}
                                </AvatarGroup>
                            ),
                            code: locale === "ja"
                                ? `import { Avatar, AvatarFallback, AvatarGroup } from "@gunjo/ui";

export function PresenceAvatars({ team }) {
  return (
    <AvatarGroup max={4}>
      {team.map((member) => (
        <Avatar
          key={member.id}
          aria-label={member.name}
          tooltip={member.nameWithStatus}
          presence={member.presence}
          presenceLabel={member.statusLabel}
        >
          <AvatarFallback>{member.initials}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}`
                                : `import { Avatar, AvatarFallback, AvatarGroup } from "@gunjo/ui";

export function PresenceAvatars({ team }) {
  return (
    <AvatarGroup max={4}>
      {team.map((member) => (
        <Avatar
          key={member.id}
          aria-label={member.name}
          tooltip={member.nameWithStatus}
          presence={member.presence}
          presenceLabel={member.statusLabel}
        >
          <AvatarFallback>{member.initials}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}`,
                        },
                        {
                            key: "tight",
                            title: locale === "ja" ? "重なりを強める" : "Tighter overlap",
                            description: locale === "ja"
                                ? "表やサイドバーなど横幅が狭い場所では、overlap を大きくして省スペースにできます。"
                                : "Increase overlap for tight table cells, sidebars, or dense lists.",
                            preview: (
                                <AvatarGroup
                                    max={4}
                                    overlap={14}
                                    overflowTooltip={renderOverflowTooltip(TEAM.slice(4), locale)}
                                    overflowAriaLabel={locale === "ja" ? "メンバー一覧を表示" : "Show member list"}
                                    overflowContent={renderMemberList(TEAM, locale)}
                                    overflowContentAlign="center"
                                    overflowContentClassName="max-h-[calc(var(--radix-popover-content-available-height)-0.5rem)] w-[min(calc(100vw-2rem),18rem)] overflow-hidden"
                                >
                                    {TEAM.map((member) => (
                                        <Avatar
                                            key={member.id}
                                            aria-label={getMemberName(member, locale)}
                                            tooltip={getMemberName(member, locale)}
                                        >
                                            <AvatarFallback>{member.initials}</AvatarFallback>
                                        </Avatar>
                                    ))}
                                </AvatarGroup>
                            ),
                            code: locale === "ja"
                                ? `import { Avatar, AvatarFallback, AvatarGroup } from "@gunjo/ui";

export function CompactAvatars({ team }) {
  return (
    <AvatarGroup max={4} overlap={14}>
      {team.map((member) => (
        <Avatar key={member.id} aria-label={member.name} tooltip={member.name}>
          <AvatarFallback>{member.initials}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}`
                                : `import { Avatar, AvatarFallback, AvatarGroup } from "@gunjo/ui";

export function CompactAvatars({ team }) {
  return (
    <AvatarGroup max={4} overlap={14}>
      {team.map((member) => (
        <Avatar key={member.id} aria-label={member.name} tooltip={member.name}>
          <AvatarFallback>{member.initials}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}`,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">{locale === "ja" ? "プロパティ" : "Props"}</h2>
                <PropsTable data={propsData} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">{locale === "ja" ? "使い方" : "Usage"}</h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <CodeBlock code={usageCode} />
            </div>
        </ComponentLayout>
    );
}
