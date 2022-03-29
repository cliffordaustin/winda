import { useEffect } from "react";
import "../styles/globals.css";
import { Mixpanel } from "../lib/mixpanelconfig";

import mixpanel from "mixpanel-browser";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    Mixpanel.register_once({ "First Login Date": new Date().toISOString() });
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;
