import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

export function AIResponseCard({ prompt, reply, children }: { prompt: string; reply: string; children?: ReactNode }) {
  return (
    <div className="space-y-3 animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-secondary px-3.5 py-2 text-sm text-secondary-foreground">
          {prompt}
        </p>
      </div>
      <div className="flex gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Sparkles className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1 space-y-3">
          <p className="text-sm leading-relaxed text-foreground">{reply}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
