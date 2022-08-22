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

const MapMakerPopup = ({ activity }) => {
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

  const sortedImages = activity.activity_images.sort((x, y) => y.main - x.main);

  const images = sortedImages.map((image) => {
    return image.image;
  });

  const [newPrice, setNewPrice] = useState();

  const price = () => {
    return activity.price_non_resident;
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
          <h1 className="text-gray-500 text-sm truncate">{activity.name}</h1>
          {activity.price_non_resident ? (
            <Price stayPrice={activity.price_non_resident}></Price>
          ) : null}
          {!activity.price_non_resident && (
            <span className="font-bold text-xl font-OpenSans">Free</span>
          )}
        </div>
        <div className="font-bold text-sm truncate mt-1">
          {activity.location}
        </div>

        <div className="mt-1">
          <Button
            onClick={() => {
              if (router.query.trip) {
                router.push({
                  pathname: `experiences/${activity.slug}`,
                  query: {
                    trip: router.query.trip,
                    group_trip: router.query.group_trip,
                  },
                });
              } else {
                router.push(`experiences/${activity.slug}`);
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
