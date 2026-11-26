import type { ReactNode } from "react";

type LegalSectionProps = {
  title: string;
  children: ReactNode;
};

const LegalSection = ({ title, children }: LegalSectionProps) => (
  <section className="space-y-3">
    <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
      {title}
    </h2>
    <div className="space-y-3 text-muted-foreground">{children}</div>
  </section>
);

export default LegalSection;
