import axios from "axios";
import Cookies from "js-cookie";

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
              {},
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
              {},
              {
                headers: {
                  Authorization: "Token " + response.data.key,
                },
              }
            )
            .catch((err) => {
              console.log(err.response);
            });
        }
      }
      Cookies.remove("cart");
    }
    payload.router.push(payload.router.query.redirect || "/");
  } catch (error) {
    console.log(error.response.data);

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
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_baseURL}/stays/${item.slug}/add-to-cart/`,
            {},
            {
              headers: {
                Authorization: "Token " + response.data.key,
              },
            }
          )
          .catch((err) => {
            console.log(err.response);
          });
      }
      Cookies.remove("cart");
    }

    payload.router.push(payload.router.query.redirect || "/");
    dispatch({
      type: "CHANGE_LOGIN_ERROR_FALSE",
    });
  } catch (error) {
    console.log(error.response.data);
    if (error.response.status === 400) {
      dispatch({
        type: "CHANGE_LOGIN_ERROR_STATE",
      });
    }
  }
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
