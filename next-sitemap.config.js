const siteUrl = "https://www.winda.guide";

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: ["/accounts", "/login", "/logout", "/signup", "/transport"],
      },
    ],
  },

  additionalPaths: async (config) => {
    const paths = [];
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/stays/`
    );
    data.forEach((item) => {
      paths.push({
        loc: `/stays/${item.slug}`,
        lastmod: item.date_updated,
        priority: 0.5,
      });
    });

    const activities = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/activities/`
    );

    activities.data.forEach((item) => {
      paths.push({
        loc: `/activities/${item.slug}`,
        lastmod: item.date_updated,
        priority: 0.5,
      });
    });

    const trips = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/trips/`);

    trips.data.forEach((item) => {
      paths.push({
        loc: `/trips/${item.slug}`,
        lastmod: item.date_updated,
        priority: 0.7,
      });
    });
    return paths;
  },
  exclude: ["/accounts", "/login", "/logout", "/signup"],
};
