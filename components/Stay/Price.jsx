import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import ClientOnly from "../ClientOnly";

const Price = ({ stayPrice }) => {
  const [newPrice, setNewPrice] = useState(null);

  const priceConversionRate = useSelector(
    (state) => state.stay.priceConversionRate
  );

  const currencyToDollar = useSelector((state) => state.home.currencyToDollar);

  const price = () => {
    return stayPrice;
  };

  const priceConversion = async (price) => {
    if (price) {
      if (currencyToDollar && priceConversionRate) {
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
  }, [priceConversionRate, currencyToDollar]);

  return (
    <ClientOnly>
      {currencyToDollar && (
        <h1 className="font-bold text-xl font-OpenSans">
          {stayPrice ? "$" + Math.ceil(newPrice).toLocaleString() : "No data"}
        </h1>
      )}
      {!currencyToDollar && (
        <h1 className="font-bold text-xl font-OpenSans">
          {stayPrice
            ? "KES" + Math.ceil(stayPrice).toLocaleString()
            : "No data"}
        </h1>
      )}
    </ClientOnly>
  );
};

Price.propTypes = {};

export default Price;
