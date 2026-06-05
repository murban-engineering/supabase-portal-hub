import { useState, useEffect, useRef } from "react";
import { Search, Lock, ArrowLeft, KeyRound, MapPin } from "lucide-react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const heroImage = "/aerial-view-gas-oil-refinery-oil-industry.jpg";

interface Client {
  id: string;
  name: string;
  password: string;
  app_url: string;
  terminal_location: string | null;
}

type Step = "search" | "terminal" | "password" | "app" | "reset";

const Portal = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<Step>("search");
  const [error, setError] = useState("");
  const [terminalInput, setTerminalInput] = useState("");
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const resetCurrentPasswordRef = useRef<HTMLInputElement>(null);

  // Reset password state
  const [resetClient, setResetClient] = useState<Client | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (step === "terminal") {
      terminalInputRef.current?.focus();
    }

    if (step === "password") {
      passwordInputRef.current?.focus();
    }

    if (step === "reset") {
      resetCurrentPasswordRef.current?.focus();
    }
  }, [step]);

  const fetchClients = async () => {
    if (!supabase) {
      setClients([]);
      return;
    }

    const { data, error } = await supabase.from("clients").select("*");
    if (data) setClients(data as Client[]);
    if (error) console.error("Error fetching clients:", error);
  };

  useEffect(() => {
    if (searchTerm.trim().length < 4) {
      setFilteredClients([]);
    } else {
      setFilteredClients(
        clients.filter((c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, clients]);

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    if (client.terminal_location) {
      setStep("terminal");
      setTerminalInput("");
    } else {
      setStep("password");
    }
    setPassword("");
    setError("");
    setSearchTerm("");
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClient && terminalInput.trim().toLowerCase() === selectedClient.terminal_location?.toLowerCase()) {
      setStep("password");
      setError("");
    } else {
      setError("Incorrect terminal location. Please try again.");
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClient && password === selectedClient.password) {
      setStep("app");
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  const handleBack = () => {
    if (step === "terminal") {
      setStep("search");
      setSelectedClient(null);
      setTerminalInput("");
      setError("");
    } else if (step === "password") {
      if (selectedClient?.terminal_location) {
        setStep("terminal");
        setTerminalInput("");
      } else {
        setStep("search");
        setSelectedClient(null);
      }
      setPassword("");
      setError("");
    } else if (step === "app") {
      setStep("password");
      setPassword("");
    } else if (step === "reset") {
      setStep("search");
      setResetClient(null);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetClient) return;
    if (!supabase) {
      setError("Portal database is not configured.");
      return;
    }

    if (currentPassword !== resetClient.password) {
      setError("Current password is incorrect.");
      return;
    }
    if (newPassword.length < 3) {
      setError("New password must be at least 3 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    const { error: updateError } = await supabase
      .from("clients")
      .update({ password: newPassword })
      .eq("id", resetClient.id);

    if (updateError) {
      setError("Failed to update password. Please try again.");
      console.error(updateError);
    } else {
      toast.success("Password updated successfully!");
      setStep("search");
      setResetClient(null);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      fetchClients();
    }
  };

  const openResetForClient = (client: Client) => {
    setResetClient(client);
    setStep("reset");
    setError("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSearchTerm("");
  };

  // Fullscreen app view
  if (step === "app" && selectedClient) {
    return (
      <Layout>
        <div className="fixed inset-x-0 bottom-0 top-24 z-40 bg-background">
          <iframe
            src={selectedClient.app_url}
            className="h-full w-full border-0"
            title={selectedClient.name}
            allow="fullscreen"
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />

        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, 
              hsla(220, 20%, 6%, 0.6) 0%,
              hsla(220, 20%, 6%, 0.7) 50%,
              hsla(220, 20%, 6%, 0.85) 100%
            )`,
          }}
        />

        {/* Decorative squares */}
        <div className="absolute left-[15%] top-1/4 w-16 h-16 border border-white/10 rotate-45 hidden lg:block" />
        <div className="absolute right-[15%] top-1/3 w-12 h-12 border border-white/10 rotate-12 hidden lg:block" />
        <div className="absolute left-[10%] bottom-1/3 w-10 h-10 border border-white/10 -rotate-12 hidden lg:block" />
        <div className="absolute right-[20%] bottom-1/4 w-14 h-14 border border-white/10 rotate-45 hidden lg:block" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 w-full max-w-3xl animate-fade-in">
          <h1 className="portal-title mb-6">Secure Client Portal</h1>

          <p className="hero-subtitle mb-12">
            Search your company, enter your passkey, and launch your MURBAN ENGINEERING LTD app
            securely.
          </p>

          {!supabase && (
            <p className="mb-6 text-sm text-destructive">
              Portal data is temporarily unavailable. Please contact support.
            </p>
          )}

          {step === "search" && (
            <div>
              {/* Search Input */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search your company name..."
                  className="search-input"
                />
              </div>

              {/* Results dropdown */}
              {filteredClients.length > 0 && (
                <div className="mt-2 bg-white rounded-2xl shadow-lg overflow-hidden text-left">
                  {filteredClients.map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                    >
                      <button
                        onClick={() => handleSelectClient(client)}
                        className="flex-1 text-left text-gray-900 font-medium"
                      >
                        {client.name}
                      </button>
                      <button
                        onClick={() => openResetForClient(client)}
                        className="ml-4 flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent hover:bg-accent hover:text-white rounded-full text-xs font-semibold transition-all duration-200"
                        title="Reset Password"
                      >
                        <KeyRound className="w-4 h-4" />
                        <span>Reset</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {searchTerm.trim().length >= 4 && filteredClients.length === 0 && (
                <p className="mt-4 text-subtitle text-sm">
                  No companies found matching "{searchTerm}"
                </p>
              )}
            </div>
          )}

          {step === "terminal" && selectedClient && (
            <div>
              <div className="mb-6">
                <button
                  onClick={handleBack}
                  className="text-subtitle hover:text-white transition-colors text-sm flex items-center gap-2 mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to search
                </button>
              </div>
              <p className="text-white text-xl mb-2 font-medium">
                {selectedClient.name}
              </p>
              <p className="text-subtitle text-sm mb-6">
                Enter your terminal location to continue
              </p>
              <form onSubmit={handleTerminalSubmit} className="relative">
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <input
                    ref={terminalInputRef}
                    type="text"
                    value={terminalInput}
                    onChange={(e) => {
                      setTerminalInput(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter terminal location..."
                    className="search-input"
                    autoFocus
                  />
                </div>
                {error && (
                  <p className="mt-3 text-red-400 text-sm">{error}</p>
                )}
                <button
                  type="submit"
                  className="mt-6 px-10 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors"
                >
                  Continue
                </button>
              </form>
            </div>
          )}

          {step === "password" && selectedClient && (
            <div>
              <div className="mb-6">
                <button
                  onClick={handleBack}
                  className="text-subtitle hover:text-white transition-colors text-sm flex items-center gap-2 mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to search
                </button>
              </div>
              <p className="text-white text-xl mb-6 font-medium">
                {selectedClient.name}
              </p>
              <form onSubmit={handlePasswordSubmit} className="relative">
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <input
                    ref={passwordInputRef}
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter your passkey"
                    className="search-input"
                    autoComplete="current-password"
                    name="client-portal-password"
                    autoFocus
                  />
                </div>
                {error && (
                  <p className="mt-3 text-red-400 text-sm">{error}</p>
                )}
                <button
                  type="submit"
                  className="mt-6 px-10 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors"
                >
                  Launch App
                </button>
              </form>
            </div>
          )}

          {step === "reset" && resetClient && (
            <div>
              <div className="mb-6">
                <button
                  onClick={handleBack}
                  className="text-subtitle hover:text-white transition-colors text-sm flex items-center gap-2 mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to search
                </button>
              </div>
              <p className="text-white text-xl mb-2 font-medium">
                Reset Password
              </p>
              <p className="text-subtitle text-sm mb-6">
                {resetClient.name}
              </p>
              <form
                onSubmit={handleResetPassword}
                className="space-y-4 max-w-md mx-auto"
              >
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    ref={resetCurrentPasswordRef}
                    type="password"
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Current password"
                    className="search-input text-base"
                    autoComplete="current-password"
                    name="current-password"
                    autoFocus
                  />
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="New password"
                    className="search-input text-base"
                    autoComplete="new-password"
                    name="new-password"
                  />
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Confirm new password"
                    className="search-input text-base"
                    autoComplete="new-password"
                    name="confirm-new-password"
                  />
                </div>
                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}
                <button
                  type="submit"
                  className="w-full py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Portal;
