import { useEffect } from "react";
import "../styles/globals.css";
import ReactGA from "react-ga4";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const env = process.env.NODE_ENV;
    if (env == "development") {
      console.log("Development");
    } else if (env == "production") {
      console.log("Production");
    }
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;
