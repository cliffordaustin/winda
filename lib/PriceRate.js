import axios from "axios";
import Cookies from "js-cookie";

export const priceConversionRateFunc = async (dispatch) => {
  axios
    .get(`https://api.exchangerate-api.com/v4/latest/usd`)
    .then((res) => {
      console.log("called me");

      dispatch({
        type: "SET_PRICE_CONVERSION",
        payload: res.data.rates.KES,
      });
    })
    .catch(() => {});
};
