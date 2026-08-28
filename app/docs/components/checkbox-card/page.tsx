"use client";

import * as React from "react";
import { IconDeviceTv, IconParking, IconSmokingNo, IconWifi } from "@tabler/icons-react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import displayMetadata from "@design/display-metadata.json";
import { Badge, CheckboxCard, CheckboxCardGroup } from "@gunjo/ui";

type Locale = "ja" | "en";

function addons(locale: Locale) {
  return locale === "ja"
    ? [
        { value: "insurance", title: "旅行保険", description: "ケガ・キャンセルを補償", price: "¥500", tag: <Badge variant="info">人気</Badge> },
        { value: "seat", title: "座席指定", description: "窓側・通路側を選択", price: "¥300" },
        { value: "meal", title: "機内食", description: "和食 / 洋食から選択", price: "¥1,200", highlight: "予約で¥200おトク" },
        { value: "lounge", title: "ラウンジ利用", description: "出発ラウンジ 1回", price: "¥2,000", disabled: true, disabledReason: "このプランでは追加できません。" },
      ]
    : [
        { value: "insurance", title: "Travel insurance", description: "Injury & cancellation cover", price: "$5", tag: <Badge variant="info">Popular</Badge> },
        { value: "seat", title: "Seat selection", description: "Choose window or aisle", price: "$3" },
        { value: "meal", title: "In-flight meal", description: "Japanese or Western", price: "$12", highlight: "$2 off when pre-ordered" },
        { value: "lounge", title: "Lounge access", description: "One departure lounge visit", price: "$20", disabled: true, disabledReason: "Not available on this plan." },
      ];
}

function CheckboxCardPreview({ locale }: { locale: Locale }) {
  const [selected, setSelected] = React.useState<string[]>(["insurance"]);
  return (
    <div className="w-full max-w-md">
      <CheckboxCardGroup value={selected} onValueChange={setSelected} aria-label={locale === "ja" ? "追加オプション" : "Add-ons"} name="addons">
        {addons(locale).map((a) => (
          <CheckboxCard
            key={a.value}
            value={a.value}
            title={a.title}
            description={a.description}
            price={a.price}
            highlight={a.highlight}
            tags={a.tag}
            disabled={a.disabled}
            disabledReason={a.disabledReason}
          />
        ))}
      </CheckboxCardGroup>
    </div>
  );
}

function ConditionsPreview({ locale }: { locale: Locale }) {
  const [selected, setSelected] = React.useState<string[]>(["breakfast"]);
  const conditions =
    locale === "ja"
      ? [
          { value: "breakfast", title: "朝食つき" },
          { value: "cancel", title: "直前まで取り消せる" },
          { value: "late", title: "18時以降に着く" },
        ]
      : [
          { value: "breakfast", title: "Breakfast included" },
          { value: "cancel", title: "Free cancellation" },
          { value: "late", title: "Late arrival" },
        ];
  return (
    <div className="w-full max-w-md">
      <CheckboxCardGroup
        value={selected}
        onValueChange={setSelected}
        aria-label={locale === "ja" ? "絞り込みの条件" : "Filters"}
      >
        {conditions.map((c) => (
          <CheckboxCard key={c.value} value={c.value} title={c.title} />
        ))}
      </CheckboxCardGroup>
    </div>
  );
}

function AmenitiesPreview({ locale }: { locale: Locale }) {
  const [selected, setSelected] = React.useState<string[]>(["wifi", "parking"]);
  const amenities =
    locale === "ja"
      ? [
          { value: "wifi", title: "Wi-Fi", description: "全室で使えます", icon: <IconWifi className="size-5 text-muted-foreground" /> },
          { value: "parking", title: "駐車場", description: "1台まで無料", icon: <IconParking className="size-5 text-muted-foreground" /> },
          { value: "tv", title: "テレビ", description: "地上波と BS", icon: <IconDeviceTv className="size-5 text-muted-foreground" /> },
          { value: "nonsmoking", title: "禁煙", description: "喫煙所は1階です", icon: <IconSmokingNo className="size-5 text-muted-foreground" /> },
        ]
      : [
          { value: "wifi", title: "Wi-Fi", description: "In every room", icon: <IconWifi className="size-5 text-muted-foreground" /> },
          { value: "parking", title: "Parking", description: "One car, no charge", icon: <IconParking className="size-5 text-muted-foreground" /> },
          { value: "tv", title: "Television", description: "Terrestrial and satellite", icon: <IconDeviceTv className="size-5 text-muted-foreground" /> },
          { value: "nonsmoking", title: "Non-smoking", description: "Smoking area on floor 1", icon: <IconSmokingNo className="size-5 text-muted-foreground" /> },
        ];
  return (
    <div className="w-full max-w-md">
      <CheckboxCardGroup
        value={selected}
        onValueChange={setSelected}
        aria-label={locale === "ja" ? "設備" : "Amenities"}
      >
        {amenities.map((a) => (
          <CheckboxCard key={a.value} value={a.value} title={a.title} description={a.description} leading={a.icon} />
        ))}
      </CheckboxCardGroup>
    </div>
  );
}

const usageCode = `import * as React from "react";
import { Badge, CheckboxCard, CheckboxCardGroup } from "@gunjo/ui";

const addons = [
  { value: "insurance", title: "Travel insurance", description: "Injury & cancellation cover", price: "$5", tag: <Badge variant="info">Popular</Badge> },
  { value: "seat", title: "Seat selection", description: "Choose window or aisle", price: "$3" },
  { value: "meal", title: "In-flight meal", description: "Japanese or Western", price: "$12", highlight: "$2 off when pre-ordered" },
  { value: "lounge", title: "Lounge access", description: "One departure lounge visit", price: "$20", disabled: true, disabledReason: "Not available on this plan." },
];

export function AddonPicker() {
  const [selected, setSelected] = React.useState<string[]>(["insurance"]);
  return (
    <CheckboxCardGroup value={selected} onValueChange={setSelected} aria-label="Add-ons" name="addons">
      {addons.map((a) => (
        <CheckboxCard
          key={a.value}
          value={a.value}
          title={a.title}
          description={a.description}
          price={a.price}
          tags={a.tag}
          highlight={a.highlight}
          disabled={a.disabled}
          disabledReason={a.disabledReason}
        />
      ))}
    </CheckboxCardGroup>
  );
}`;

const conditionsCodeJa = `import * as React from "react";
import { CheckboxCard, CheckboxCardGroup } from "@gunjo/ui";

const CONDITIONS = [
  { value: "breakfast", title: "朝食つき" },
  { value: "cancel", title: "直前まで取り消せる" },
  { value: "late", title: "18時以降に着く" },
];

export function ConditionFilters() {
  const [selected, setSelected] = React.useState<string[]>(["breakfast"]);
  return (
    <CheckboxCardGroup value={selected} onValueChange={setSelected} aria-label="絞り込みの条件">
      {CONDITIONS.map((c) => (
        <CheckboxCard key={c.value} value={c.value} title={c.title} />
      ))}
    </CheckboxCardGroup>
  );
}`;

const conditionsCodeEn = `import * as React from "react";
import { CheckboxCard, CheckboxCardGroup } from "@gunjo/ui";

const CONDITIONS = [
  { value: "breakfast", title: "Breakfast included" },
  { value: "cancel", title: "Free cancellation" },
  { value: "late", title: "Late arrival" },
];

export function ConditionFilters() {
  const [selected, setSelected] = React.useState<string[]>(["breakfast"]);
  return (
    <CheckboxCardGroup value={selected} onValueChange={setSelected} aria-label="Filters">
      {CONDITIONS.map((c) => (
        <CheckboxCard key={c.value} value={c.value} title={c.title} />
      ))}
    </CheckboxCardGroup>
  );
}`;

const amenitiesCodeJa = `import * as React from "react";
import {
  IconDeviceTv,
  IconParking,
  IconSmokingNo,
  IconWifi,
} from "@tabler/icons-react";
import { CheckboxCard, CheckboxCardGroup } from "@gunjo/ui";

const AMENITIES = [
  { value: "wifi", title: "Wi-Fi", description: "全室で使えます", Icon: IconWifi },
  { value: "parking", title: "駐車場", description: "1台まで無料", Icon: IconParking },
  { value: "tv", title: "テレビ", description: "地上波と BS", Icon: IconDeviceTv },
  {
    value: "nonsmoking",
    title: "禁煙",
    description: "喫煙所は1階です",
    Icon: IconSmokingNo,
  },
];

export function AmenityPicker() {
  const [selected, setSelected] = React.useState<string[]>(["wifi", "parking"]);
  return (
    <CheckboxCardGroup value={selected} onValueChange={setSelected} aria-label="設備">
      {AMENITIES.map(({ Icon, ...a }) => (
        <CheckboxCard
          key={a.value}
          value={a.value}
          title={a.title}
          description={a.description}
          leading={<Icon className="size-5 text-muted-foreground" />}
        />
      ))}
    </CheckboxCardGroup>
  );
}`;

const amenitiesCodeEn = `import * as React from "react";
import {
  IconDeviceTv,
  IconParking,
  IconSmokingNo,
  IconWifi,
} from "@tabler/icons-react";
import { CheckboxCard, CheckboxCardGroup } from "@gunjo/ui";

const AMENITIES = [
  { value: "wifi", title: "Wi-Fi", description: "In every room", Icon: IconWifi },
  {
    value: "parking",
    title: "Parking",
    description: "One car, no charge",
    Icon: IconParking,
  },
  {
    value: "tv",
    title: "Television",
    description: "Terrestrial and satellite",
    Icon: IconDeviceTv,
  },
  {
    value: "nonsmoking",
    title: "Non-smoking",
    description: "Smoking area on floor 1",
    Icon: IconSmokingNo,
  },
];

export function AmenityPicker() {
  const [selected, setSelected] = React.useState<string[]>(["wifi", "parking"]);
  return (
    <CheckboxCardGroup value={selected} onValueChange={setSelected} aria-label="Amenities">
      {AMENITIES.map(({ Icon, ...a }) => (
        <CheckboxCard
          key={a.value}
          value={a.value}
          title={a.title}
          description={a.description}
          leading={<Icon className="size-5 text-muted-foreground" />}
        />
      ))}
    </CheckboxCardGroup>
  );
}`;

export default function CheckboxCardDocPage() {
  const { locale, sectionLabels } = useLocale();

  const propsData =
    locale === "ja"
      ? [
          { name: "CheckboxCardGroup value / defaultValue", type: "string[]", description: "選択中の値の集合。制御(value)・非制御(defaultValue)どちらも可。" },
          { name: "CheckboxCardGroup onValueChange", type: "(value: string[]) => void", description: "選択が変わるたびに新しい配列で呼ばれます。" },
          { name: "CheckboxCardGroup name", type: "string", description: "各カードが hidden checkbox を出力し、フォーム送信に載せます。" },
          { name: "value", type: "string", description: "このカードが選択にトグルする値です。" },
          { name: "title", type: "ReactNode", description: "主行（オプション名）。" },
          { name: "description", type: "ReactNode", description: "副行（条件・期間など）。" },
          { name: "tags / price / highlight / leading", type: "ReactNode", description: "チップ列・価格・おトク訴求・先頭アクセサリ（RadioCard と同じ body スロット）。" },
          { name: "disabled / disabledReason", type: "boolean / ReactNode", description: "選択不可＋理由をツールチップで説明します。" },
        ]
      : [
          { name: "CheckboxCardGroup value / defaultValue", type: "string[]", description: "Selected values. Controlled (value) or uncontrolled (defaultValue)." },
          { name: "CheckboxCardGroup onValueChange", type: "(value: string[]) => void", description: "Called with the new array whenever the selection changes." },
          { name: "CheckboxCardGroup name", type: "string", description: "Each card emits a hidden checkbox so the selection posts with a form." },
          { name: "value", type: "string", description: "The value this card toggles in the selection." },
          { name: "title", type: "ReactNode", description: "Primary line (option name)." },
          { name: "description", type: "ReactNode", description: "Secondary line (conditions, period)." },
          { name: "tags / price / highlight / leading", type: "ReactNode", description: "Chip row, price, savings hook, leading accessory (same body slots as RadioCard)." },
          { name: "disabled / disabledReason", type: "boolean / ReactNode", description: "Disables selection and explains why with a tooltip." },
        ];

  return (
    <ComponentLayout
      title={displayMetadata.checkboxCard.title ?? "CheckboxCard"}
      description={displayMetadata.checkboxCard.description ?? ""}
      sectionLabels={sectionLabels}
      usedComponents={[{ name: "CheckboxCard", href: "/docs/components/checkbox-card" }, { name: "CheckboxCardGroup", href: "/docs/components/checkbox-card" }, { name: "Badge", href: "/docs/components/badge" }]}
      relatedComponents={[{ name: "RadioCard", href: "/docs/components/radio-card" }, { name: "Checkbox", href: "/docs/components/checkbox" }, { name: "ListCard", href: "/docs/components/list-card" }]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="md">
        <CheckboxCardPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "multi",
              title: locale === "ja" ? "複数選択" : "Multi-select",
              description: locale === "ja" ? "RadioCard と違い、複数を同時に選べます。選択はスクエアのチェックで示します。" : "Unlike RadioCard, several can be selected at once; the selection is marked by a square check.",
              preview: <CheckboxCardPreview locale={locale} />,
              code: usageCode,
              previewBodyWidth: "md",
            },
            {
              key: "title-only",
              title: locale === "ja" ? "見出しだけの一片" : "Title only",
              description: locale === "ja"
                ? "説明・価格・チップはどれも省けます。絞り込みの条件のように読む言葉が短いときは title だけにして、44px の下限で一片の高さを保ちます。"
                : "Description, price and chips are all optional. For short filter labels, pass only title — the 44px minimum keeps the card a comfortable target.",
              preview: <ConditionsPreview locale={locale} />,
              code: locale === "ja" ? conditionsCodeJa : conditionsCodeEn,
              previewBodyWidth: "md",
            },
            {
              key: "leading",
              title: locale === "ja" ? "先頭に印を置く" : "A leading mark",
              description: locale === "ja"
                ? "leading はチェックの右、見出しの左に入ります。設備のように「言葉より印のほうが早く見分けられる」一覧で使います。チェックの位置は動きません。"
                : "leading sits between the check and the title. Use it where a mark reads faster than a word — amenities, file types — without moving the check.",
              preview: <AmenitiesPreview locale={locale} />,
              code: locale === "ja" ? amenitiesCodeJa : amenitiesCodeEn,
              previewBodyWidth: "md",
            },
          ]}
        />
      </section>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
          {sectionLabels.props}
        </h2>
        <PropsTable data={propsData} />
      </section>

      <section className="space-y-4">
        <div className="flex items-start justify-between gap-3 border-b pb-2">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
            {sectionLabels.usage}
          </h2>
          <CodeCopyButton code={usageCode} />
        </div>
        <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
          <CodeBlock code={usageCode} />
        </div>
      </section>
      <section className="space-y-4">
        <div className="border-b pb-2">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
            {locale === "ja" ? "設計の判断" : "Design decisions"}
          </h2>
        </div>
        {locale === "ja" ? (
          <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>カードの見た目でも、中身はチェックボックスにした。</strong>一片は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="checkbox"'}</code> と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-checked</code> を持つ本物の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">button</code> で、高さは 44px 以上を確保しています。資料の「カード全体を押せるようにする」を、リンクではなくチェックボックスとして実装した形です。
            </li>
            <li>
              <strong>矢印キーは付けていない。</strong>兄弟の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">RadioCard</code> は矢印キーで移動できますが、こちらは1つずつが独立して選べるので、それぞれが自分の Tab 停止位置を持ちます（WAI-ARIA のチェックボックスの型）。同じ見た目でも、キーボードの動きは意味に合わせて変えています。
            </li>
            <li>
              <strong>選択の印は四角いチェックで、色に頼らない。</strong>選ばれた状態は、枠の色・輪郭・四角いチェックの3つで同時に出ます。選べないカードには <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">disabledReason</code> を渡すと、理由がツールチップで読めます。押せない理由を画面に出さずに済ませないためです。
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
          </ul>
        ) : (
          <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>It looks like a card but behaves like a checkbox.</strong> Each card is a real <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">button</code> carrying <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="checkbox"'}</code> and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-checked</code>, with a 44px minimum height. That is GUNJO&rsquo;s reading of the article&rsquo;s whole-card-clickable rule: implemented as a checkbox, not as a link.
            </li>
            <li>
              <strong>No arrow-key navigation here.</strong> Its twin <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">RadioCard</code> moves with arrow keys; this one does not, because checkboxes are independent, so every card is its own tab stop (the WAI-ARIA checkbox pattern). Same look, different keyboard behaviour, decided by meaning.
            </li>
            <li>
              <strong>Selection is marked with a square check, never colour alone.</strong> A selected card shows the coloured border, the ring and the square check together. Pass <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">disabledReason</code> on a card that cannot be chosen and the reason is readable in a tooltip, so an unavailable option never sits there unexplained.
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
          </ul>
        )}
      </section>
    </ComponentLayout>
  );
}
