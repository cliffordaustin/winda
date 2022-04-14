import Cookies from "js-cookie";
import axios from "axios";
import getToken from "./getToken";

import { wrapper } from "../redux/store";
import { setStays } from "../redux/actions/stay";

export const getServerSideProps = wrapper.getServerSideProps(
  (context) =>
    async ({ req, res, query }) => {
      let whichPage = new URL(req.url, `https://${req.headers.host}`).pathname;
      let longitude = null;
      let latitude = null;

      switch (whichPage) {
        case "/lodging":
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_baseURL}/stays/?type_of_stay=${
                query.type_of_stay ? query.type_of_stay : ""
              }&min_price=${query.min_price ? query.min_price : ""}&max_price=${
                query.max_price ? query.max_price : ""
              }&min_rooms=${query.min_rooms ? query.min_rooms : ""}&max_rooms=${
                query.max_rooms ? query.max_rooms : ""
              }&ordering=${query.ordering ? query.ordering : ""}`
            );

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
