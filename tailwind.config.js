module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Merriweather: ["Merriweather", "sans-serif"],
        lobster: ["Lobster", "sans-serif"],
        OpenSans: ["Open Sans", "sans-serif"],
      },

      screens: {
        mobile: "380px",
        tablet: "640px",

        laptop: "1024px",

        desktop: "1280px",
      },

      width: {
        325: "325px",
        500: "500px",
        600: "600px",
        800: "800px",
        "45p": "45%",
        "23p": "23%",
        "90p": "90%",
      },

      height: {
        325: "325px",
        500: "500px",
        600: "600px",
        800: "800px",
        "10p": "10%",
        40: "40%",
        60: "60%",
        30: "30%",
        70: "70%",
        80: "80%",
        "90p": "90%",
      },

      maxWidth: {
        230: "230px",
      },
    },
  },
  plugins: [],
};
