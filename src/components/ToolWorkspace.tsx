import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Copy, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

import { runAssistant } from "@/lib/ai.functions";
import { AiDisclaimer } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Field =
  | { name: string; label: string; type: "text"; placeholder?: string; required?: boolean }
  | {
      name: string;
      label: string;
      type: "textarea";
      placeholder?: string;
      rows?: number;
      required?: boolean;
    }
  | { name: string; label: string; type: "select"; options: string[]; required?: boolean };

export function ToolWorkspace({
  fields,
  system,
  buildPrompt,
  submitLabel = "Generate with AI",
  outputTitle = "AI draft",
}: {
  fields: Field[];
  system: string;
  buildPrompt: (values: Record<string, string>) => string;
  submitLabel?: string;
  outputTitle?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      fields.map((f) => [f.name, f.type === "select" ? (f.options[0] ?? "") : ""]),
    ),
  );
  const [output, setOutput] = useState("");
  const [editing, setEditing] = useState(false);
  const callAssistant = useServerFn(runAssistant);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await callAssistant({
        data: { system, messages: [{ role: "user" as const, content: buildPrompt(values) }] },
      });
      return res.text;
    },
    onSuccess: (text) => {
      setOutput(text);
      setEditing(false);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const missingRequired = fields.some((f) => f.required && !values[f.name]?.trim());

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <section className="surface-card p-5">
        <h2 className="text-base font-semibold">Structured prompt</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Fill in the details — they are assembled into a precise AI prompt.
        </p>
        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (missingRequired) {
              toast.error("Please fill in the required fields.");
              return;
            }
            mutation.mutate();
          }}
        >
          {fields.map((field) => (
            <div key={field.name} className="space-y-1.5">
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.type === "text" && (
                <Input
                  id={field.name}
                  placeholder={field.placeholder}
                  value={values[field.name] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                />
              )}
              {field.type === "textarea" && (
                <Textarea
                  id={field.name}
                  rows={field.rows ?? 5}
                  placeholder={field.placeholder}
                  value={values[field.name] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                />
              )}
              {field.type === "select" && (
                <Select
                  value={values[field.name] ?? ""}
                  onValueChange={(val) => setValues((v) => ({ ...v, [field.name]: val }))}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Working…
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> {submitLabel}
              </>
            )}
          </Button>
        </form>
      </section>

      <section className="surface-card flex min-h-[320px] flex-col p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold">{outputTitle}</h2>
          {output && (
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditing((v) => !v)}>
                {editing ? "Preview" : "Edit"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  void navigator.clipboard.writeText(output);
                  toast.success("Copied to clipboard");
                }}
              >
                <Copy className="size-3.5" /> Copy
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => mutation.mutate()}
                disabled={mutation.isPending}
              >
                <RotateCcw className="size-3.5" /> Redo
              </Button>
            </div>
          )}
        </div>

        <div className="mt-4 flex-1">
          {!output && !mutation.isPending && (
            <p className="text-sm text-muted-foreground">
              Your editable AI draft will appear here. You can rewrite it before using it.
            </p>
          )}
          {mutation.isPending && !output && (
            <div className="space-y-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-3 animate-pulse rounded bg-muted" />
              ))}
            </div>
          )}
          {output &&
            (editing ? (
              <Textarea
                aria-label="Edit AI output"
                value={output}
                rows={18}
                onChange={(e) => setOutput(e.target.value)}
                className="h-full min-h-[300px] font-sans text-sm"
              />
            ) : (
              <article className="prose-output text-sm leading-relaxed">
                <ReactMarkdown>{output}</ReactMarkdown>
              </article>
            ))}
        </div>
      </section>

      <div className="lg:col-span-2">
        <AiDisclaimer />
      </div>
    </div>
  );
}