import "../styles/globals.css";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Provider } from "react-redux";
import store, { wrapper } from "../redux/store";
import NProgress from "nprogress";
import Router, { useRouter } from "next/router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "nprogress/nprogress.css";
import ReactGA from "react-ga4";

import "mapbox-gl/dist/mapbox-gl.css";
import Head from "next/head";

NProgress.configure({
  minimum: 0.3,
  easing: "ease",
  speed: 800,
  showSpinner: false,
});

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

if (process.env.NODE_ENV === "development") {
  ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID);
  if (process.browser) {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }
} else if (process.env.NODE_ENV === "production") {
  ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID);
  if (process.browser) {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }
}

function MyApp({ Component, pageProps, router }) {
  const isProd = process.env.NODE_ENV === "production";
  const base = isProd ? "https://www.winda.com" : "http://localhost:3000";
  const canonical = (base + (router.asPath === "/" ? "" : router.asPath)).split(
    "?"
  )[0];

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_SOCAIL_AUTH_CLIENT_ID}
    >
      <Head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        ></link>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        ></link>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        ></link>
        <link rel="canonical" href={canonical} />
        <link rel="manifest" href="/site.webmanifest"></link>

        <meta name="msapplication-TileColor" content="#DC2626"></meta>
        <meta name="theme-color" content="#ffffff"></meta>
        <meta
          property="og:title"
          content="Winda.guide | book travel essentials in Kenya"
        ></meta>
        <meta property="og:image" content="/images/image-header.jpg"></meta>

        <meta name="twitter:card" content="/images/image-header.jpg" />

        <script type="text/javascript" src="/script.js" defer></script>
        {/* <meta name="twitter:site" content="@digitalocean" />
        <meta name="twitter:title" content="Sammy the Shark" />
        <meta
          name="twitter:description"
          content="Senior Selachimorpha at DigitalOcean"
        />
        <meta
          name="twitter:image"
          content="https://html.sammy-codes.com/images/large-profile.jpg"
        /> */}
      </Head>
      <Provider store={store.store}>
        <motion.div
          key={router.route}
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
        >
          <Component {...pageProps} />
        </motion.div>
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default wrapper.withRedux(MyApp);
