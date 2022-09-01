module.exports = {
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
};
