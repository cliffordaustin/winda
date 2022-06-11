import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import Card from "../ui/Card";
import styles from "../../styles/Listing.module.css";
import Rating from "../ui/Rating";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import ClientOnly from "../ClientOnly";

const MapMakerPopup = ({ driver }) => {
  const [isSafari, setIsSafari] = useState(false);

  const currencyToKES = useSelector((state) => state.home.currencyToKES);

  const priceConversionRate = useSelector(
    (state) => state.stay.priceConversionRate
  );

  const [newPrice, setNewPrice] = useState(null);

  const price = () => {
    return driver.price;
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
  }, [price(), currencyToKES, priceConversionRate]);

  useEffect(() => {
    if (process.browser) {
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      setIsSafari(isSafari);
    }
  }, []);

  const sortedImages = driver.transportation_images.sort(
    (x, y) => y.main - x.main
  );

  const images = sortedImages.map((image) => {
    return image.image;
  });

  return (
    <div>
      <Card
        imagePaths={images}
        carouselClassName="h-[150px]"
        subCarouselClassName="hidden"
        className={styles.card + " !shadow-sm"}
        childrenClass="!mt-1"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: driver.vehicle_color }}
          ></div>
          <div className="text-gray-500 flex gap-[3px] lowercase">
            <h1>{driver.vehicle_make}</h1>
            <span className="-mt-[5px] font-bold text-lg text-black">.</span>
            <h1>{driver.type_of_car}</h1>
          </div>
        </div>

        <ClientOnly>
          <div className="flex">
            {!currencyToKES && (
              <h1 className={"font-bold text-xl font-OpenSans "}>
                {price()
                  ? "$" + Math.ceil(price()).toLocaleString()
                  : "No data"}
              </h1>
            )}
            {currencyToKES && (
              <h1 className={"font-bold text-xl font-OpenSans "}>
                {price()
                  ? "KES" + Math.ceil(newPrice).toLocaleString()
                  : "No data"}
              </h1>
            )}

            <span className="inline text-xs mt-1 font-semibold ml-0.5">
              /for {10}km
            </span>
          </div>
        </ClientOnly>

        <div className="flex mt-1">
          <div className="w-5 h-full flex flex-col justify-center self-center">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="w-4 h-4"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="w-[45%] h-[15px] border-r border-gray-400"></div>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="w-4 h-4"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 32 32"
              >
                <path
                  fill="currentColor"
                  d="M16 18a5 5 0 1 1 5-5a5.006 5.006 0 0 1-5 5Zm0-8a3 3 0 1 0 3 3a3.003 3.003 0 0 0-3-3Z"
                />
                <path
                  fill="currentColor"
                  d="m16 30l-8.436-9.949a35.076 35.076 0 0 1-.348-.451A10.889 10.889 0 0 1 5 13a11 11 0 0 1 22 0a10.884 10.884 0 0 1-2.215 6.597l-.001.003s-.3.394-.345.447ZM8.812 18.395c.002 0 .234.308.287.374L16 26.908l6.91-8.15c.044-.055.278-.365.279-.366A8.901 8.901 0 0 0 25 13a9 9 0 1 0-18 0a8.905 8.905 0 0 0 1.813 5.395Z"
                />
              </svg>
            </div>
          </div>
          <div className="flex flex-col gap-2 overflow-hidden">
            <div className="truncate">Nairobi</div>
            <div className="truncate">Naivasha</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

MapMakerPopup.propTypes = {};

export default MapMakerPopup;
