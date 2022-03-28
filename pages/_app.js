import { useEffect } from "react";
import "../styles/globals.css";
import ReactGA from "react-ga4";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    ReactGA.initialize("G-38KB7MCMLH");
    ReactGA.send(window.location.pathname + window.location.search);
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;
