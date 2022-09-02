import axios from "axios";
import Cookies from "js-cookie";
import { Mixpanel } from "../../lib/mixpanelconfig";

export const signup = (payload) => async (dispatch) => {
  let response;

  try {
    response = await axios.post(
      `${process.env.NEXT_PUBLIC_baseURL}/rest-auth/registration/`,
      payload.data
    );
    dispatch({
      type: "ADD_SIGNUP_ERROR",
      payload: {
        errors: [],
      },
    });
    Mixpanel.identify(payload.data.email);
    Mixpanel.track("Signup", {
      email: payload.data.email,
      first_name: payload.data.first_name,
      last_name: payload.data.last_name,
    });
    Cookies.set("token", response.data.key);
    dispatch({
      type: "USER_SIGNUP",
      payload: {
        token: response.data.key,
      },
    });
    if (Cookies.get("cart")) {
      let cart = Cookies.get("cart");
      cart = JSON.parse(decodeURIComponent(cart));

      for (const item of cart) {
        if (item.itemCategory === "stays") {
          await axios
            .post(
              `${process.env.NEXT_PUBLIC_baseURL}/stays/${item.slug}/add-to-cart/`,
              {
                from_date: item.from_date,
                to_date: item.to_date,
                num_of_adults: item.num_of_adults,
                num_of_children: item.num_of_children,
                num_of_adults_non_resident: item.num_of_adults_non_resident,
                num_of_children_non_resident: item.num_of_children_non_resident,
                plan: item.plan,
              },
              {
                headers: {
                  Authorization: "Token " + response.data.key,
                },
              }
            )
            .catch((err) => {
              console.log(err.response);
            });
        } else if (item.itemCategory === "activities") {
          await axios
            .post(
              `${process.env.NEXT_PUBLIC_baseURL}/activities/${item.slug}/add-to-cart/`,
              {
                number_of_people: item.number_of_people,
                number_of_people_non_resident:
                  item.number_of_people_non_resident,
                number_of_sessions: item.number_of_sessions,
                number_of_sessions_non_resident:
                  item.number_of_sessions_non_resident,
                number_of_groups: item.number_of_groups,
                number_of_groups_non_resident:
                  item.number_of_groups_non_resident,
                from_date: item.from_date,
                pricing_type: item.pricing_type,
              },
              {
                headers: {
                  Authorization: "Token " + response.data.key,
                },
              }
            )
            .catch((err) => {
              console.log(err.response);
            });
        } else if (item.itemCategory === "transport") {
          await axios
            .post(
              `${process.env.NEXT_PUBLIC_baseURL}/transport/${item.slug}/add-to-cart/`,
              {
                starting_point: item.starting_point,
                destination: item.destination,
                from_date: item.from_date,
                distance: item.distance,
                user_need_a_driver: item.user_need_a_driver,
                number_of_days: item.number_of_days,
              },
              {
                headers: {
                  Authorization: "Token " + response.data.key,
                },
              }
            )
            .catch((err) => {
              console.log(err.response);
            });
        } else if (item.itemCategory === "flight") {
          await axios
            .post(
              `${process.env.NEXT_PUBLIC_baseURL}/flights/`,
              {
                starting_point: item.starting_point,
                destination: item.destination,
                number_of_people: item.number_of_people,
                flight_types: item.flight_types,
              },
              {
                headers: {
                  Authorization: "Token " + response.data.key,
                },
              }
            )
            .catch((err) => {});
        }
      }
      Cookies.remove("cart");
    }
    payload.router.replace(payload.router.query.redirect || "/");

    // const email = Buffer.from(payload.data.email, "binary").toString("base64");
    // payload.router.push({
    //   pathname: `/accounts/email-confirm/${email}`,
    // });
  } catch (error) {
    dispatch({
      type: "ADD_SIGNUP_ERROR",
      payload: {
        errors: error.response.data,
      },
    });
  }
};

export const login = (payload) => async (dispatch) => {
  let response;
  try {
    response = await axios.post(
      `${process.env.NEXT_PUBLIC_baseURL}/rest-auth/login/`,
      payload.data
    );
    Cookies.set("token", response.data.key);
    dispatch({
      type: "LOGIN",
      payload: {
        token: response.data.key,
      },
    });

    if (Cookies.get("cart")) {
      let cart = Cookies.get("cart");
      cart = JSON.parse(decodeURIComponent(cart));

      for (const item of cart) {
        if (item.itemCategory === "stays") {
          await axios
            .post(
              `${process.env.NEXT_PUBLIC_baseURL}/stays/${item.slug}/add-to-cart/`,
              {
                from_date: item.from_date,
                to_date: item.to_date,
                num_of_adults: item.num_of_adults,
                num_of_children: item.num_of_children,
                num_of_adults_non_resident: item.num_of_adults_non_resident,
                num_of_children_non_resident: item.num_of_children_non_resident,
                plan: item.plan,
              },
              {
                headers: {
                  Authorization: "Token " + response.data.key,
                },
              }
            )
            .catch((err) => {
              console.log(err.response);
            });
        } else if (item.itemCategory === "activities") {
          await axios
            .post(
              `${process.env.NEXT_PUBLIC_baseURL}/activities/${item.slug}/add-to-cart/`,
              {
                number_of_people: item.number_of_people,
                number_of_people_non_resident:
                  item.number_of_people_non_resident,
                number_of_sessions: item.number_of_sessions,
                number_of_sessions_non_resident:
                  item.number_of_sessions_non_resident,
                number_of_groups: item.number_of_groups,
                number_of_groups_non_resident:
                  item.number_of_groups_non_resident,
                from_date: item.from_date,
                pricing_type: item.pricing_type,
              },
              {
                headers: {
                  Authorization: "Token " + response.data.key,
                },
              }
            )
            .catch((err) => {
              console.log(err.response);
            });
        } else if (item.itemCategory === "transport") {
          await axios
            .post(
              `${process.env.NEXT_PUBLIC_baseURL}/transport/${item.slug}/add-to-cart/`,
              {
                starting_point: item.starting_point,
                destination: item.destination,
                from_date: item.from_date,
                distance: item.distance,
                user_need_a_driver: item.user_need_a_driver,
                number_of_days: item.number_of_days,
              },
              {
                headers: {
                  Authorization: "Token " + response.data.key,
                },
              }
            )
            .catch((err) => {
              console.log(err.response);
            });
        } else if (item.itemCategory === "flight") {
          await axios
            .post(
              `${process.env.NEXT_PUBLIC_baseURL}/flights/`,
              {
                starting_point: item.starting_point,
                destination: item.destination,
                number_of_people: item.number_of_people,
                flight_types: item.flight_types,
              },
              {
                headers: {
                  Authorization: "Token " + response.data.key,
                },
              }
            )
            .catch((err) => {});
        }
      }
      Cookies.remove("cart");
    }

    payload.router.replace(payload.router.query.redirect || "/");
    dispatch({
      type: "CHANGE_LOGIN_ERROR_FALSE",
    });
  } catch (error) {
    if (error.response.status === 400) {
      dispatch({
        type: "CHANGE_LOGIN_ERROR_STATE",
      });
    }
  }
};

export const signinWithGoogle = (payload, router) => async (dispatch) => {
  let response;
  try {
    response = await axios.post(
      `${process.env.NEXT_PUBLIC_baseURL}/auth/google/`,
      {
        access_token: payload.access_token,
      }
    );
    Cookies.set("token", response.data.key);
    dispatch({
      type: "LOGIN",
      payload: {
        token: response.data.key,
      },
    });

    if (Cookies.get("cart")) {
      let cart = Cookies.get("cart");
      cart = JSON.parse(decodeURIComponent(cart));

      for (const item of cart) {
        if (item.itemCategory === "stays") {
          await axios
            .post(
              `${process.env.NEXT_PUBLIC_baseURL}/stays/${item.slug}/add-to-cart/`,
              {
                from_date: item.from_date,
                to_date: item.to_date,
                num_of_adults: item.num_of_adults,
                num_of_children: item.num_of_children,
                num_of_adults_non_resident: item.num_of_adults_non_resident,
                num_of_children_non_resident: item.num_of_children_non_resident,
                plan: item.plan,
              },
              {
                headers: {
                  Authorization: "Token " + response.data.key,
                },
              }
            )
            .catch((err) => {
              console.log(err.response);
            });
        } else if (item.itemCategory === "activities") {
          await axios
            .post(
              `${process.env.NEXT_PUBLIC_baseURL}/activities/${item.slug}/add-to-cart/`,
              {
                number_of_people: item.number_of_people,
                number_of_people_non_resident:
                  item.number_of_people_non_resident,
                number_of_sessions: item.number_of_sessions,
                number_of_sessions_non_resident:
                  item.number_of_sessions_non_resident,
                number_of_groups: item.number_of_groups,
                number_of_groups_non_resident:
                  item.number_of_groups_non_resident,
                from_date: item.from_date,
                pricing_type: item.pricing_type,
              },
              {
                headers: {
                  Authorization: "Token " + response.data.key,
                },
              }
            )
            .catch((err) => {
              console.log(err.response);
            });
        } else if (item.itemCategory === "transport") {
          await axios
            .post(
              `${process.env.NEXT_PUBLIC_baseURL}/transport/${item.slug}/add-to-cart/`,
              {
                starting_point: item.starting_point,
                destination: item.destination,
                from_date: item.from_date,
                distance: item.distance,
                user_need_a_driver: item.user_need_a_driver,
                number_of_days: item.number_of_days,
              },
              {
                headers: {
                  Authorization: "Token " + response.data.key,
                },
              }
            )
            .catch((err) => {
              console.log(err.response);
            });
        } else if (item.itemCategory === "flight") {
          await axios
            .post(
              `${process.env.NEXT_PUBLIC_baseURL}/flights/`,
              {
                starting_point: item.starting_point,
                destination: item.destination,
                number_of_people: item.number_of_people,
                flight_types: item.flight_types,
              },
              {
                headers: {
                  Authorization: "Token " + response.data.key,
                },
              }
            )
            .catch((err) => {});
        }
      }
      Cookies.remove("cart");
    }

    router.push(router.query.redirect || "/");
  } catch (error) {}
};

export const logout = (router) => async (dispatch) => {
  dispatch({
    type: "LOGOUT",
  });
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_baseURL}/rest-auth/logout/`,
      "",
      {
        headers: {
          Authorization: "Token " + Cookies.get("token"),
        },
      }
    );
    Cookies.remove("token");
    router.push("/");
  } catch (error) {
    if (error.response.status === 401) {
      Cookies.remove("token");
      router.push("/");
    }
  }
};
