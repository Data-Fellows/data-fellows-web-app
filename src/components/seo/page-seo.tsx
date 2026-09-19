import { DEFAULT_OG_IMAGE, SITE_URL } from "@/constants/site";
import Head from "next/head";

type PageSeoProps = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

// Per-page title/description/canonical/OG/Twitter tags. Next.js's Head
// dedupes by tag (title) and by name/property (meta), keeping the last one
// in the tree -- so this overrides _app.tsx's generic fallback tags as long
// as it's rendered inside the page, same pattern already proven on
// /impact-report.
const PageSeo = ({ title, description, path, image = DEFAULT_OG_IMAGE }: PageSeoProps) => {
  const url = `${SITE_URL}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  );
};

export default PageSeo;
