import "../styles/globals.css";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Provider } from "react-redux";
import store, { wrapper } from "../redux/store";
import NProgress from "nprogress";
import Router from "next/router";
import "nprogress/nprogress.css";

import "mapbox-gl/dist/mapbox-gl.css";

NProgress.configure({
  minimum: 0.3,
  easing: "ease",
  speed: 800,
  showSpinner: false,
});

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps, router }) {
  return (
    <Provider store={store.store}>
      <motion.div
        key={router.route}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
      >
        <Component {...pageProps} />
      </motion.div>
    </Provider>
  );
}

export default wrapper.withRedux(MyApp);
