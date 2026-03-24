import Image from "next/image";

const quotes = [
  {
    quote:
      "Beyond skills, Data Fellows has given me hope, clarity, and confidence in my data journey. And for that, I'm certain success is only a matter of time.",
    name: "Jeremiah Colman, Data Fellow",
    image: "/images/community/Blessing.jpeg",
  },
  {
    quote:
      "Family through and through. The connections, insights, and knowledge shared here have shaped the way I approach my career and goals.",
    name: "Hephzibah Otuene, Data Fellow",
    image: "/images/community/James.jpeg",
  },
];

const stats = [
  { value: "1000+", label: "Members" },
  { value: "15+", label: "Countries" },
  { value: "20+", label: "Pilot projects launched" },
];

const statAccentClasses = [
  {
    card: "border-primary/30 bg-primary/10",
    value: "text-primary",
  },
  {
    card: "border-accent/30 bg-accent/10",
    value: "text-accent-foreground",
  },
  {
    card: "border-ring/30 bg-ring/10",
    value: "text-ring",
  },
];

const WhoWeAre = () => {
  return (
    <section
      id="who-we-are"
      className="px-4 sm:px-6"
      aria-labelledby="who-we-are-heading"
    >
      <div className="mx-auto max-w-6xl space-y-10 lg:space-y-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="space-y-6 lg:col-span-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Who we are
            </span>
            <h2
              id="who-we-are-heading"
              className="text-3xl font-semibold text-foreground sm:text-4xl"
            >
              More than a network -- a global family of thinkers and doers.
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Data Fellows began with one idea: learning data should lead to doing something real.
              We help people learn, test ideas, and build tools that make life and business better.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              Today we have over one thousand members across fifteen countries and twenty pilot projects already launched.
              Every Fellow brings a unique perspective, and together we turn insight into action.
            </p>
            <div className="space-y-4">
              {quotes.map((item) => (
                <blockquote
                  key={item.quote}
                  className="rounded-2xl border border-primary/10 bg-background px-5 py-4 text-sm text-foreground"
                >
                  <p className="font-semibold">"{item.quote}"</p>
                  <span className="mt-2 block text-xs font-medium text-muted-foreground">
                    {item.name}
                  </span>
                </blockquote>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="group relative h-72 overflow-hidden rounded-3xl border border-primary/10 bg-background sm:h-64">
                <Image
                  src="/images/community/osaretin-ebuehi.jpg"
                  alt="Osaretin Ebuehi sharing a build update"
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover object-top transition duration-500 group-hover:scale-105"
                  priority
                />
              </div>
              <div className="group relative h-72 overflow-hidden rounded-3xl border border-primary/10 bg-background sm:mt-10 sm:h-64">
                <Image
                  src="/images/community/BISMA.jpg"
                  alt="Bisma Aji Manggala-Process Engineer"
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover object-top transition duration-500 group-hover:scale-105"
                  style={{ objectPosition: "center 25%" }}
                />
              </div>
              <div className="group relative h-72 overflow-hidden rounded-3xl border border-primary/10 bg-background sm:-mt-10 sm:h-64">
                <Image
                  src="/images/community/Yumna-BigDatafacilitator.jpg"
                  alt="Yumna Gamal collaborating with Fellows"
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover object-top transition duration-500 group-hover:scale-105"
                  style={{ objectPosition: "center 25%" }}
                />
              </div>
              <div className="group relative h-72 overflow-hidden rounded-3xl border border-primary/10 bg-background sm:h-64">
                <Image
                  src="/images/community/chiamaka-aniagor.jpg"
                  alt="Chiamaka Aniagor during a Fellows showcase"
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover object-top transition duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 rounded-3xl border border-border/70 bg-card/80 p-6 shadow-lg shadow-primary/5 backdrop-blur dark:bg-card/40 sm:grid-cols-3">
          {stats.map((stat, index) => {
            const accent = statAccentClasses[index % statAccentClasses.length];
            return (
              <div
                key={stat.label}
                className={`rounded-2xl border px-5 py-6 text-center shadow-sm shadow-black/5 dark:shadow-black/30 ${accent.card}`}
              >
                <p className={`text-4xl font-semibold ${accent.value}`}>
                  {stat.value}
                </p>
                <p className="text-xs uppercase tracking-wide text-muted-foreground/90">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;

