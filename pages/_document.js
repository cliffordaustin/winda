import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,400;1,700&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,400;1,700;1,900&family=Montserrat:ital,wght@0,100;0,200;0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,600&family=Poppins:wght@100;200;300;400;500;700&display=swap"
            rel="stylesheet"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,600&display=swap"
            rel="stylesheet"
          ></link>
          <link
            href="https://fonts.googleapis.com/css2?family=Lobster&display=swap"
            rel="stylesheet"
          ></link>
          <link
            href="https://fonts.googleapis.com/css2?family=Condiment&display=swap"
            rel="stylesheet"
          ></link>
        </Head>
        <body>
          <Main />
          <NextScript />

          {/* <script type="text/javascript">
            {process.browser &&
              !(function (e, t, n) {
                function a() {
                  var e = t.getElementsByTagName("script")[0],
                    n = t.createElement("script");
                  (n.type = "text/javascript"),
                    (n.async = !0),
                    (n.src = "https://beacon-v2.helpscout.net"),
                    e.parentNode.insertBefore(n, e);
                }
                if (
                  ((e.Beacon = n =
                    function (t, n, a) {
                      e.Beacon.readyQueue.push({
                        method: t,
                        options: n,
                        data: a,
                      });
                    }),
                  (n.readyQueue = []),
                  "complete" === t.readyState)
                )
                  return a();
                e.attachEvent
                  ? e.attachEvent("onload", a)
                  : e.addEventListener("load", a, !1);
              })(window, document, window.Beacon || function () {})}
          </script>
          <script type="text/javascript">
            {process.browser &&
              window.Beacon("init", "d22d39bd-cf79-439e-b67b-459ec4e24c1f")}
          </script> */}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
