import { site } from "@/constants/site";
import Image from "next/image";
import Link from "next/link";
import {
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiTwitter,
  FiYoutube,
} from "react-icons/fi";

const quickLinks = [
  { label: "Community", href: "/community" },
  { label: "Programs & events", href: "/activities" },
  { label: "Projects", href: "/work" },
  { label: "Studio", href: "/studio" },
  { label: "Book a Session", href: "/book" },
  { label: "Impact", href: "/impact" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/resources" },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/contact" },
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
          <Link href="/" aria-label="Go to home" className="inline-block">
            <Image
              src="/svgs/data-fellow.svg"
              alt="Data Fellows"
              width={106}
              height={109}
              className="h-14 w-auto"
            />
          </Link>
          <p className="text-sm text-muted-foreground">
            A global, community-led technology organization advancing learning, collaboration and innovation across data, AI and software.
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

          <div className="space-y-2">
            <Link
              href={site.communityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-brand-blue-fill bg-brand-blue-fill px-4 py-2.5 text-sm font-semibold text-brand-blue-foreground transition hover:bg-brand-blue-fill/90"
            >
              Join the Community
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 border border-border px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-foreground/40"
            >
              <FiMail className="h-4 w-4" />
              Contact Us
            </Link>
            <Link
              href="/book"
              className="flex items-center gap-2 border border-border px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-foreground/40"
            >
              Book a Session
            </Link>
            <p className="pt-1 text-sm text-muted-foreground">{site.email}</p>
          </div>
        </div>

        <div className="grid w-full max-w-3xl grid-cols-1 gap-12 sm:grid-cols-2">
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Quick links
            </h4>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-foreground">
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
              Our wider network
            </h4>
            <p className="mt-4 text-sm text-muted-foreground">
              Training academies, startup programs, and community allies
              Data Fellows has been part of.
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
          <div className="flex items-center gap-4">
            <Link href="/terms" className="transition hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="transition hover:text-foreground">
              Privacy
            </Link>
            <span className="text-foreground">Built by Data Fellows Inc.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
