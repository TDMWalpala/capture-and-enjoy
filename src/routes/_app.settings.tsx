import { createFileRoute } from "@tanstack/react-router";
import { Monitor, Moon, Sun } from "lucide-react";
import type { ReactNode } from "react";
import { GoogleConnectionCard } from "@/components/google/GoogleConnectionCard";
import { PageHeader } from "@/components/common/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCurrentUser } from "@/hooks/useAuth";
import { usePreferences } from "@/hooks/usePreferences";
import { useTheme, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import type { TaskPriority } from "@/types";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — ZeitPlan" },
      { name: "description", content: "Account, preferences, Google Calendar, AI and appearance settings." },
      { property: "og:title", content: "Settings — ZeitPlan" },
      { property: "og:description", content: "Configure ZeitPlan to fit how you work." },
    ],
  }),
  component: SettingsPage,
});

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-border pt-6 md:grid-cols-[220px_1fr]">
      <div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

const timezones = ["Europe/Vienna", "Europe/Berlin", "Europe/London", "America/New_York", "America/Los_Angeles", "Asia/Tokyo"];
const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

function SettingsPage() {
  const { data: user } = useCurrentUser();
  const { preferences, update } = usePreferences();
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Configure ZeitPlan to fit how you work." />

      <Section title="Account" description="Managed through your Google account.">
        <div className="surface-panel grid gap-4 p-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Profile name</Label>
            <Input id="name" value={user?.name ?? ""} readOnly />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email ?? ""} readOnly />
          </div>
          <p className="text-xs text-muted-foreground sm:col-span-2">Google account: {user?.email}</p>
        </div>
      </Section>

      <Section title="Preferences" description="Defaults for new tasks.">
        <div className="surface-panel grid gap-4 p-5 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="default-duration">Default duration (min)</Label>
            <Input
              id="default-duration"
              type="number"
              min={5}
              step={5}
              value={preferences.defaultDurationMinutes}
              onChange={(e) => update({ defaultDurationMinutes: Number(e.target.value) || 60 })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="default-priority">Default priority</Label>
            <Select value={preferences.defaultPriority} onValueChange={(v) => update({ defaultPriority: v as TaskPriority })}>
              <SelectTrigger id="default-priority"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={preferences.timezone} onValueChange={(v) => update({ timezone: v })}>
              <SelectTrigger id="timezone"><SelectValue /></SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      <Section title="Google Calendar" description="Where ZeitPlan places scheduled tasks.">
        <GoogleConnectionCard />
      </Section>

      <Section title="AI" description="How the AI agent interacts with you.">
        <div className="surface-panel flex items-start justify-between gap-4 p-5">
          <div>
            <Label htmlFor="ai-confirm">AI confirmation before calendar changes</Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Ask before scheduling, moving or deleting anything. Coming soon — confirmation is currently always on.
            </p>
          </div>
          <Switch id="ai-confirm" checked={preferences.confirmBeforeCalendarChanges} disabled />
        </div>
      </Section>

      <Section title="Appearance">
        <div role="radiogroup" aria-label="Theme" className="grid grid-cols-3 gap-3">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              role="radio"
              aria-checked={theme === option.value}
              onClick={() => setTheme(option.value)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border p-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                theme === option.value
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              <option.icon className="size-4" aria-hidden />
              {option.label}
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}
