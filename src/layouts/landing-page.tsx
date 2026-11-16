import { Footer } from "@/components";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React, { ReactNode, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/community", label: "Community" },
  { href: "/activities", label: "Activities" },
  { href: "/products", label: "Products" },
  { href: "/impact", label: "Impact" },
  { href: "/resources", label: "Resources" },
  { href: "/partners", label: "Partners" },
  { href: "/about", label: "About" },
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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <div className="flex items-center gap-10">
          <Link
            href="/"
            aria-label="Go to home"
            className="flex items-center gap-2.5"
          >
            <Image
              src="/svgs/data-fellow.svg"
              alt=""
              width={36}
              height={37}
              className="h-8 w-8"
              priority
            />
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              Data Fellows
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className={getNavLinkClass(href)}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
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

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
            className="p-2"
          >
            <FiMenu className="h-6 w-6 text-foreground" />
          </button>
        </div>
      </nav>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-foreground text-background transform transition-transform duration-300 md:hidden ${
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
                  pathname === href ? "text-gold" : "text-background/90"
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
            className="flex w-full items-center justify-center bg-gold px-4 py-3.5 font-mono text-xs font-semibold uppercase tracking-wide text-gold-foreground"
          >
            Discuss a Problem
          </button>
        </div>
      </div>
    </header>
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
