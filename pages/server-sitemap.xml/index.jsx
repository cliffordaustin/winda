import { getServerSideSitemap } from "next-sitemap";
import { GetServerSideProps } from "next";
import axios from "axios";

export const getServerSideProps = async (ctx) => {
  const paths = [];

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_baseURL}/all-stays/`
  );

  console.log(data[2]);

  data.forEach((item) => {
    paths.push({
      loc: `/stays/${item.slug}`,
      lastmod: item.date_updated,
      priority: 0.5,
    });
  });

  return getServerSideSitemap(ctx, paths);
};

export default function Site() {}
