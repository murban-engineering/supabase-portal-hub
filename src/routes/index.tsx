import { createFileRoute, Link } from "@tanstack/react-router";
import heroImage from "@/assets/hero-refinery.jpg";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NUEBACH — Industrial Energy Solutions" },
      {
        name: "description",
        content:
          "NUEBACH delivers next-generation refining, storage and petrochemical infrastructure across the globe.",
      },
      { property: "og:title", content: "NUEBACH — Industrial Energy Solutions" },
      {
        property: "og:description",
        content: "Next-generation refining, storage and petrochemical infrastructure.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader transparent />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src={heroImage}
          alt="Aerial view of the NUEBACH industrial facility"
          className="absolute inset-0 h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <h1
            className="text-primary font-black tracking-[0.15em] text-6xl md:text-8xl lg:text-9xl drop-shadow-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            NUEBACH
          </h1>
          <p className="mt-6 text-lg md:text-2xl text-foreground/90 max-w-2xl mx-auto font-light tracking-wide">
            Engineering the infrastructure that fuels tomorrow's economy.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              to="/portal"
              className="rounded-md bg-primary px-8 py-3 text-primary-foreground font-semibold tracking-wide uppercase hover:bg-primary/90 transition shadow-lg shadow-primary/30"
            >
              Access Portal
            </Link>
            <a
              href="#about"
              className="rounded-md border border-foreground/30 px-8 py-3 font-semibold tracking-wide uppercase hover:bg-foreground/10 transition"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 px-6">
        <div className="mx-auto max-w-6xl grid md:grid-cols-3 gap-12">
          {[
            {
              title: "Refining",
              copy: "State-of-the-art crude processing with industry-leading efficiency and emissions controls.",
            },
            {
              title: "Storage",
              copy: "Tens of millions of barrels of capacity across strategic terminals worldwide.",
            },
            {
              title: "Petrochemicals",
              copy: "Specialty chemicals and polymers powering manufacturing across every continent.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-card border border-border rounded-lg p-8 hover:border-primary/50 transition"
            >
              <h3 className="text-primary text-2xl font-bold tracking-wide uppercase mb-3">
                {f.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">{f.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} NUEBACH. All rights reserved.
      </footer>
    </div>
  );
}
