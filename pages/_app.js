import { useEffect } from "react";
import "../styles/globals.css";
import { Mixpanel } from "../lib/mixpanelconfig";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    console.log("Token mapbox ", process.env.NEXT_PUBLIC_MAPBOX_API_KEY);
    //Mixpanel.register_once({ "First Login Date": new Date().toISOString() });
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;
