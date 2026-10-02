import { CheckCircle2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { GoogleIcon } from "@/components/common/GoogleIcon";
import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useConnectGoogle, useDisconnectGoogle, useGoogleConnection } from "@/hooks/useGoogleConnection";

export function GoogleConnectionCard({ compact = false }: { compact?: boolean }) {
  const { data, isLoading, isError, refetch } = useGoogleConnection();
  const connect = useConnectGoogle();
  const disconnect = useDisconnectGoogle();

  if (isLoading) {
    return (
      <div className="surface-panel space-y-3 p-5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    );
  }

  if (isError) {
    return <ErrorState title="Google Calendar connection failed." onRetry={() => void refetch()} />;
  }

  const connected = data?.connected ?? false;

  return (
    <section className="surface-panel p-5" aria-labelledby="google-calendar-heading">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
          <GoogleIcon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="google-calendar-heading" className="text-sm font-semibold text-foreground">
            Google Calendar
          </h2>
          {connected ? (
            <>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-success">
                <CheckCircle2 className="size-4" aria-hidden />
                Google Calendar connected
              </p>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {compact ? data?.email : "ZeitPlan can schedule tasks in your calendar."}
              </p>
            </>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              Connect your Google Calendar to let ZeitPlan schedule your tasks.
            </p>
          )}
        </div>
      </div>

      {!compact ? (
        <>
          {connected && data?.email ? (
            <dl className="mt-4 grid gap-3 rounded-lg bg-muted/60 p-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Connected account</dt>
                <dd className="truncate text-foreground">{data.email}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Calendar</dt>
                <dd className="truncate text-foreground">{data.calendarName}</dd>
              </div>
            </dl>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            {connected ? (
              <>
                <Button variant="outline" size="sm" onClick={() => connect.mutate()}>
                  Manage connection
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  disabled={disconnect.isPending}
                  onClick={() =>
                    disconnect.mutate(undefined, {
                      onSuccess: () => toast.success("Google Calendar disconnected"),
                    })
                  }
                >
                  Disconnect
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                disabled={connect.isPending}
                onClick={() =>
                  connect.mutate(undefined, {
                    onSuccess: () => toast.success("Google Calendar connected"),
                    onError: () => toast.error("Google Calendar connection failed. Try again."),
                  })
                }
              >
                {connect.isPending ? "Connecting…" : "Connect Google Calendar"}
              </Button>
            )}
          </div>
          <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="mt-px size-3.5 shrink-0" aria-hidden />
            ZeitPlan only accesses the permissions required to manage your scheduled tasks.
          </p>
        </>
      ) : null}
    </section>
  );
}
