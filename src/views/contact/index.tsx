import PageSeo from "@/components/seo/page-seo";
import { clientJourney } from "@/constants/approach";
import { site } from "@/constants/site";
import { enquirySchema, type EnquiryFormValues } from "@/lib/validation/enquiry-schema";
import { ENQUIRY_TYPES } from "@/types/enquiry";
import LandingPageLayout from "@/layouts/landing-page";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiCheckCircle, FiMail, FiMessageCircle, FiSend, FiUsers } from "react-icons/fi";

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
    title: "General inquiries, media & press",
    detail: site.email,
    icon: FiMail,
    href: `mailto:${site.email}`,
  },
];

const inputClass =
  "h-11 border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30";
const textareaClass =
  "border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30";
const labelClass = "flex flex-col gap-2 text-sm font-medium text-foreground";
const errorClass = "text-xs font-medium text-destructive";

const defaultValues: EnquiryFormValues = {
  fullName: "",
  workEmail: "",
  organization: "",
  enquiryType: ENQUIRY_TYPES[0],
  problemDescription: "",
  existingSystems: "",
  timeframe: "",
  heardAbout: "",
  website: "",
};

const ContactPage = () => {
  const [submitState, setSubmitState] = useState<
    | { status: "idle" }
    | { status: "success"; referenceId: string }
    | { status: "error"; message: string }
  >({ status: "idle" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues,
  });

  const onSubmit = async (values: EnquiryFormValues) => {
    setSubmitState({ status: "idle" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = await response.json();

      if (!response.ok || !body.success) {
        setSubmitState({
          status: "error",
          message: body.error || "Something went wrong. Please try again or email us directly.",
        });
        return;
      }

      setSubmitState({ status: "success", referenceId: body.referenceId });
      reset(defaultValues);
    } catch {
      setSubmitState({
        status: "error",
        message: "Something went wrong. Please check your connection and try again.",
      });
    }
  };

  return (
    <LandingPageLayout>
      <PageSeo
        title="Contact | Data Fellows"
        description="Tell Data Fellows what you're trying to solve. We'll review the request and discuss whether we're a good fit."
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
                Tell us what you&apos;re trying to solve.
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
                Whether you&apos;re dealing with disconnected systems, manual
                processes, unreliable reporting or a software problem, tell
                us what you&apos;re working through. We&apos;ll review the
                request and discuss whether Data Fellows is a good fit.
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
                Business problem? Use the form. For community, partnerships,
                media or anything else, use the channels below.
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

              <div className="space-y-3 border-t border-border pt-6">
                <p className="font-mono text-xs font-semibold uppercase tracking-wide text-foreground">
                  What happens after you submit
                </p>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  {clientJourney.slice(1).map((item) => (
                    <li key={item.step} className="flex gap-2">
                      <span className="font-mono text-xs text-muted-foreground/70">
                        {item.step}
                      </span>
                      {item.title}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-5 border border-border bg-background px-6 py-8 lg:col-span-7"
            >
              <h2 className="font-display text-xl font-semibold text-foreground">
                Tell us about the problem
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <label className={labelClass}>
                  Full name
                  <input
                    {...register("fullName")}
                    maxLength={200}
                    className={inputClass}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                  {errors.fullName ? (
                    <span className={errorClass}>{errors.fullName.message}</span>
                  ) : null}
                </label>
                <label className={labelClass}>
                  Work email
                  <input
                    {...register("workEmail")}
                    type="email"
                    maxLength={254}
                    className={inputClass}
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                  {errors.workEmail ? (
                    <span className={errorClass}>{errors.workEmail.message}</span>
                  ) : null}
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className={labelClass}>
                  Organization (optional)
                  <input
                    {...register("organization")}
                    maxLength={200}
                    className={inputClass}
                    placeholder="Company or team name"
                    autoComplete="organization"
                  />
                  {errors.organization ? (
                    <span className={errorClass}>{errors.organization.message}</span>
                  ) : null}
                </label>
                <label className={labelClass}>
                  Enquiry type
                  <select {...register("enquiryType")} className={inputClass}>
                    {ENQUIRY_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.enquiryType ? (
                    <span className={errorClass}>{errors.enquiryType.message}</span>
                  ) : null}
                </label>
              </div>

              <label className={labelClass}>
                Description of the problem
                <textarea
                  {...register("problemDescription")}
                  rows={4}
                  maxLength={4000}
                  className={textareaClass}
                  placeholder="What's happening, and what have you tried so far?"
                />
                {errors.problemDescription ? (
                  <span className={errorClass}>{errors.problemDescription.message}</span>
                ) : null}
              </label>

              <label className={labelClass}>
                Relevant existing systems or tools (optional)
                <input
                  {...register("existingSystems")}
                  maxLength={2000}
                  className={inputClass}
                  placeholder="e.g. Shopify, Postgres, Zapier"
                />
                {errors.existingSystems ? (
                  <span className={errorClass}>{errors.existingSystems.message}</span>
                ) : null}
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className={labelClass}>
                  Desired project timeframe (optional)
                  <input
                    {...register("timeframe")}
                    maxLength={200}
                    className={inputClass}
                    placeholder="e.g. Within a month"
                  />
                  {errors.timeframe ? (
                    <span className={errorClass}>{errors.timeframe.message}</span>
                  ) : null}
                </label>
                <label className={labelClass}>
                  How did you hear about us? (optional)
                  <input
                    {...register("heardAbout")}
                    maxLength={200}
                    className={inputClass}
                    placeholder="e.g. Referral, LinkedIn, search"
                  />
                  {errors.heardAbout ? (
                    <span className={errorClass}>{errors.heardAbout.message}</span>
                  ) : null}
                </label>
              </div>

              {/* Honeypot -- hidden from sighted and keyboard users via
                  CSS (not type="hidden", so a bot that only skips hidden
                  inputs still fills it in), and never announced to screen
                  readers. Real visitors never see or touch this field. */}
              <div className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
                <label>
                  Website
                  <input {...register("website")} tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiSend className="h-4 w-4" />
                {isSubmitting ? "Sending..." : "Send message"}
              </button>

              <div role="status" aria-live="polite">
                {submitState.status === "success" ? (
                  <p className="flex items-start gap-2 text-sm font-medium text-foreground">
                    <FiCheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-foreground" />
                    <span>
                      Message received. Reference ID: {submitState.referenceId}.
                      We&apos;ll review it and get back to you.
                    </span>
                  </p>
                ) : submitState.status === "error" ? (
                  <p className={errorClass}>{submitState.message}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    We keep your information private and only use it to
                    follow up on your request.
                  </p>
                )}
              </div>
            </form>
          </div>
        </section>
      </div>
    </LandingPageLayout>
  );
};

export default ContactPage;
