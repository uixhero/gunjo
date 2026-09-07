"use client";

import { Button, ChatTemplate, Input } from "@gunjo/ui";
import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ChatTemplateDemo } from "@/components/demos/TemplateDemos";
import { useLocale } from "@/components/providers/LocaleProvider";
import patternsMetadata from "@design/patterns-metadata.json";

const usageCode = `import { ChatTemplate, Button, Input } from "@gunjo/ui";

export function ChatPage() {
  return (
    <div className="h-screen">
      <ChatTemplate
        sidebarList={
           <div className="w-full flex-1 p-4">
              <div className="font-bold mb-4">Channels</div>
              {/* List of channels/users */}
           </div>
        }
        header={
           <div className="flex items-center justify-between w-full">
              <span className="font-bold">#general</span>
              <Button variant="ghost" size="icon">Settings</Button>
           </div>
        }
        composer={
           <div className="flex gap-2">
               <Input placeholder="Type a message..." />
               <Button>Send</Button>
           </div>
        }
        sidebarDetail={
           <div className="p-4">
              <h3 className="font-bold">Thread Details</h3>
           </div>
        }
      >
        <div className="flex flex-col gap-4">
           {/* Message List */}
           <div className="bg-muted p-3 rounded-lg max-w-[80%] self-start">
              Hello! This is a chat template.
           </div>
           <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[80%] self-end">
              Looks great!
           </div>
        </div>
      </ChatTemplate>
    </div>
  )
}`;

const propsData = [
    {
        name: "sidebarList",
        type: "React.ReactNode",
        description: "Content for the left sidebar (e.g., channel list, user list).",
    },
    {
        name: "sidebarDetail",
        type: "React.ReactNode",
        description: "Content for the right sidebar (e.g., active thread, user profile).",
    },
    {
        name: "header",
        type: "React.ReactNode",
        description: "Content for the chat header (e.g., channel name, actions).",
    },
    {
        name: "children",
        type: "React.ReactNode",
        description: "The main content area (message stream).",
    },
    {
        name: "composer",
        type: "React.ReactNode",
        description: "Content for the message composer area at the bottom.",
    },
    {
        name: "className",
        type: "string",
        description: "Additional classes for the root container.",
    }
];

export default function ChatPage() {
    const { locale } = useLocale();

    const messages = (
        <div className="flex flex-col gap-3">
            <div className="max-w-[80%] self-start rounded-lg bg-muted p-3 text-sm">
                {locale === "ja" ? "配色の見直し、今日中に上げます。" : "I will have the palette revision up today."}
            </div>
            <div className="max-w-[80%] self-end rounded-lg bg-primary p-3 text-sm text-primary-foreground">
                {locale === "ja" ? "助かります。急ぎではないです。" : "Thanks. No rush on it."}
            </div>
        </div>
    );

    const channels = (
        <div className="space-y-1 p-3">
            <p className="px-1 pb-2 text-xs font-semibold uppercase text-muted-foreground">
                {locale === "ja" ? "チャンネル" : "Channels"}
            </p>
            {["#general", "#design", "#release"].map((channel, index) => (
                <div key={channel} className={index === 0 ? "rounded bg-accent px-2 py-1 text-sm" : "rounded px-2 py-1 text-sm text-muted-foreground"}>
                    {channel}
                </div>
            ))}
        </div>
    );

    const chatHeader = (
        <div className="flex w-full items-center justify-between">
            <span className="font-semibold">#general</span>
            <Button variant="ghost" size="sm">{locale === "ja" ? "詳細" : "Details"}</Button>
        </div>
    );

    const composer = (
        <div className="flex gap-2">
            <Input placeholder={locale === "ja" ? "メッセージを入力" : "Type a message"} />
            <Button>{locale === "ja" ? "送信" : "Send"}</Button>
        </div>
    );

    return (
        <ComponentLayout
            title={patternsMetadata.chatTemplate.title}
            description={patternsMetadata.chatTemplate.description}
            usedComponents={[
                { name: "Button", href: "/docs/components/button" },
                { name: "Input", href: "/docs/components/input" },
            ]}
            relatedComponents={[
                { name: "ChatPanel", href: "/docs/components/chat-panel" },
                { name: "ChatMessage", href: "/docs/components/chat-message" },
                { name: "ChatComposer", href: "/docs/components/chat-composer" },
                { name: "ChatInput", href: "/docs/components/chat-input" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/chat" code={usageCode} fullPagePreview codeBlock={<CodeBlock code={usageCode} />}>
                <div className="w-full overflow-hidden rounded-lg border shadow-sm">
                    <ChatTemplateDemo />
                </div>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {locale === "ja"
                        ? "4つの口はどれも省略できます。左の一覧は中くらいの幅から、右の詳細はかなり広い幅から現れるので、狭い画面では真ん中の流れだけが残ります。"
                        : "All four slots are optional. The left list appears from medium widths and the right detail pane only on very wide ones, so narrow screens keep just the message stream."}
                </p>
                <ComponentDemoStates
                    states={[
                        {
                            key: "three-panes",
                            title: locale === "ja" ? "3つの段" : "Three panes",
                            description: locale === "ja"
                                ? "一覧・流れ・詳細をそろえた最も広い形です。右の詳細は横幅がかなり広いときだけ出ます。"
                                : "List, stream, and detail together — the widest arrangement. The detail pane only appears on very wide screens.",
                            preview: (
                                <ChatTemplate
                                    className="h-auto"
                                    sidebarList={channels}
                                    header={chatHeader}
                                    composer={composer}
                                    sidebarDetail={
                                        <div className="space-y-2 p-4">
                                            <p className="text-sm font-semibold">{locale === "ja" ? "この会話について" : "About this thread"}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {locale === "ja" ? "参加者 3人" : "3 participants"}
                                            </p>
                                        </div>
                                    }
                                >
                                    {messages}
                                </ChatTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { Button, ChatTemplate, Input } from "@gunjo/ui";

const CHANNELS = ["#general", "#design", "#release"];

export function ThreePaneChat() {
  return (
    <ChatTemplate
      className="h-auto"
      sidebarList={
        <div className="space-y-1 p-3">
          {CHANNELS.map((channel) => (
            <div key={channel} className="rounded px-2 py-1 text-sm text-muted-foreground">{channel}</div>
          ))}
        </div>
      }
      header={<span className="font-semibold">#general</span>}
      sidebarDetail={<div className="p-4 text-sm text-muted-foreground">参加者 3人</div>}
      composer={
        <div className="flex gap-2">
          <Input placeholder="メッセージを入力" />
          <Button>送信</Button>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="max-w-[80%] self-start rounded-lg bg-muted p-3 text-sm">
          配色の見直し、今日中に上げます。
        </div>
      </div>
    </ChatTemplate>
  );
}`
                                : `import { Button, ChatTemplate, Input } from "@gunjo/ui";

const CHANNELS = ["#general", "#design", "#release"];

export function ThreePaneChat() {
  return (
    <ChatTemplate
      className="h-auto"
      sidebarList={
        <div className="space-y-1 p-3">
          {CHANNELS.map((channel) => (
            <div key={channel} className="rounded px-2 py-1 text-sm text-muted-foreground">{channel}</div>
          ))}
        </div>
      }
      header={<span className="font-semibold">#general</span>}
      sidebarDetail={<div className="p-4 text-sm text-muted-foreground">3 participants</div>}
      composer={
        <div className="flex gap-2">
          <Input placeholder="Type a message" />
          <Button>Send</Button>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="max-w-[80%] self-start rounded-lg bg-muted p-3 text-sm">
          I will have the palette revision up today.
        </div>
      </div>
    </ChatTemplate>
  );
}`,
                        },
                        {
                            key: "two-panes",
                            title: locale === "ja" ? "詳細を外す" : "Without the detail pane",
                            description: locale === "ja"
                                ? "sidebarDetail を省くと、流れが右まで広がります。会話の中身に集中させたいときの形です。"
                                : "Drop sidebarDetail and the stream takes the full width. Use it when the conversation is the only thing that matters.",
                            preview: (
                                <ChatTemplate className="h-auto" sidebarList={channels} header={chatHeader} composer={composer}>
                                    {messages}
                                </ChatTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { Button, ChatTemplate, Input } from "@gunjo/ui";

const CHANNELS = ["#general", "#design", "#release"];

export function TwoPaneChat() {
  return (
    <ChatTemplate
      className="h-auto"
      sidebarList={
        <div className="space-y-1 p-3">
          {CHANNELS.map((channel) => (
            <div key={channel} className="rounded px-2 py-1 text-sm text-muted-foreground">{channel}</div>
          ))}
        </div>
      }
      header={<span className="font-semibold">#general</span>}
      composer={
        <div className="flex gap-2">
          <Input placeholder="メッセージを入力" />
          <Button>送信</Button>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="max-w-[80%] self-start rounded-lg bg-muted p-3 text-sm">
          配色の見直し、今日中に上げます。
        </div>
      </div>
    </ChatTemplate>
  );
}`
                                : `import { Button, ChatTemplate, Input } from "@gunjo/ui";

const CHANNELS = ["#general", "#design", "#release"];

export function TwoPaneChat() {
  return (
    <ChatTemplate
      className="h-auto"
      sidebarList={
        <div className="space-y-1 p-3">
          {CHANNELS.map((channel) => (
            <div key={channel} className="rounded px-2 py-1 text-sm text-muted-foreground">{channel}</div>
          ))}
        </div>
      }
      header={<span className="font-semibold">#general</span>}
      composer={
        <div className="flex gap-2">
          <Input placeholder="Type a message" />
          <Button>Send</Button>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="max-w-[80%] self-start rounded-lg bg-muted p-3 text-sm">
          I will have the palette revision up today.
        </div>
      </div>
    </ChatTemplate>
  );
}`,
                        },
                        {
                            key: "read-only",
                            title: locale === "ja" ? "書き込み欄なし" : "Read only",
                            description: locale === "ja"
                                ? "composer を省くと入力欄が消え、読むだけの画面になります。過去ログや、権限の無い人に見せる画面に使います。"
                                : "Drop composer and the input disappears, leaving a read-only view. Use it for archives, or for people without permission to post.",
                            preview: (
                                <ChatTemplate className="h-auto" sidebarList={channels} header={chatHeader}>
                                    {messages}
                                </ChatTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { ChatTemplate } from "@gunjo/ui";

const CHANNELS = ["#general", "#design", "#release"];

export function ReadOnlyChat() {
  return (
    <ChatTemplate
      className="h-auto"
      sidebarList={
        <div className="space-y-1 p-3">
          {CHANNELS.map((channel) => (
            <div key={channel} className="rounded px-2 py-1 text-sm text-muted-foreground">{channel}</div>
          ))}
        </div>
      }
      header={<span className="font-semibold">#general</span>}
    >
      <div className="flex flex-col gap-3">
        <div className="max-w-[80%] self-start rounded-lg bg-muted p-3 text-sm">
          配色の見直し、今日中に上げます。
        </div>
      </div>
    </ChatTemplate>
  );
}`
                                : `import { ChatTemplate } from "@gunjo/ui";

const CHANNELS = ["#general", "#design", "#release"];

export function ReadOnlyChat() {
  return (
    <ChatTemplate
      className="h-auto"
      sidebarList={
        <div className="space-y-1 p-3">
          {CHANNELS.map((channel) => (
            <div key={channel} className="rounded px-2 py-1 text-sm text-muted-foreground">{channel}</div>
          ))}
        </div>
      }
      header={<span className="font-semibold">#general</span>}
    >
      <div className="flex flex-col gap-3">
        <div className="max-w-[80%] self-start rounded-lg bg-muted p-3 text-sm">
          I will have the palette revision up today.
        </div>
      </div>
    </ChatTemplate>
  );
}`,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Props</h2>
                <PropsTable data={propsData} />
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Usage</h2>
                <CodeBlock code={usageCode} language="tsx" />
            </div>
        </ComponentLayout>
    );
}
