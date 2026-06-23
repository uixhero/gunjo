import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { SignedRecordDemo } from "@/components/demos/SignedRecordDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { SignedRecord, Textarea, type SignedRecordValue } from "@gunjo/ui"

const [record, setRecord] = useState<SignedRecordValue>({ status: "draft", addenda: [] })

<SignedRecord value={record} onChange={setRecord} signerId="dr-yamada" canSign={isComplete}>
  {({ readOnly }) =>
    readOnly
      ? <p>{body}</p>                                  // signed: locked, read-only
      : <Textarea value={body} onChange={onBodyChange} /> // draft: editable
  }
</SignedRecord>
// draft → 署名・確定 locks it → only addenda (author + timestamp + reason) can be appended`;

const propsData = [
  {
    name: "value",
    type: "SignedRecordValue",
    description: "Controlled state: { status: 'draft' | 'signed', signedBy?, signedAt?, addenda: SignedRecordAddendum[] }.",
  },
  {
    name: "onChange",
    type: "(value: SignedRecordValue) => void",
    description: "Notified when the record is signed or an addendum is appended.",
  },
  {
    name: "children",
    type: "({ readOnly }) => ReactNode",
    description: "Render prop for the document body. readOnly is true once signed — render the locked view vs the editable fields.",
  },
  {
    name: "signerId",
    type: "string",
    description: "The signing user's id — recorded as signedBy and each addendum's author.",
  },
  {
    name: "canSign",
    type: "boolean",
    default: "true",
    description: "Whether the record can be signed now (required sections filled).",
  },
  {
    name: "requireAddendumReason",
    type: "boolean",
    default: "true",
    description: "Require a reason on each addendum.",
  },
  {
    name: "formatTime",
    type: "(iso: string) => ReactNode",
    description: "Format an ISO timestamp for display. Default a deterministic YYYY/MM/DD HH:mm.",
  },
  {
    name: "labels",
    type: "SignedRecordLabels",
    description: "Localized strings (draft / signed / sign / locked / addendum composer …).",
  },
];

export default function SignedRecordDocPage() {
  const title = meta.signedRecord.title ?? "SignedRecord";
  const description = meta.signedRecord.description ?? "";

  return (
    <ComponentLayout title={title} description={description}>
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <SignedRecordDemo />
      </ComponentPreview>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">Props</h2>
        <PropsTable data={propsData} />
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">Usage</h2>
        <div className="rounded-md border bg-muted font-mono text-sm max-h-[350px] overflow-auto">
          <CodeBlock code={usageCode} />
        </div>
      </div>
    </ComponentLayout>
  );
}
