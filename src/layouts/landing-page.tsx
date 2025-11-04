import { Footer } from "@/components";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React, { ReactNode, useState } from "react";
import { FiArrowUpRight, FiMenu, FiX } from "react-icons/fi";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/community", label: "Community" },
  { href: "/products", label: "Products" },
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
      "relative text-sm font-medium transition-colors duration-200 ease-in-out px-1 py-1",
      isActive ? "text-primary" : "text-muted-foreground hover:text-primary",
      "group",
    ].join(" ");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <Image
            src="/svgs/data-fellow.svg"
            alt="Data Fellows Logo"
            width={80}
            height={80}
            className="h-12 w-12 md:h-16 md:w-16"
          />
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className={getNavLinkClass(href)}>
                <span className="relative z-10">{label}</span>
                <span
                  className={`absolute left-0 bottom-0 h-[2px] w-full origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100 ${
                    pathname === href ? "scale-x-100" : ""
                  }`}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => {
              router.push("/join");
              setIsOpen(false);
            }}
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Join the Ecosystem
            <FiArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
            className="p-2"
          >
            <FiMenu className="h-6 w-6 text-primary" />
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
        className={`fixed top-0 right-0 z-50 h-full w-64 bg-background transform transition-transform duration-300 border-l border-border md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setIsOpen(false)} aria-label="Close menu">
            <FiX className="h-6 w-6 text-primary" />
          </button>
        </div>
        <div className="flex flex-col space-y-4 px-6 pt-2">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`w-full rounded-md px-4 py-2 text-left text-sm font-semibold ${
                pathname === href
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-primary hover:text-primary-foreground"
              } transition`}
            >
              {label}
            </Link>
          ))}

          <div className="space-y-3 pt-6">
            <button
              onClick={() => {
                router.push("/join");
                setIsOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <span>Join the Ecosystem</span>
              <FiArrowUpRight className="h-4 w-4" />
            </button>
          </div>
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
    <main className="w-full">{children}</main>
    <Footer />
  </div>
);

export default LandingPageLayout;
