import { createFileRoute } from "@tanstack/react-router";

import { AppShell, PageHeader } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workplace AI" },
      {
        name: "description",
        content:
          "Get structured briefings, comparisons, and talking points on any work topic, with clearly flagged uncertainty.",
      },
      { property: "og:title", content: "AI Research Assistant — Workplace AI" },
      {
        property: "og:description",
        content: "Structured research briefings for work topics, with uncertainty flagged.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Research"
        title="AI Research Assistant"
        description="Get a structured briefing on any work topic. The assistant flags what is uncertain so you know what to verify."
      />
      <ToolWorkspace
        outputTitle="Research briefing"
        submitLabel="Research topic"
        system="You are a rigorous research assistant without live web access. Produce a markdown briefing: Overview, Key Points, Comparison or Options (if relevant), What to Verify, Suggested Next Steps. Clearly label anything time-sensitive or uncertain as 'needs verification'. Never fabricate statistics, citations, or sources."
        fields={[
          { name: "topic", label: "Topic or question", type: "textarea", placeholder: "e.g. Best practices for hybrid team performance reviews", required: true, rows: 4 },
          { name: "audience", label: "Audience", type: "text", placeholder: "e.g. Exec team, HR managers" },
          { name: "depth", label: "Depth", type: "select", options: ["Quick brief", "Standard briefing", "Deep dive"] },
          { name: "format", label: "Output format", type: "select", options: ["Briefing", "Pros & cons", "Comparison table", "Talking points"] },
        ]}
        buildPrompt={(v) =>
          [
            "Research and brief me on the following.",
            `Topic: ${v['topic']}`,
            `Audience: ${v['audience'] || "(general professional)"}`,
            `Depth: ${v['depth']}`,
            `Format: ${v['format']}`,
            "Flag uncertain or time-sensitive claims explicitly.",
          ].join("\n")
        }
      />
    </AppShell>
  );
}