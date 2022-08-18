import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import Card from "../ui/Card";
import styles from "../../styles/Listing.module.css";
import Rating from "../ui/Rating";
import Badge from "../ui/Badge";

const MapMakerPopup = ({ stay }) => {
  const [isSafari, setIsSafari] = useState(false);

  const currencyToKES = useSelector((state) => state.home.currencyToKES);

  const priceConversionRate = useSelector(
    (state) => state.stay.priceConversionRate
  );

  useEffect(() => {
    if (process.browser) {
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      setIsSafari(isSafari);
    }
  }, []);

  const sortedImages = stay.stay_images.sort((x, y) => y.main - x.main);

  const images = sortedImages.map((image) => {
    return image.image;
  });

  const [newPrice, setNewPrice] = useState();

  const price = () => {
    return (
      stay.price_non_resident ||
      stay.price ||
      stay.per_house_price ||
      stay.deluxe_price_non_resident ||
      stay.deluxe_price ||
      stay.family_room_price_non_resident ||
      stay.family_room_price ||
      stay.executive_suite_room_price_non_resident ||
      stay.executive_suite_room_price ||
      stay.presidential_suite_room_price_non_resident ||
      stay.presidential_suite_room_price ||
      stay.emperor_suite_room_price_non_resident ||
      stay.emperor_suite_room_price
    );
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
  });

  return (
    <div>
      <Card
        imagePaths={images}
        carouselClassName="h-28"
        subCarouselClassName="hidden"
        className={styles.card + " !shadow-sm"}
      >
        <div className="flex flex-col gap-1">
          <h1 className="text-gray-500 text-sm truncate">{stay.name}</h1>
          {!currencyToKES && (
            <h1 className={"font-bold text-xl font-OpenSans "}>
              {price() ? "$" + Math.ceil(price()).toLocaleString() : "No data"}
            </h1>
          )}
          {currencyToKES && (
            <h1 className={"font-bold text-xl font-OpenSans "}>
              {price()
                ? "KES" + Math.ceil(newPrice).toLocaleString()
                : "No data"}
            </h1>
          )}
        </div>
        <div className="font-bold text-sm truncate mt-1">{stay.location}</div>
        {/* <div className="flex items-center gap-1 mt-2">
          <div className={!isSafari ? "-mb-0.5" : "-mb-1"}>
            <Badge
              className={
                stay.rating >= 4.5
                  ? "!bg-green-700"
                  : stay.rating >= 4
                  ? "!bg-green-600"
                  : stay.rating >= 3.5
                  ? "!bg-green-500" 
                  : stay.rating >= 3
                  ? "!bg-yellow-500"
                  : "!bg-red-500"
              }
            >
              {stay.rating}
            </Badge>
          </div>
          <Rating rating={stay.rating} fontSize={!isSafari ? 25 : 16}></Rating>
          <div className="font-medium text-sm">({stay.numRating})</div>
        </div> */}
      </Card>
    </div>
  );
};

MapMakerPopup.propTypes = {};

export default MapMakerPopup;
