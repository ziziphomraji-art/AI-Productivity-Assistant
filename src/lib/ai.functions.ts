import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const AssistantInput = z.object({
  system: z.string().min(1),
  messages: z.array(MessageSchema).min(1),
});

export const runAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AssistantInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured for this app (missing API key).");

    const { streamText } = await import("ai");
    const { createLovableAiGatewayProvider, CHAT_MODEL } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    try {
      const result = streamText({
        model: gateway(CHAT_MODEL),
        system: data.system,
        messages: data.messages,
      });
      const text = await result.text;
      return { text };
    } catch (error: unknown) {
      const status = (error as { statusCode?: number })?.statusCode;
      const message =
        (error as { responseBody?: string })?.responseBody ??
        (error instanceof Error ? error.message : "Unknown AI error");

      if (status === 429) throw new Error("The AI is busy right now. Please try again in a moment.");
      if (status === 402)
        throw new Error("AI credits are exhausted. The app owner needs to add credits in Lovable.");
      if (status === 403)
        throw new Error("AI access is currently blocked by workspace policy. Contact the app owner.");
      throw new Error(`AI request failed: ${message}`);
    }
  });