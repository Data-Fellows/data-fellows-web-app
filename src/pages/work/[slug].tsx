import { products } from "@/constants/products";
import CaseStudyPage from "@/views/work/case-study";
import type { GetStaticPaths, GetStaticProps } from "next";

type CaseStudyRouteProps = {
  productKey: string;
};

const CaseStudyRoute = ({ productKey }: CaseStudyRouteProps) => {
  const product = products.find((item) => item.key === productKey);
  // getStaticPaths only generates params for keys that exist in `products`,
  // so this is unreachable in practice -- guarded anyway since the prop is
  // a plain string, not a type-checked reference to a real entry.
  if (!product) return null;
  return <CaseStudyPage product={product} />;
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: products.map((product) => ({ params: { slug: product.key } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<CaseStudyRouteProps> = async ({
  params,
}) => {
  const slug = params?.slug;
  if (typeof slug !== "string" || !products.some((item) => item.key === slug)) {
    return { notFound: true };
  }
  return { props: { productKey: slug } };
};

export default CaseStudyRoute;
