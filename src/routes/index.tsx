import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CalendarCheck, ListChecks, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { GoogleIcon } from "@/components/common/GoogleIcon";
import { Button } from "@/components/ui/button";
import { useCurrentUser, useLoginWithGoogle } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — ZeitPlan" },
      { name: "description", content: "Sign in to ZeitPlan with Google to connect your tasks and calendar." },
      { property: "og:title", content: "Sign in — ZeitPlan" },
      { property: "og:description", content: "Plan less. Get more done." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const login = useLoginWithGoogle();

  useEffect(() => {
    if (user) void navigate({ to: "/dashboard" });
  }, [user, navigate]);

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <main className="flex flex-col justify-center px-6 py-16 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="size-5" aria-hidden />
          </span>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-foreground">ZeitPlan</h1>
          <p className="mt-2 text-lg text-muted-foreground">Plan less. Get more done.</p>

          <Button
            size="lg"
            variant="outline"
            className="mt-10 h-11 w-full gap-3 px-4"
            disabled={login.isPending}
            onClick={() =>
              login.mutate(undefined, {
                onError: () => toast.error("Sign-in failed. Please try again."),
              })
            }
          >
            <GoogleIcon className="size-4" />
            {login.isPending ? "Connecting…" : "Continue with Google"}
          </Button>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Sign in with your Google account to connect your tasks and calendar.
          </p>
        </div>
      </main>

      <aside className="hidden border-l border-border bg-surface lg:flex lg:items-center lg:justify-center lg:p-12">
        <div className="w-full max-w-md space-y-3">
          <div className="surface-panel p-4">
            <p className="text-xs font-medium text-muted-foreground">You</p>
            <p className="mt-1 text-sm text-foreground">Schedule Python study tomorrow afternoon.</p>
          </div>
          <div className="surface-panel p-4">
            <p className="flex items-center gap-1.5 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" aria-hidden /> ZeitPlan
            </p>
            <p className="mt-1 text-sm text-foreground">
              I found a free time tomorrow from 14:00–16:00. Would you like me to schedule it?
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-3">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground">
              <ListChecks className="size-4 text-foreground" aria-hidden /> Tasks in plain language
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground">
              <CalendarCheck className="size-4 text-foreground" aria-hidden /> Your Google Calendar
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
