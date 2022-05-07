import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import Card from "../ui/Card";
import styles from "../../styles/Listing.module.css";
import Rating from "../ui/Rating";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const MapMakerPopup = ({ driver }) => {
  const [isSafari, setIsSafari] = useState(false);

  const currencyToDollar = useSelector((state) => state.home.currencyToDollar);

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

  return (
    <div>
      <Card
        imagePaths={[driver.vehicle_image]}
        carouselClassName="h-[150px]"
        subCarouselClassName="hidden"
        className={styles.card + " !shadow-sm"}
        childrenClass="!mt-1"
      >
        {driver.status === "available" && (
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="font-bold">Available</span>
          </div>
        )}

        {driver.status === "not available" && (
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="font-bold">Not available</span>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <h1 className="text-gray-800 text-sm truncate font-medium">
            {driver.name}
          </h1>
        </div>

        <div className="font-bold text-sm truncate mt-1">
          <span className="text-sm font-medium text-gray-500">Plate #: </span>
          {driver.vehicle_plate}
        </div>

        <div className="flex gap-2 items-center">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: driver.vehicle_color }}
          ></div>
          <div className="font-bold">
            {driver.vehicle_year} {driver.vehicle_make}
          </div>
        </div>

        <div className="flex gap-2 w-full mt-1">
          <Button className="w-[70%] !py-1 !bg-blue-500 !font-bold">
            Order
          </Button>
          <Button className="w-2/4 !py-1 !bg-green-600 !font-bold">Call</Button>
        </div>
      </Card>

      <div>
        {driver.vehicle_type === "SUV" && driver.vehicle === "car" && (
          <div className="absolute top-2 left-2 z-10 flex gap-1">
            <div className="px-2 rounded-md bg-lime-600 text-white">Car</div>
            <div className="px-2 rounded-md bg-blue-600 text-white">SUV</div>
          </div>
        )}
        {driver.vehicle_type === "Sedan" && driver.vehicle === "car" && (
          <div className="absolute top-2 left-2 z-10 flex gap-1">
            <div className="px-2 rounded-md bg-lime-600 text-white">Car</div>
            <div className="px-2 rounded-md bg-blue-600 text-white">Sedan</div>
          </div>
        )}
        {driver.vehicle_type === "Estate" && driver.vehicle === "car" && (
          <div className="absolute top-2 left-2 z-10 flex gap-1">
            <div className="px-2 rounded-md bg-lime-600 text-white">Car</div>
            <div className="px-2 rounded-md bg-blue-600 text-white">Estate</div>
          </div>
        )}
      </div>
    </div>
  );
};

MapMakerPopup.propTypes = {};

export default MapMakerPopup;
