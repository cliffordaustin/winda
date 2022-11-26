import axios from "axios";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

export const priceConversionRateFunc = async (dispatch) => {
  const rate = Cookies.get("rate");
  let bytes = null;
  if (rate) {
    bytes = CryptoJS.AES.decrypt(rate, "rate");
  }

  if (!bytes || !rate) {
    axios
      .get(`https://api.exchangerate-api.com/v4/latest/usd`)
      .then((res) => {
        let ciphertext = CryptoJS.AES.encrypt(
          res.data.rates.KES.toString(),
          "rate"
        ).toString();

        dispatch({
          type: "SET_PRICE_CONVERSION",
          payload: res.data.rates.KES,
        });

        Cookies.set("rate", ciphertext, {
          //expire in 1 day
          expires: 1,
        });
      })
      .catch(() => {});
  }
};
