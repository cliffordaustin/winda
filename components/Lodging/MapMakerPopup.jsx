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
import { Mixpanel } from "../../lib/mixpanelconfig";

const MapMakerPopup = ({ stay, price, standardRoomPrice }) => {
  const [isSafari, setIsSafari] = useState(false);

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
          {!stay.is_an_event && <Price stayPrice={price(stay)}></Price>}
          {stay.is_an_event && (
            <Price stayPrice={standardRoomPrice(stay)}></Price>
          )}
        </div>
        <div className="font-bold text-sm truncate mt-1">{stay.location}</div>

        <div className="mt-1">
          <Button
            onClick={() => {
              if (router.query.trip) {
                Mixpanel.track(
                  "User clicked on an accommodation from the map",
                  {
                    name_of_accommodation: stay.name,
                  }
                );
                router.push({
                  pathname: `stays/${stay.slug}`,
                  query: {
                    trip: router.query.trip,
                    group_trip: router.query.group_trip,
                  },
                });
              } else {
                Mixpanel.track(
                  "User clicked on an accommodation from the map",
                  {
                    name_of_accommodation: stay.name,
                  }
                );
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
