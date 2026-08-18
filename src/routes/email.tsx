import { createFileRoute } from "@tanstack/react-router";

import { AppShell, PageHeader } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      {
        name: "description",
        content:
          "Draft professional workplace emails in seconds with structured AI prompts and fully editable output.",
      },
      { property: "og:title", content: "Smart Email Generator — Workplace AI" },
      {
        property: "og:description",
        content: "Generate clear, on-tone work emails with AI and edit them before sending.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Communication"
        title="Smart Email Generator"
        description="Describe the situation and let AI draft a clear, professional email. Every draft is editable before you send it."
      />
      <ToolWorkspace
        outputTitle="Email draft"
        submitLabel="Draft email"
        system="You are an expert business communication assistant. Write clear, concise, professional emails. Use a subject line, greeting, short paragraphs, and a sign-off. Never invent facts, dates, names, or commitments that were not provided — use [bracketed placeholders] instead."
        fields={[
          { name: "recipient", label: "Recipient & relationship", type: "text", placeholder: "e.g. Client, Sarah at Acme", required: true },
          { name: "purpose", label: "Purpose / key points", type: "textarea", placeholder: "e.g. Project delayed by 3 days, propose new deadline, request approval", required: true, rows: 5 },
          { name: "tone", label: "Tone", type: "select", options: ["Professional", "Friendly", "Formal", "Direct", "Apologetic", "Persuasive"] },
          { name: "length", label: "Length", type: "select", options: ["Short", "Medium", "Detailed"] },
        ]}
        buildPrompt={(v) =>
          [
            "Write a workplace email.",
            `Recipient: ${v['recipient']}`,
            `Purpose and key points: ${v['purpose']}`,
            `Tone: ${v['tone']}`,
            `Length: ${v['length']}`,
            "Return: subject line, then the email body in markdown. Mark unknown details as [placeholder].",
          ].join("\n")
        }
      />
    </AppShell>
  );
}