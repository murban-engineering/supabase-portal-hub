import { Link } from "@tanstack/react-router";

interface SiteHeaderProps {
  transparent?: boolean;
}

export function SiteHeader({ transparent = false }: SiteHeaderProps) {
  return (
    <header
      className={
        "absolute top-0 left-0 right-0 z-30 " +
        (transparent ? "" : "bg-background/80 backdrop-blur border-b border-border")
      }
    >
      <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-primary font-black tracking-[0.2em] text-xl">
            NUEBACH
          </span>
        </Link>
        <nav className="flex items-center gap-8 text-sm font-medium tracking-wide uppercase">
          <Link
            to="/"
            className="text-foreground/80 hover:text-foreground transition"
            activeProps={{ className: "text-foreground" }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>
          <Link
            to="/portal"
            className="text-foreground/80 hover:text-foreground transition"
            activeProps={{ className: "text-foreground" }}
          >
            Portal
          </Link>
          <Link
            to="/portal"
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition"
          >
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
}
