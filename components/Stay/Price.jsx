import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import ClientOnly from "../ClientOnly";
import Cookies from "js-cookie";
import axios from "axios";

const Price = ({ stayPrice, className = "", currency = "$" }) => {
  const priceConversionRate = useSelector(
    (state) => state.stay.priceConversionRate
  );

  const userIsFromKenya = useSelector((state) => state.home.userIsFromKenya);

  const [currencySymbol, setCurrencySymbol] = useState(Cookies.get("currency"));

  useEffect(() => {
    if (Cookies.get("defaultCurrency") !== "0") {
      setCurrencySymbol(userIsFromKenya ? "KES" : null);
    }
  }, [userIsFromKenya]);

  return (
    <ClientOnly>
      {(!currencySymbol || currencySymbol === "USD") && (
        <h1 className={"font-bold text-xl font-OpenSans " + className}>
          {stayPrice >= 0
            ? currency + Math.round(stayPrice).toLocaleString()
            : "No data"}
        </h1>
      )}
      {currencySymbol && currencySymbol === "KES" && (
        <h1 className={"font-bold text-xl font-OpenSans " + className}>
          {stayPrice >= 0
            ? "KES" +
              Math.round(stayPrice * priceConversionRate).toLocaleString()
            : "No data"}
        </h1>
      )}
    </ClientOnly>
  );
};

Price.propTypes = {};

export default Price;
