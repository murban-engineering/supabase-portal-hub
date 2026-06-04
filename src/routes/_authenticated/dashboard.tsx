import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — NUEBACH" }],
  }),
  component: Dashboard,
});

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
}

function Dashboard() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setProfile(data));
  }, [user.id]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 pt-32 pb-16">
        <div className="bg-card border border-border rounded-lg p-10">
          <p className="text-sm uppercase tracking-widest text-primary mb-2">
            Welcome back
          </p>
          <h1 className="text-4xl font-bold mb-2">
            {profile?.display_name ?? user.email}
          </h1>
          <p className="text-muted-foreground">{user.email}</p>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {["Operations", "Reports", "Settings"].map((label) => (
              <div
                key={label}
                className="bg-background border border-border rounded-md p-6 hover:border-primary/50 transition"
              >
                <h3 className="text-lg font-semibold text-primary uppercase tracking-wide">
                  {label}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Coming soon.
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={handleSignOut}
            className="mt-10 rounded-md border border-border px-6 py-2 text-sm font-semibold uppercase tracking-wide hover:bg-secondary transition"
          >
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
