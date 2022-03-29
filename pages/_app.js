import { useEffect } from "react";
import "../styles/globals.css";
import { Mixpanel } from "../lib/mixpanelconfig";
import mixpanel from "mixpanel-browser";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // NB: CHANGE DEBUG TO FALSE IN PRODUCTION
    mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN, {
      debug: true,
      ignore_dnt: true,
    });
    mixpanel.register_once("Register Once", {
      "First Login Date": new Date().toISOString(),
    });
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;
