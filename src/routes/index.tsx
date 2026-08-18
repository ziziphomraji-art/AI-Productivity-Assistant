import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, FileText, ListChecks, Search, MessagesSquare } from "lucide-react";

import { AiDisclaimer, AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate workplace tasks with AI: draft emails, summarize meetings, plan work, research topics, and chat with an assistant.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Five AI tools for professionals: email drafting, meeting summaries, task planning, research, and chat.",
      },
    ],
  }),
  component: Index,
});

const TOOLS = [
  {
    to: "/email" as const,
    icon: Mail,
    title: "Smart Email Generator",
    body: "Turn a few bullet points into a polished, on-tone work email.",
  },
  {
    to: "/notes" as const,
    icon: FileText,
    title: "Meeting Notes Summarizer",
    body: "Convert messy notes into decisions, action items, and owners.",
  },
  {
    to: "/planner" as const,
    icon: ListChecks,
    title: "AI Task Planner",
    body: "Break a goal into a prioritized, time-boxed plan you can ship.",
  },
  {
    to: "/research" as const,
    icon: Search,
    title: "AI Research Assistant",
    body: "Structured briefings with uncertain claims clearly flagged.",
  },
  {
    to: "/chat" as const,
    icon: MessagesSquare,
    title: "AI Chatbot",
    body: "Ask follow-up questions in a full conversational assistant.",
  },
];

function Index() {
  return (
    <AppShell>
      <section className="gradient-hero mb-8 rounded-2xl p-8 text-primary-foreground sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-80">
          Workplace AI Suite
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-semibold sm:text-4xl">
          Automate the busywork. Keep the judgement.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed opacity-90">
          Five focused AI tools for professionals — each with structured prompts and fully editable
          output, so you stay in control of what leaves your desk.
        </p>
        <Link
          to="/email"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
        >
          Start with an email <ArrowRight className="size-4" />
        </Link>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.to}
            to={tool.to}
            className="surface-card group flex flex-col gap-3 p-5 transition-transform hover:-translate-y-0.5"
          >
            <span className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground">
              <tool.icon className="size-5" />
            </span>
            <h2 className="text-base font-semibold">{tool.title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{tool.body}</p>
            <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <AiDisclaimer />
    </AppShell>
  );
}
