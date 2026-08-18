import { createFileRoute } from "@tanstack/react-router";

import { AppShell, PageHeader } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workplace AI" },
      {
        name: "description",
        content:
          "Break goals into prioritized, time-boxed task plans with AI and edit the plan to fit your week.",
      },
      { property: "og:title", content: "AI Task Planner — Workplace AI" },
      {
        property: "og:description",
        content: "Turn a goal and a deadline into a prioritized, realistic task plan.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Planning"
        title="AI Task Planner"
        description="Turn a goal into a prioritized, time-boxed plan with clear next steps and dependencies."
      />
      <ToolWorkspace
        outputTitle="Task plan"
        submitLabel="Build plan"
        system="You are a pragmatic project planner. Produce a realistic, prioritized plan in markdown: a one-line objective, then a table of tasks (Task, Priority, Owner, Estimate, Depends on), then a day-by-day or week-by-week schedule, then risks. Keep estimates conservative and never assume resources that were not mentioned."
        fields={[
          { name: "goal", label: "Goal or project", type: "textarea", placeholder: "e.g. Launch the internal onboarding portal", required: true, rows: 4 },
          { name: "deadline", label: "Deadline / timeframe", type: "text", placeholder: "e.g. 3 weeks, by 30 Sept" },
          { name: "capacity", label: "Available capacity", type: "text", placeholder: "e.g. 2 people, 10 hours/week each" },
          { name: "style", label: "Plan style", type: "select", options: ["Daily breakdown", "Weekly sprints", "Kanban backlog", "Milestone roadmap"] },
        ]}
        buildPrompt={(v) =>
          [
            "Create a task plan.",
            `Goal: ${v['goal']}`,
            `Deadline: ${v['deadline'] || "(not provided)"}`,
            `Capacity: ${v['capacity'] || "(not provided)"}`,
            `Preferred structure: ${v['style']}`,
          ].join("\n")
        }
      />
    </AppShell>
  );
}