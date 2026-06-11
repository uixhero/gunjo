"use client";

import { Avatar, AvatarFallback, AvatarGroup } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

const TEAM = [
    { initials: { ja: "青", en: "AH" }, name: { ja: "青井 花", en: "Aoi Hana" } },
    { initials: { ja: "田", en: "ST" }, name: { ja: "田中 空", en: "Sora Tanaka" } },
    { initials: { ja: "山", en: "YY" }, name: { ja: "山本 優", en: "Yu Yamamoto" } },
    { initials: { ja: "小", en: "MK" }, name: { ja: "小林 真央", en: "Mao Kobayashi" } },
    { initials: { ja: "中", en: "RN" }, name: { ja: "中村 蓮", en: "Ren Nakamura" } },
    { initials: { ja: "伊", en: "RI" }, name: { ja: "伊藤 莉子", en: "Riko Ito" } },
];

export function AvatarGroupDemo() {
    const { locale } = useLocale();
    const getName = (member: (typeof TEAM)[number]) => locale === "ja" ? member.name.ja : member.name.en;
    const getInitials = (member: (typeof TEAM)[number]) => locale === "ja" ? member.initials.ja : member.initials.en;

    return (
        <div className="flex flex-col gap-4">
            <div>
                <p className="mb-2 text-xs text-muted-foreground">{locale === "ja" ? "全員表示" : "All visible"}</p>
                <AvatarGroup>
                    {TEAM.slice(0, 4).map((member) => (
                        <Avatar key={getName(member)} aria-label={getName(member)} tooltip={getName(member)}>
                            <AvatarFallback>{getInitials(member)}</AvatarFallback>
                        </Avatar>
                    ))}
                </AvatarGroup>
            </div>
            <div>
                <p className="mb-2 text-xs text-muted-foreground">
                    {locale === "ja" ? "max=3 で +N 表示" : "max=3 with +N overflow"}
                </p>
                <AvatarGroup
                    max={3}
                    overflowAriaLabel={
                        locale === "ja"
                            ? "メンバー一覧を表示"
                            : "Show member list"
                    }
                    overflowTooltip={
                        locale === "ja"
                            ? `非表示: ${TEAM.slice(3).map(getName).join(" / ")}`
                            : `Hidden: ${TEAM.slice(3).map(getName).join(" / ")}`
                    }
                    overflowContent={
                        <div className="overflow-hidden rounded-md">
                            <div className="border-b px-4 py-3 text-sm font-medium">
                                {locale === "ja" ? "メンバー一覧" : "Member list"}
                            </div>
                            <div className="max-h-[min(14rem,calc(var(--radix-popover-content-available-height)-4rem))] overflow-y-auto p-2">
                                {TEAM.map((member) => (
                                    <div
                                        key={getName(member)}
                                        className="flex min-w-0 items-center gap-3 rounded-md px-2 py-2 text-sm"
                                    >
                                        <Avatar className="h-8 w-8" aria-hidden="true">
                                            <AvatarFallback className="text-xs">{getInitials(member)}</AvatarFallback>
                                        </Avatar>
                                        <span className="truncate">{getName(member)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                    overflowContentAlign="center"
                    overflowContentClassName="max-h-[calc(var(--radix-popover-content-available-height)-0.5rem)] w-[min(calc(100vw-2rem),18rem)] overflow-hidden"
                >
                    {TEAM.map((member) => (
                        <Avatar key={getName(member)} aria-label={getName(member)} tooltip={getName(member)}>
                            <AvatarFallback>{getInitials(member)}</AvatarFallback>
                        </Avatar>
                    ))}
                </AvatarGroup>
            </div>
        </div>
    );
}
