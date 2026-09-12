import { useEffect, useState } from "react";
import { Lock, Maximize2, ArrowLeft, RefreshCw } from "lucide-react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";

const heroImage = `${import.meta.env.BASE_URL}aerial-view-gas-oil-refinery-oil-industry.jpg`;

const ADMIN_PASSWORD = "MURBAN-ADMIN-2026";

interface Client {
  id: string;
  name: string;
  app_url: string;
  terminal_location: string | null;
}

const Admin = () => {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<Client | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const fetchClients = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("clients")
      .select("id, name, app_url, terminal_location")
      .order("name");
    if (data) setClients(data as Client[]);
    if (fetchError) console.error(fetchError);
    setLoading(false);
  };

  useEffect(() => {
    if (authed) fetchClients();
  }, [authed]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError("");
    } else {
      setError("Incorrect admin password.");
    }
  };

  if (!authed) {
    return (
      <Layout>
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-background/80" />
          <div className="relative z-10 w-full max-w-md px-6 text-center animate-fade-in">
            <h1 className="portal-title mb-4">Admin Console</h1>
            <p className="text-subtitle text-sm mb-8">
              One password. Every client tank dashboard in one place.
            </p>
            <form onSubmit={handleLogin}>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Admin password"
                  className="search-input text-base"
                  autoComplete="current-password"
                  autoFocus
                />
              </div>
              {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                className="mt-6 w-full py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                Enter Console
              </button>
            </form>
          </div>
        </div>
      </Layout>
    );
  }

  if (focused) {
    return (
      <Layout>
        <div className="fixed inset-x-0 bottom-0 top-24 z-40 bg-background">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
            <button
              onClick={() => setFocused(null)}
              className="flex items-center gap-2 text-sm text-subtitle hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> All clients
            </button>
            <span className="text-white text-sm font-medium truncate">
              {focused.name}
            </span>
          </div>
          <iframe
            src={focused.app_url}
            className="h-[calc(100%-41px)] w-full border-0"
            title={focused.name}
            allow="fullscreen"
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen pt-28 pb-16 px-4 md:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-white">
                All Client Tanks
              </h1>
              <p className="text-subtitle text-sm mt-1">
                {clients.length} client dashboards
              </p>
            </div>
            <button
              onClick={() => {
                fetchClients();
                setReloadKey((k) => k + 1);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/60 text-white text-sm hover:bg-secondary transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {clients.map((client) => (
              <div
                key={client.id}
                className="rounded-2xl overflow-hidden border border-white/10 bg-secondary/40"
              >
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold truncate">
                      {client.name}
                    </p>
                    {client.terminal_location && (
                      <p className="text-subtitle text-xs truncate">
                        {client.terminal_location}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setFocused(client)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-white text-xs font-semibold transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5" /> Open
                  </button>
                </div>
                <div className="h-64 bg-black/40">
                  <iframe
                    key={`${client.id}-${reloadKey}`}
                    src={client.app_url}
                    className="h-full w-full border-0"
                    title={client.name}
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>

          {!loading && clients.length === 0 && (
            <p className="text-subtitle text-sm">No clients found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
