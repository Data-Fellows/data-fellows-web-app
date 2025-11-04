import Image from "next/image";
import { useRouter } from "next/router";
import { FiArrowRightCircle, FiUsers } from "react-icons/fi";

const rhythm = [
  {
    title: "Community Sunday Catchup",
    cadence: "Every two weeks",
  },
  {
    title: "Fireside Sessions",
    cadence: "Once a month",
  },
  {
    title: "Newsletter",
    cadence: "Every two weeks",
  },
  {
    title: "Journey So Far",
    cadence: "Stories from members -- last Friday monthly",
  },
];

const Community = () => {
  const router = useRouter();

  return (
    <section
      id="community"
      className="px-4"
      aria-labelledby="community-heading"
    >
      <div className="mx-auto max-w-6xl rounded-3xl border border-primary/10 bg-secondary/10 px-6 py-12 lg:px-10 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="space-y-6 lg:col-span-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Community
            </span>
            <h2
              id="community-heading"
              className="text-3xl font-semibold text-foreground sm:text-4xl"
            >
              Learn, connect, and grow with others like you.
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              The heart of Data Fellows is its people. We partner with DataCamp,
              Zummit Africa, and Vatebra Academy to offer quality training.
              Members join mentorship sessions, group projects, and live events
              that turn lessons into real experience.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {rhythm.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-primary/10 bg-background px-4 py-4"
                >
                  <p className="text-sm font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.cadence}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => router.push("/community")}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <FiUsers className="h-4 w-4" />
              Join the Community
            </button>
          </div>

          <div className="space-y-4 lg:col-span-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="group relative h-52 overflow-hidden rounded-3xl border border-primary/10 bg-background">
                <Image
                  src="/images/community/Agada.jpeg"
                  alt="Community members during a virtual catchup"
                  fill
                  sizes="(max-width: 768px) 50vw, 280px"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="group relative h-52 overflow-hidden rounded-3xl border border-primary/10 bg-background sm:mt-6">
                <Image
                  src="/images/community/Nerat.jpeg"
                  alt="Mentorship session with Fellows"
                  fill
                  sizes="(max-width: 768px) 50vw, 280px"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            </div>
            <div className="rounded-3xl border border-primary/10 bg-background px-6 py-5">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <FiArrowRightCircle className="h-5 w-5 text-primary" />
                <span>
                  Ready to collaborate? Head into the Discord, say hi, and join
                  a project squad today.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
