import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import Card from "../ui/Card";
import styles from "../../styles/Listing.module.css";
import Rating from "../ui/Rating";
import Badge from "../ui/Badge";
import Price from "../Stay/Price";
import Button from "../ui/Button";
import { useRouter } from "next/router";

const MapMakerPopup = ({ stay }) => {
  const [isSafari, setIsSafari] = useState(false);

  const currencyToKES = useSelector((state) => state.home.currencyToKES);

  const priceConversionRate = useSelector(
    (state) => state.stay.priceConversionRate
  );

  const router = useRouter();

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
        childrenClass="!mt-2"
        className={styles.card + " !shadow-sm"}
      >
        <div className="flex flex-col gap-1">
          <h1 className="text-gray-500 text-sm truncate">{stay.name}</h1>
          <Price stayPrice={price()}></Price>
        </div>
        <div className="font-bold text-sm truncate mt-1">{stay.location}</div>

        <div className="mt-1">
          <Button
            onClick={() => {
              if (router.query.trip) {
                router.push({
                  pathname: `stays/${stay.slug}`,
                  query: {
                    trip: router.query.trip,
                    group_trip: router.query.group_trip,
                  },
                });
              } else {
                router.push(`stays/${stay.slug}`);
              }
            }}
            className="!py-1.5 !w-full !bg-white !border !border-gray-300 !text-black !font-bold"
          >
            View
          </Button>
        </div>
      </Card>
    </div>
  );
};

MapMakerPopup.propTypes = {};

export default MapMakerPopup;
