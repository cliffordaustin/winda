import { getServerSideSitemap } from "next-sitemap";
import axios from "axios";

export const getServerSideProps = async (ctx) => {
  const paths = [];
  const siteUrl = "https://www.winda.guide";

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_baseURL}/all-trips/`
  );

  data.results.forEach((item) => {
    paths.push({
      loc: `${siteUrl}/trip/${item.slug}`,
      lastmod: item.updated_at,
      priority: 0.7,
    });
  });

  return getServerSideSitemap(ctx, paths);
};

export default function Site() {}
