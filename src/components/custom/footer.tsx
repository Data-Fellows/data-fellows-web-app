import Image from "next/image";
import Link from "next/link";
import { FiInstagram, FiLinkedin, FiTwitter, FiYoutube } from "react-icons/fi";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Community", href: "/community" },
  { label: "Activities", href: "/activities" },
  { label: "Products", href: "/products" },
  { label: "Impact", href: "/impact" },
  { label: "Resources", href: "/resources" },
  { label: "Partners", href: "/partners" },
  { label: "About", href: "/about" },
];

const partnerHighlights = [
  "AWS Startups",
  "Microsoft for Startups",
  "DataCamp Classroom",
  "Zummit Africa",
  "Vatebra Academy",
  "Communitech",
  "Accelerator Centre",
  "TBDC",
];

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/the-data-fellow/",
    icon: FiLinkedin,
  },
  {
    label: "Twitter / X",
    href: "https://twitter.com/DatafellowsInfo",
    icon: FiTwitter,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@DataFellows?si=1eB-Usup0ijd1rxM",
    icon: FiYoutube,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/data.fellows/",
    icon: FiInstagram,
  },
];

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-14 md:flex-row md:items-start md:justify-between lg:px-0">
        <div className="space-y-5 md:max-w-sm">
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
              className="h-9 w-9"
            />
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              Data Fellows
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Turning data into clarity for people and businesses. We train,
            build, and launch tools that make data feel human.
          </p>
          <div className="flex items-center gap-3 text-foreground">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center border border-border text-sm transition hover:border-foreground hover:bg-foreground hover:text-background"
              >
                <Icon />
              </Link>
            ))}
          </div>
        </div>

        <div className="grid w-full max-w-3xl grid-cols-1 gap-12 sm:grid-cols-2">
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Quick links
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-foreground">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="transition hover:text-primary">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Partner network
            </h4>
            <p className="mt-4 text-sm text-muted-foreground">
              We co-build with accelerators, training partners, and allied
              communities who keep Data Fellows grounded in real outcomes.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              {partnerHighlights.map((name) => (
                <span
                  key={name}
                  className="border border-border px-3 py-2"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-6 font-mono text-xs uppercase tracking-wide text-muted-foreground md:flex-row md:justify-between lg:px-0">
          <span>&copy; {year} Data Fellows Inc. All rights reserved.</span>
          <span className="text-foreground">
            Built by Data Fellows Inc.
          </span>
        </div>
      </div>
    </footer>
  );
};
