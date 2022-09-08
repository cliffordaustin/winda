import { getServerSideSitemap } from "next-sitemap";
import axios from "axios";

export const getServerSideProps = async (ctx) => {
  const siteUrl = "https://www.winda.guide";

  const paths = [];

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_baseURL}/all-stays/`
  );

  data.results.forEach((item) => {
    paths.push({
      loc: `${siteUrl}/stays/${item.slug}`,
      lastmod: item.date_updated,
      priority: 0.5,
    });
  });

  return getServerSideSitemap(ctx, paths);
};

export default function Site() {}
