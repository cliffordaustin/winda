import Cookies from "js-cookie";
import axios from "axios";
import getToken from "./getToken";

import { wrapper } from "../redux/store";
import { setStays } from "../redux/actions/stay";

export const getServerSideProps = wrapper.getServerSideProps(
  (context) =>
    async ({ req, res }) => {
      let whichPage = new URL(req.url, `https://${req.headers.host}`).pathname;
      let longitude = null;
      let latitude = null;

      switch (whichPage) {
        case "/lodging":
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_baseURL}/stays/`
            );

            const location = await axios.get("https://api.ipify.org");
            const latlng = await axios.get(
              `https://ipapi.co/${location.data}/json`
            );

            longitude = latlng.data.longitude;
            latitude = latlng.data.latitude;

            await context.dispatch({
              type: "SET_STAYS",
              payload: response.data.results,
            });
          } catch (error) {
            console.log(error);
          }
        default:
      }

      try {
        const token = getToken(context);

        if (token) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_baseURL}/user/`,
            {
              headers: {
                Authorization: "Token " + token,
              },
            }
          );

          return {
            props: {
              userProfile: response.data[0],
              longitude: longitude,
              latitude: latitude,
            },
          };
        }

        return {
          props: {
            userProfile: "",
            longitude: longitude,
            latitude: latitude,
          },
        };
      } catch (error) {
        if (error.response.status === 401) {
          return {
            redirect: {
              permanent: false,
              destination: "logout",
            },
          };
        } else {
          return {
            props: {
              userProfile: "",
              longitude: longitude,
              latitude: latitude,
            },
          };
        }
      }
    }
);
