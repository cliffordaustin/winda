import axios from "axios";
import Cookies from "js-cookie";

export const priceConversionRateFunc = async (dispatch) => {
  if (
    Cookies.get("user_has_request_exchange_rate_api") !== "1" ||
    !localStorage.getItem("persist:priceConversionRate")
  ) {
    axios
      .get(`https://api.exchangerate-api.com/v4/latest/usd`)
      .then((res) => {
        Cookies.set("user_has_request_exchange_rate_api", "1", {
          expires: 1,
        });
        dispatch({
          type: "SET_PRICE_CONVERSION",
          payload: res.data.rates.KES,
        });
      })
      .catch(() => {});
  }
};
