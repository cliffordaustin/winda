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
