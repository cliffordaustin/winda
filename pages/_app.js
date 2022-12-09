import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/list/main.css";
import "@fullcalendar/timegrid/main.css";
import "../styles/globals.css";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Provider, useDispatch } from "react-redux";
import store, { wrapper } from "../redux/store";
import NProgress from "nprogress";
import Router, { useRouter } from "next/router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "nprogress/nprogress.css";
import ReactGA from "react-ga4";

import "mapbox-gl/dist/mapbox-gl.css";
import Head from "next/head";
import Script from "next/script";
import { priceConversionRateFunc } from "../lib/PriceRate";
import Cookies from "js-cookie";
import axios from "axios";

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

  const dispatch = useDispatch();

  const getUserLocation = async () => {
    try {
      const res = await axios.get(
        `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.NEXT_PUBLIC_IPGEOLOCATION_API_KEY}`
      );

      if (
        res.data.currency.code === "KES" &&
        Cookies.get("defaultCurrency") !== "0"
      ) {
        dispatch({
          type: "CHANGE_USER_LOCATION",
          payload: true,
        });
        priceConversionRateFunc(dispatch);
        Cookies.set("currency", "KES");
      } else if (
        res.data.currency.code === "KES" &&
        Cookies.get("defaultCurrency") === "0"
      ) {
        dispatch({
          type: "CHANGE_USER_LOCATION",
          payload: true,
        });
      }
    } catch (error) {}
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    priceConversionRateFunc(dispatch);
  }, []);

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
      </Head>

      <Script
        type="text/javascript"
        src="/script.js"
        strategy="beforeInteractive"
      ></Script>
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
