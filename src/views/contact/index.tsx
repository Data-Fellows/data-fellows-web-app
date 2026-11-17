import PageSeo from "@/components/seo/page-seo";
import LandingPageLayout from "@/layouts/landing-page";
import { site } from "@/constants/site";
import Link from "next/link";
import { useState } from "react";
import { FiMail, FiMessageCircle, FiSend, FiUsers } from "react-icons/fi";

const contactChannels = [
  {
    title: "Join the community",
    detail: "Discord, learning, events and member opportunities.",
    icon: FiUsers,
    href: site.communityUrl,
    external: true,
  },
  {
    title: "Partnerships",
    detail: site.partnerEmail,
    icon: FiMessageCircle,
    href: `mailto:${site.partnerEmail}`,
  },
  {
    title: "General inquiries & press",
    detail: site.email,
    icon: FiMail,
    href: `mailto:${site.email}`,
  },
];

const ContactPage = () => {
  const [message, setMessage] = useState({
    name: "",
    email: "",
    topic: "General inquiry",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  return (
    <LandingPageLayout>
      <PageSeo
        title="Contact | Data Fellows"
        description="Get in touch with Data Fellows for general inquiries, partnerships, or press."
        path="/contact"
      />
      <div className="space-y-20 pt-28 md:space-y-24 md:pt-32">
        <section className="px-4" aria-labelledby="contact-hero-heading">
          <div className="mx-auto max-w-6xl border border-border bg-muted/40 px-6 py-12 lg:px-12">
            <div className="space-y-4 text-center">
              <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Discuss a Problem
              </span>
              <h1
                id="contact-hero-heading"
                className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
              >
                Inquiries & partnerships.
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
                Whether you want to partner with Data Fellows or feature a
                Fellow, leave us a detailed message and the right person will
                reach out within two business days.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4" aria-labelledby="contact-details-heading">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12 lg:items-start lg:gap-16">
            <div className="space-y-6 border border-border bg-background px-6 py-8 lg:col-span-5">
              <h2
                id="contact-details-heading"
                className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                Reach the team
              </h2>
              <p className="text-sm text-muted-foreground">
                Drop a note to any of the channels below and someone from Data
                Fellows will get back within two business days.
              </p>
              <div className="space-y-4">
                {contactChannels.map(({ title, detail, icon: Icon, href, external }) => (
                  <Link
                    key={title}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-4 border border-border bg-muted/40 px-5 py-4 text-sm text-muted-foreground transition hover:border-foreground/40"
                  >
                    <span className="flex h-10 w-10 items-center justify-center border border-foreground/20 text-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {title}
                      </p>
                      <p>{detail}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                // There is no backend wired up to this form yet -- rather
                // than fake a "message sent" state, hand off to the
                // visitor's own email client with the details pre-filled
                // so the message actually goes somewhere.
                const subject = `[${message.topic}] Message from ${message.name}`;
                const body = `${message.notes}\n\n-- \n${message.name} (${message.email})`;
                window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
                  subject
                )}&body=${encodeURIComponent(body)}`;
                setSubmitted(true);
              }}
              className="space-y-5 border border-border bg-background px-6 py-8 lg:col-span-7"
            >
              <h2 className="font-display text-xl font-semibold text-foreground">
                Send us a message
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                  Name
                  <input
                    type="text"
                    required
                    value={message.name}
                    onChange={(event) => {
                      setSubmitted(false);
                      setMessage((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }));
                    }}
                    className="h-11 border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                    placeholder="Your name"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                  Email
                  <input
                    type="email"
                    required
                    value={message.email}
                    onChange={(event) => {
                      setSubmitted(false);
                      setMessage((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }));
                    }}
                    className="h-11 border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                    placeholder="you@email.com"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                Topic
                <select
                  value={message.topic}
                  onChange={(event) => {
                    setSubmitted(false);
                    setMessage((prev) => ({
                      ...prev,
                      topic: event.target.value,
                    }));
                  }}
                  className="h-11 border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                >
                  <option>General inquiry</option>
                  <option>Partnership</option>
                  <option>Media or press</option>
                  <option>Support</option>
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                Message body
                <textarea
                  rows={4}
                  required
                  value={message.notes}
                  onChange={(event) => {
                    setSubmitted(false);
                    setMessage((prev) => ({
                      ...prev,
                      notes: event.target.value,
                    }));
                  }}
                  className="border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                  placeholder="Tell us how we can support you."
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90"
              >
                <FiSend className="h-4 w-4" />
                Send message
              </button>
              {submitted ? (
                <p className="text-xs font-medium text-foreground">
                  Opening your email app with this message pre-filled --
                  send it from there and we&apos;ll reply within two
                  business days.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  This opens your email app with your message pre-filled to{" "}
                  {site.email}. We keep your information private and only use
                  it to follow up on your request.
                </p>
              )}
            </form>
          </div>
        </section>
      </div>
    </LandingPageLayout>
  );
};

export default ContactPage;
