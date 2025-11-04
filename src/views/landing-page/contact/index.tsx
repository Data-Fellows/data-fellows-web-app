import LandingPageLayout from "@/layouts/landing-page";
import Link from "next/link";
import { useState } from "react";
import { FiMail, FiMessageCircle, FiPhone, FiSend } from "react-icons/fi";

const contactChannels = [
  {
    title: "General inquiries",
    detail: "hello@datafellowsai.com",
    icon: FiMail,
    href: "mailto:hello@datafellowsai.com",
  },
  {
    title: "Partnerships",
    detail: "partners@datafellowsai.com",
    icon: FiMessageCircle,
    href: "mailto:partners@datafellowsai.com",
  },
  {
    title: "Press",
    detail: "press@datafellowsai.com",
    icon: FiPhone,
    href: "tel:+1234567890",
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
      <div className="space-y-20 pt-28 md:space-y-24 md:pt-32">
        <section className="px-4" aria-labelledby="contact-hero-heading">
          <div className="mx-auto max-w-6xl rounded-3xl border border-primary/10 bg-secondary/40 px-6 py-12 lg:px-12">
            <div className="space-y-4 text-center">
              <h1
                id="contact-hero-heading"
                className="text-3xl font-semibold text-foreground sm:text-4xl"
              >
                Let's build something together.
              </h1>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground">
                Whether you want to partner with Data Fellows, feature a Fellow,
                or learn more about Inscend, we would love to hear from you.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4" aria-labelledby="contact-details-heading">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12 lg:items-start lg:gap-16">
            <div className="space-y-6 rounded-3xl border border-primary/10 bg-background px-6 py-8 lg:col-span-5">
              <h2
                id="contact-details-heading"
                className="text-2xl font-semibold text-foreground sm:text-3xl"
              >
                Reach the team
              </h2>
              <p className="text-sm text-muted-foreground">
                Drop a note to any of the channels below and someone from Data
                Fellows will get back within two business days.
              </p>
              <div className="space-y-4">
                {contactChannels.map(({ title, detail, icon: Icon, href }) => (
                  <Link
                    key={title}
                    href={href}
                    className="flex items-center gap-4 rounded-2xl border border-primary/10 bg-secondary/50 px-5 py-4 text-sm text-muted-foreground transition hover:border-primary/30"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
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
                setSubmitted(true);
                setMessage({
                  name: "",
                  email: "",
                  topic: "General inquiry",
                  notes: "",
                });
              }}
              className="space-y-5 rounded-3xl border border-primary/10 bg-background px-6 py-8 lg:col-span-7"
            >
              <h2 className="text-xl font-semibold text-foreground">
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
                    className="h-11 rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
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
                    className="h-11 rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
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
                  className="h-11 rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                >
                  <option>General inquiry</option>
                  <option>Partnership</option>
                  <option>Media or press</option>
                  <option>Support</option>
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                Message
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
                  className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                  placeholder="Tell us how we can support you."
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                <FiSend className="h-4 w-4" />
                Send message
              </button>
              {submitted ? (
                <p className="text-xs font-medium text-primary">
                  Thank you! We will respond as soon as possible.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  We keep your information private and only use it to follow up
                  on your request.
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

