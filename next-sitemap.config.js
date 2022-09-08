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
        disallow: [
          "/account",
          "/accounts/*",
          "/login",
          "/logout",
          "/signup",
          "/cart",
          "/orders",
          "/maintenance.html",
          "/404",
          "/saved-listings",
          "/trip/user-trips",
        ],
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
