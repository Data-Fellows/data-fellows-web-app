import { products } from "@/constants/products";
import { portfolioProjects } from "@/constants/portfolio";
import CaseStudyPage from "@/views/work/case-study";
import EngineeringCaseStudyPage from "@/views/work/engineering-case-study";
import type { GetStaticPaths, GetStaticProps } from "next";

type CaseStudyRouteProps = {
  slug: string;
  source: "product" | "portfolio";
};

const CaseStudyRoute = ({ slug, source }: CaseStudyRouteProps) => {
  // getStaticPaths only generates params for keys that exist in one of the
  // two arrays below, so the "not found" branches are unreachable in
  // practice -- guarded anyway since the props are plain strings, not
  // type-checked references to a real entry.
  if (source === "product") {
    const product = products.find((item) => item.key === slug);
    if (!product) return null;
    return <CaseStudyPage product={product} />;
  }
  const project = portfolioProjects.find((item) => item.slug === slug);
  if (!project) return null;
  return <EngineeringCaseStudyPage project={project} />;
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [
    ...products.map((product) => ({ params: { slug: product.key } })),
    ...portfolioProjects.map((project) => ({ params: { slug: project.slug } })),
  ],
  fallback: false,
});

export const getStaticProps: GetStaticProps<CaseStudyRouteProps> = async ({
  params,
}) => {
  const slug = params?.slug;
  if (typeof slug !== "string") {
    return { notFound: true };
  }
  if (products.some((item) => item.key === slug)) {
    return { props: { slug, source: "product" } };
  }
  if (portfolioProjects.some((item) => item.slug === slug)) {
    return { props: { slug, source: "portfolio" } };
  }
  return { notFound: true };
};

export default CaseStudyRoute;
