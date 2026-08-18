import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

import { AiDisclaimer, AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { runAssistant } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Workplace AI" },
      {
        name: "description",
        content:
          "Chat with an AI workplace assistant about emails, meetings, planning, and everyday work questions.",
      },
      { property: "og:title", content: "AI Chatbot — Workplace AI" },
      {
        property: "og:description",
        content: "A conversational AI assistant for everyday workplace tasks.",
      },
    ],
  }),
  component: ChatPage,
});

const SYSTEM =
  "You are a helpful, concise AI workplace productivity assistant. Help with emails, meetings, planning, prioritisation, writing, and general work questions. Ask a clarifying question when the request is ambiguous. Use markdown. Never fabricate facts, and say when you are unsure.";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "Help me prioritise my week",
  "Rewrite this update to be more concise",
  "Draft an agenda for a 30-minute standup",
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const callAssistant = useServerFn(runAssistant);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || pending) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setPending(true);
    try {
      const res = await callAssistant({ data: { system: SYSTEM, messages: next } });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The assistant could not reply.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Assistant"
        title="AI Chatbot"
        description="Ask anything about your work. The full conversation is sent as context, so you can follow up naturally."
      />

      <div className="surface-card flex h-[60vh] min-h-[420px] flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Start a conversation, or try one of these:
              </p>
              <div className="flex flex-wrap gap-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                    : "prose-output max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5 text-sm text-foreground"
                }
              >
                {m.role === "user" ? m.content : <ReactMarkdown>{m.content}</ReactMarkdown>}
              </div>
            </div>
          ))}

          {pending && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" /> Thinking…
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form
          className="flex items-end gap-2 border-t border-border p-3"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <Textarea
            aria-label="Message"
            rows={2}
            value={input}
            placeholder="Ask the assistant…"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            className="min-h-[52px] resize-none"
          />
          <Button type="submit" size="icon" disabled={pending || !input.trim()} aria-label="Send">
            <Send className="size-4" />
          </Button>
        </form>
      </div>

      <AiDisclaimer />
    </AppShell>
  );
}