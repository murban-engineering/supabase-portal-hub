import { useEffect, useState } from "react";
import {
  Lock,
  ArrowLeft,
  RefreshCw,
  LogOut,
  Search,
  MapPin,
  ExternalLink,
} from "lucide-react";
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
  const [filter, setFilter] = useState("");
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

  const visible = clients.filter((c) =>
    c.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Layout>
      <div className="relative min-h-screen flex items-start justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-background/80" />

        <div className="relative z-10 w-full max-w-3xl px-6 pt-28 pb-16 text-center animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => {
                setAuthed(false);
                setPassword("");
              }}
              className="flex items-center gap-2 text-sm text-subtitle hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" /> Log out
            </button>
            <button
              onClick={() => {
                fetchClients();
              }}
              className="flex items-center gap-2 text-sm text-subtitle hover:text-white transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold text-white">
            All Clients
          </h1>
          <p className="text-subtitle text-sm mt-2 mb-8">
            {clients.length} client apps available
          </p>

          <div className="relative">
            <Search className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter clients..."
              className="search-input"
            />
          </div>

          <div className="mt-4 bg-white rounded-2xl shadow-lg overflow-hidden text-left max-h-[420px] overflow-y-auto">
            {visible.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-100 last:border-0"
              >
                <div className="min-w-0">
                  <p className="text-gray-900 font-medium truncate">
                    {client.name}
                  </p>
                  {client.terminal_location && (
                    <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {client.terminal_location}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setFocused(client)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent text-white text-xs font-semibold hover:opacity-90 transition-opacity shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open
                </button>
              </div>
            ))}
            {visible.length === 0 && (
              <p className="px-6 py-6 text-gray-500 text-sm">No clients found.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
