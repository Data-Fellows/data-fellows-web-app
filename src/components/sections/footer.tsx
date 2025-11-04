import Image from "next/image";
import Link from "next/link";
import { FiInstagram, FiLinkedin, FiTwitter, FiYoutube } from "react-icons/fi";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Community", href: "/community" },
  { label: "Products", href: "/products" },
  { label: "Resources", href: "/resources" },
  { label: "Partners", href: "/partners" },
  { label: "About", href: "/about" },
  { label: "Join", href: "/join" },
];

const partnerHighlights = [
  "AWS Startups",
  "Microsoft for Startups",
  "DataCamp Classroom",
  "Zummit Africa",
  "Vatebra Academy",
  "Everything Analytics",
];

const socialLinks = [
  { label: "LinkedIn", href: "#", icon: FiLinkedin },
  { label: "Twitter / X", href: "#", icon: FiTwitter },
  { label: "YouTube", href: "#", icon: FiYoutube },
  { label: "Instagram", href: "#", icon: FiInstagram },
];

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border bg-secondary/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-12 md:flex-row md:items-start md:justify-between lg:px-0">
        <div className="space-y-5 md:max-w-sm">
          <Image
            src="/svgs/data-fellow.svg"
            alt="Data Fellows Logo"
            width={140}
            height={48}
            className="h-12 w-auto"
          />
          <p className="text-sm text-muted-foreground">
            Turning data into clarity for people and businesses. We train,
            build, and launch tools that make data feel human.
          </p>
          <div className="flex items-center gap-3 text-primary">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-background text-lg transition hover:bg-primary hover:text-primary-foreground"
              >
                <Icon />
              </Link>
            ))}
          </div>
        </div>

        <div className="grid w-full max-w-3xl grid-cols-1 gap-12 sm:grid-cols-2">
          <div>
            <h4 className="text-base font-semibold text-foreground">
              Quick links
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
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
            <h4 className="text-base font-semibold text-foreground">
              Partner network
            </h4>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              {partnerHighlights.map((name) => (
                <span
                  key={name}
                  className="rounded-md border border-border bg-background px-3 py-2 text-muted-foreground"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/70 bg-background/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-6 text-sm text-muted-foreground md:flex-row md:justify-between lg:px-0">
          <span>&copy; {year} Data Fellows Inc. All rights reserved.</span>
          <span className="font-medium text-foreground">
            Built by Data Fellows Inc.
          </span>
        </div>
      </div>
    </footer>
  );
};
