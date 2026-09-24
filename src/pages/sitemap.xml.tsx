import { SITE_URL } from "@/constants/site";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { GetServerSideProps } from "next";

const STATIC_PATHS = [
  "/",
  "/activities",
  "/community",
  "/products",
  "/impact",
  "/partners",
  "/resources",
  "/about",
  "/contact",
  "/impact-report",
];

const buildSitemap = (paths: string[]) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url>\n    <loc>${SITE_URL}${path}</loc>\n  </url>`).join("\n")}
</urlset>
`;

// Next.js has no built-in sitemap generation in the Pages Router -- this
// route serves as sitemap.xml directly by writing the response and
// returning no props, rather than rendering a page.
const Sitemap = () => null;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const paths = [...STATIC_PATHS];

  const supabase = createSupabaseServerClient({ req, res });
  if (supabase) {
    const { data: challenges } = await supabase
      .from("challenges")
      .select("slug")
      .eq("status", "published");
    for (const challenge of challenges ?? []) {
      paths.push(`/activities/challenges/${challenge.slug}`);
    }
  }

  res.setHeader("Content-Type", "text/xml");
  res.write(buildSitemap(paths));
  res.end();

  return { props: {} };
};

export default Sitemap;
