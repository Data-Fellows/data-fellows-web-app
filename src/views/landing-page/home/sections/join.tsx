import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { FiCheckCircle, FiMail, FiSend } from "react-icons/fi";

const roles = ["Professional", "Partner", "Student", "Other"];

const initialFormState = {
  name: "",
  email: "",
  country: "",
  role: roles[0],
};

const Join = () => {
  const [formState, setFormState] = useState(initialFormState);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState(initialFormState);
    setSubmitted(true);
    // TODO: connect to Mailerlite or Discord intake endpoint.
  };

  return (
    <section id="join" className="px-4" aria-labelledby="join-heading">
      <div className="mx-auto max-w-6xl rounded-3xl border border-primary/10 bg-primary/10 px-6 py-12 shadow-lg lg:px-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-16">
          <div className="space-y-6 lg:col-span-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Join
            </span>
            <h2
              id="join-heading"
              className="text-3xl font-semibold text-foreground sm:text-4xl"
            >
              Be part of something bigger.
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Join the Data Fellows community to learn, grow, and help create
              the next generation of tools that make data simple for everyone.
            </p>
            <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span className="rounded-full bg-background px-3 py-1 shadow-sm">
                Global community
              </span>
              <span className="rounded-full bg-background px-3 py-1 shadow-sm">
                Mentorship & projects
              </span>
              <span className="rounded-full bg-background px-3 py-1 shadow-sm">
                Product innovation
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4">
              {["/images/community/Blessing.jpeg", "/images/community/Wuraola.jpeg", "/images/community/Nerat.jpeg"].map(
                (image) => (
                  <div
                    key={image}
                    className="relative h-24 overflow-hidden rounded-2xl border border-primary/20"
                  >
                    <Image
                      src={image}
                      alt="Data Fellows member"
                      fill
                      sizes="(max-width: 768px) 30vw, 200px"
                      className="object-cover"
                    />
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-3xl border border-primary/10 bg-background px-6 py-8 shadow-md"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                  Name
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(event) => {
                      setSubmitted(false);
                      setFormState((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }));
                    }}
                    className="h-11 rounded-full border border-border bg-background px-4 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                    placeholder="Ada Lovelace"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                  Email
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(event) => {
                      setSubmitted(false);
                      setFormState((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }));
                    }}
                    className="h-11 rounded-full border border-border bg-background px-4 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                    placeholder="you@email.com"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                  Country
                  <input
                    type="text"
                    required
                    value={formState.country}
                    onChange={(event) => {
                      setSubmitted(false);
                      setFormState((prev) => ({
                        ...prev,
                        country: event.target.value,
                      }));
                    }}
                    className="h-11 rounded-full border border-border bg-background px-4 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                    placeholder="Nigeria"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                  Role
                  <select
                    value={formState.role}
                    onChange={(event) => {
                      setSubmitted(false);
                      setFormState((prev) => ({
                        ...prev,
                        role: event.target.value,
                      }));
                    }}
                    className="h-11 rounded-full border border-border bg-background px-4 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
                >
                  <FiSend className="h-4 w-4" />
                  Join the Ecosystem
                </button>
                <Link
                  href="mailto:hello@datafellowsai.com"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10"
                >
                  <FiMail className="h-4 w-4" />
                  Contact Us
                </Link>
              </div>

              {submitted ? (
                <p className="flex items-center gap-2 rounded-2xl border border-primary/10 bg-secondary/50 px-4 py-3 text-xs font-medium text-primary">
                  <FiCheckCircle className="h-4 w-4" />
                  Thank you! We&apos;ll follow up with next steps shortly.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  We'll send you the next onboarding steps and an invite to the
                  community within 48 hours.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Join;


