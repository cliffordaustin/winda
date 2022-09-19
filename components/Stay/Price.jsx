import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import ClientOnly from "../ClientOnly";

const Price = ({ stayPrice, className = "", currency = "$" }) => {
  const [newPrice, setNewPrice] = useState(null);

  const priceConversionRate = useSelector(
    (state) => state.stay.priceConversionRate
  );

  const currencyToKES = useSelector((state) => state.home.currencyToKES);

  const price = () => {
    return stayPrice;
  };

  const priceConversion = async (price) => {
    if (price) {
      if (currencyToKES && priceConversionRate) {
        setNewPrice(priceConversionRate * price);
      } else {
        setNewPrice(price);
      }
    } else {
      return null;
    }
  };

  useEffect(() => {
    priceConversion(price());
  }, [priceConversionRate, currencyToKES, stayPrice]);

  return (
    <ClientOnly>
      {!currencyToKES && (
        <h1 className={"font-bold text-xl font-OpenSans " + className}>
          {stayPrice >= 0
            ? currency + Math.ceil(stayPrice).toLocaleString()
            : "No data"}
        </h1>
      )}
      {currencyToKES && (
        <h1 className={"font-bold text-xl font-OpenSans " + className}>
          {stayPrice >= 0
            ? "KES" + Math.ceil(newPrice).toLocaleString()
            : "No data"}
        </h1>
      )}
    </ClientOnly>
  );
};

Price.propTypes = {};

export default Price;
