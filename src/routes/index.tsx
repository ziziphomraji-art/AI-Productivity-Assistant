import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, FileText, ListChecks, Search, MessagesSquare } from "lucide-react";

import { AiDisclaimer, AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Community Kitchen Soup — AI Kitchen Assistant" },
      {
        name: "description",
        content:
          "AI tools for the Community Kitchen Soup team: draft emails to donors, summarize volunteer meetings, plan service days, research programmes, and chat.",
      },
      { property: "og:title", content: "Community Kitchen Soup — AI Kitchen Assistant" },
      {
        property: "og:description",
        content:
          "Five AI tools for community kitchen teams: email drafting, meeting summaries, task planning, research, and chat.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const TOOLS = [
  {
    to: "/email" as const,
    icon: Mail,
    title: "Smart Email Generator",
    body: "Turn a few bullet points into a warm email to donors, partners, or volunteers.",
  },
  {
    to: "/notes" as const,
    icon: FileText,
    title: "Meeting Notes Summarizer",
    body: "Turn volunteer meeting notes into decisions, action items, and owners.",
  },
  {
    to: "/planner" as const,
    icon: ListChecks,
    title: "AI Task Planner",
    body: "Plan a service day, food drive, or roster into clear, time-boxed steps.",
  },
  {
    to: "/research" as const,
    icon: Search,
    title: "AI Research Assistant",
    body: "Briefings on funding, nutrition, and food safety with uncertainty flagged.",
  },
  {
    to: "/chat" as const,
    icon: MessagesSquare,
    title: "AI Chatbot",
    body: "Ask follow-up questions about running the kitchen, day to day.",
  },
];

function Index() {
  return (
    <AppShell>
      <section className="gradient-hero mb-8 rounded-2xl p-8 text-primary-foreground sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-80">
          Community Kitchen Soup
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-semibold sm:text-4xl">
          Less paperwork. More bowls served.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed opacity-90">
          Five focused AI tools for our kitchen team — structured prompts and fully editable output,
          so a human always signs off before anything leaves the kitchen.
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
