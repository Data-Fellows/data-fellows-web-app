import { Footer } from "@/components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React, { ReactNode, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

// Trimmed to the handoff's intended primary nav (Work, What We Do,
// Approach, Community, About, Insights) plus Home, which the founder
// explicitly asked to keep after losing their way back to "/" via the
// logo alone. Activities, Impact and Partners are still real, live
// pages -- just reached from within Community/About and the footer
// instead of the top nav, so the bar doesn't grow past what fits on
// one line as the new pages (Services/Approach) are added.
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/services", label: "What We Do" },
  { href: "/approach", label: "Approach" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "About" },
  { href: "/resources", label: "Insights" },
];

function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const getNavLinkClass = (path: string) => {
    const isActive = pathname === path;
    return [
      "text-sm font-medium transition-colors duration-200 ease-in-out",
      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
    ].join(" ");
  };

  return (
    <>
    {/* `backdrop-blur-sm` on this header creates a CSS containing block for
        `position: fixed` descendants (filter/backdrop-filter do this, same
        as transform), which would collapse the mobile drawer's `h-full`
        down to the header's own height instead of the viewport's -- so the
        backdrop overlay and drawer below render as siblings of <header>,
        not inside it. */}
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <div className="flex items-center gap-10">
          <Link
            href="/"
            aria-label="Go to home"
            className="flex items-center"
          >
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              Data Fellows
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className={getNavLinkClass(href)}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => {
              router.push("/contact");
              setIsOpen(false);
            }}
            className="flex items-center gap-2 border border-foreground px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-foreground hover:text-background"
          >
            Discuss a Problem
          </button>
        </div>

        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
            className="p-2"
          >
            <FiMenu className="h-6 w-6 text-foreground" />
          </button>
        </div>
      </nav>
    </header>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 overflow-y-auto bg-foreground text-background transform transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-6">
          <button onClick={() => setIsOpen(false)} aria-label="Close menu">
            <FiX className="h-6 w-6 text-background" />
          </button>
        </div>
        <div className="flex h-full flex-col px-6 pb-10">
          <div className="flex flex-1 flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`px-2 py-3.5 text-left text-lg font-medium ${
                  pathname === href
                    ? "bg-brand-blue-fill text-brand-blue-foreground"
                    : "text-background/90"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => {
              router.push("/contact");
              setIsOpen(false);
            }}
            className="flex w-full items-center justify-center bg-brand-blue-fill px-4 py-3.5 font-mono text-xs font-semibold uppercase tracking-wide text-brand-blue-foreground"
          >
            Discuss a Problem
          </button>
        </div>
      </div>
    </>
  );
}

interface LandingPageLayoutProps {
  children: ReactNode;
}

const LandingPageLayout: React.FC<LandingPageLayoutProps> = ({ children }) => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="w-full ">{children}</main>
    <Footer />
  </div>
);

export default LandingPageLayout;
