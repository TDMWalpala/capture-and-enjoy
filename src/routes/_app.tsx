import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardSkeleton } from "@/components/common/Skeletons";
import { useCurrentUser } from "@/hooks/useAuth";

export const Route = createFileRoute("/_app")({
  ssr: false,
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && !user) void navigate({ to: "/" });
  }, [isLoading, user, navigate]);

  if (isLoading || !user) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
