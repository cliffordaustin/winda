import axios from "axios";
import Cookies from "js-cookie";

export const priceConversionRateFunc = async (dispatch) => {
  const currencySymbol = Cookies.get("currency");

  if (currencySymbol && currencySymbol === "KES") {
    axios
      .get(
        `https://openexchangerates.org/api/latest.json?app_id=${process.env.NEXT_PUBLIC_OPEN_EXCHANGE_RATES_API_KEY}`
      )
      .then((res) => {
        console.log(res.data.rates.KES);
        dispatch({
          type: "SET_PRICE_CONVERSION",
          payload: res.data.rates.KES,
        });
      })
      .catch(() => {});
  }
};
