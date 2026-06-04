import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import heroImage from "@/assets/hero-refinery.jpg";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Portal Login — NUEBACH" },
      { name: "description", content: "Sign in or create an account to access the NUEBACH portal." },
      { property: "og:title", content: "Portal Login — NUEBACH" },
      { property: "og:description", content: "Sign in to the NUEBACH portal." },
    ],
  }),
  component: PortalPage,
});

function PortalPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // If already signed in, redirect to dashboard
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/dashboard", replace: true });
    });
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/dashboard", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/dashboard",
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (err) throw err;
        setMessage("Account created. Check your email if confirmation is required.");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <SiteHeader transparent />
      <img
        src={heroImage}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />

      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 py-32">
        <div className="w-full max-w-md bg-card/95 backdrop-blur border border-border rounded-lg p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-primary font-black tracking-[0.2em] text-3xl">NUEBACH</h1>
            <p className="text-sm text-muted-foreground uppercase tracking-widest mt-2">
              Secure Portal
            </p>
          </div>

          <div className="flex border border-border rounded-md overflow-hidden mb-6">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={
                "flex-1 py-2 text-sm font-semibold uppercase tracking-wide transition " +
                (mode === "signin"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={
                "flex-1 py-2 text-sm font-semibold uppercase tracking-wide transition " +
                (mode === "signup"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="Jane Doe"
                />
              </div>
            )}
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md p-3">
                {error}
              </p>
            )}
            {message && (
              <p className="text-sm text-foreground bg-primary/10 border border-primary/30 rounded-md p-3">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground rounded-md py-2.5 font-semibold uppercase tracking-wide hover:bg-primary/90 transition disabled:opacity-50"
            >
              {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
