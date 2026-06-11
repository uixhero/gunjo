import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ChatTemplateDemo } from "@/components/demos/TemplateDemos";
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
    return (
        <ComponentLayout
            title={patternsMetadata.chatTemplate.title}
            description={patternsMetadata.chatTemplate.description}
            usedComponents={[
                { name: "Button", href: "/docs/components/button" },
                { name: "Input", href: "/docs/components/input" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/chat" code={usageCode} fullPagePreview codeBlock={<CodeBlock code={usageCode} />}>
                <div className="w-full overflow-hidden rounded-lg border shadow-sm">
                    <ChatTemplateDemo />
                </div>
            </ComponentPreview>

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
