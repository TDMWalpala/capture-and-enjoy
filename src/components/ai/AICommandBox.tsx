import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowUp, Mic, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AIResponseCard } from "./AIResponseCard";
import { ConfirmationCard } from "./ConfirmationCard";
import { ErrorState } from "@/components/common/ErrorState";
import { aiApi } from "@/services/aiApi";
import type { AiCommandResponse } from "@/types";

const examples = [
  "Schedule Python study tomorrow afternoon",
  "Add grocery shopping for 30 minutes",
  "Move my gym task to Friday",
  "Show my pending tasks",
];

export function AICommandBox() {
  const queryClient = useQueryClient();
  const [command, setCommand] = useState("");
  const [lastPrompt, setLastPrompt] = useState("");
  const [response, setResponse] = useState<AiCommandResponse | null>(null);

  const send = useMutation({
    mutationFn: (text: string) => aiApi.sendCommand(text),
    onSuccess: (data) => {
      setResponse(data);
      void queryClient.invalidateQueries({ queryKey: ["activity"] });
    },
  });

  const confirm = useMutation({
    mutationFn: (data: AiCommandResponse) => aiApi.confirm(data),
    onSuccess: (message) => {
      toast.success(message);
      setResponse(null);
      void queryClient.invalidateQueries({ queryKey: ["tasks"] });
      void queryClient.invalidateQueries({ queryKey: ["activity"] });
    },
    onError: () => toast.error("The action could not be completed. Please try again."),
  });

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || send.isPending) return;
    setLastPrompt(trimmed);
    setResponse(null);
    setCommand("");
    send.mutate(trimmed);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    submit(command);
  }

  const proposal = response?.proposal;
  const needsConfirmation = proposal && proposal.kind !== "none";

  return (
    <section aria-labelledby="ai-command-title" className="surface-panel overflow-hidden">
      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" aria-hidden />
          <h2 id="ai-command-title">Tell ZeitPlan what you want to accomplish</h2>
        </div>

        <form onSubmit={onSubmit} className="flex items-end gap-2 rounded-xl border border-input bg-background p-2 shadow-soft focus-within:ring-2 focus-within:ring-ring/40">
          <label htmlFor="ai-command" className="sr-only">
            AI command
          </label>
          <textarea
            id="ai-command"
            rows={1}
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submit(command);
              }
            }}
            placeholder="What do you want to get done?"
            className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled
            title="Voice input is coming soon"
            aria-label="Voice input (coming soon)"
          >
            <Mic className="size-4" aria-hidden />
          </Button>
          <Button type="submit" size="icon" disabled={!command.trim() || send.isPending} aria-label="Send command">
            <ArrowUp className="size-4" aria-hidden />
          </Button>
        </form>

        <div className="flex flex-wrap gap-2">
          {examples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => submit(example)}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {send.isPending || response || send.isError ? (
        <div className="border-t border-border bg-surface p-5 sm:p-6" aria-live="polite">
          {send.isPending ? (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex gap-1" aria-hidden>
                <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-primary" />
              </span>
              Thinking about “{lastPrompt}”…
            </div>
          ) : send.isError ? (
            <ErrorState title="AI request failed." description="Please try again." onRetry={() => submit(lastPrompt)} />
          ) : response ? (
            <AIResponseCard prompt={lastPrompt} reply={response.reply}>
              {needsConfirmation && proposal ? (
                <ConfirmationCard
                  proposal={proposal}
                  pending={confirm.isPending}
                  onConfirm={() => confirm.mutate(response)}
                  onCancel={() => setResponse(null)}
                />
              ) : null}
            </AIResponseCard>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
