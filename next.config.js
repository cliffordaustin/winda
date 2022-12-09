const withTM = require("next-transpile-modules")([
  "@fullcalendar/common",
  "@fullcalendar/list",
  "@fullcalendar/daygrid",
  "@fullcalendar/timegrid",
  "@fullcalendar/interaction",
  "@fullcalendar/react",
]);

module.exports = withTM({
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    domains: [
      "images.unsplash.com",
      "images.pexels.com",
      "winda-guide.s3.amazonaws.com",
      "lh3.googleusercontent.com",
    ],
  },
  redirects() {
    return [
      process.env.MAINTENANCE_MODE === "1"
        ? {
            source: "/((?!maintenance).*)",
            destination: "/maintenance.html",
            permanent: false,
          }
        : null,
    ].filter(Boolean);
  },
});
