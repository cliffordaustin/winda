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

    additionalSitemaps: [
      `${siteUrl}/stays-server-sitemap.xml`,
      `${siteUrl}/activities-server-sitemap.xml`,
      `${siteUrl}/trips-server-sitemap.xml`,
    ],
  },
  exclude: ["/accounts", "/login", "/logout", "/signup"],
};
