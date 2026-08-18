import { createFileRoute } from "@tanstack/react-router";

import { AppShell, PageHeader } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Community Kitchen Soup" },
      {
        name: "description",
        content:
          "Turn raw meeting notes or transcripts into structured summaries, decisions, and action items with AI.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Community Kitchen Soup" },
      {
        property: "og:description",
        content: "Paste messy notes and get a clean summary with decisions and owners.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Meetings"
        title="Meeting Notes Summarizer"
        description="Paste raw notes or a transcript and get a structured summary with decisions, action items, and owners."
      />
      <ToolWorkspace
        outputTitle="Meeting summary"
        submitLabel="Summarize notes"
        system="You are a meeting analyst. Summarize notes faithfully using only the information given. Output markdown with sections: Summary, Key Decisions, Action Items (owner + due date when stated), Risks / Open Questions, Suggested Follow-ups. If something is unclear, list it under Open Questions instead of guessing."
        fields={[
          { name: "title", label: "Meeting title", type: "text", placeholder: "e.g. Q3 roadmap review" },
          { name: "attendees", label: "Attendees", type: "text", placeholder: "e.g. Zizipho, Sarah, Dev team" },
          { name: "notes", label: "Raw notes or transcript", type: "textarea", placeholder: "Paste your notes here…", required: true, rows: 10 },
          { name: "focus", label: "Summary focus", type: "select", options: ["Balanced", "Action items only", "Decisions only", "Executive brief"] },
        ]}
        buildPrompt={(v) =>
          [
            "Summarize the following meeting notes.",
            `Meeting: ${v['title'] || "(not provided)"}`,
            `Attendees: ${v['attendees'] || "(not provided)"}`,
            `Focus: ${v['focus']}`,
            "Notes:",
            v['notes'] ?? "",
          ].join("\n")
        }
      />
    </AppShell>
  );
}