import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Map, { Source, Layer, Marker, Popup } from "react-map-gl";
import styles from "../../styles/BottomTooltip.module.css";
import { motion, AnimatePresence } from "framer-motion";
import MapMakerPopup from "./MapMakerPopup";
import { useDispatch, useSelector } from "react-redux";

import Price from "../Stay/Price";

const MapMakers = ({ stay }) => {
  const [showPopup, setShowPopup] = useState(false);

  const activeStay = useSelector((state) => state.stay.activeStay);

  const variants = {
    hide: {
      y: -5,
    },
    show: {
      y: 0,
      opacity: 1,
      scale: 1,
    },
    exit: {
      opacity: 0,
      y: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  const price = (stay) => {
    return stay.is_an_event
      ? stay.event_price
      : stay.price_non_resident ||
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
          stay.emperor_suite_room_price;
  };

  const getStandardRoomPrice = (stay) => {
    const standardRoom = stay.type_of_rooms.find(
      (room) => room.is_standard === true
    );
    return standardRoom.price;
  };

  return (
    <div>
      <Marker longitude={stay.longitude} latitude={stay.latitude}>
        <div
          className={
            "px-2 py-1 -z-10 rounded-md bg-white border relative after:!border-t-white " +
            styles.tooltip
          }
          onMouseEnter={() => setShowPopup(true)}
          onMouseLeave={() => setShowPopup(false)}
          onClick={() => setShowPopup(!showPopup)}
        >
          {!stay.is_an_event && (
            <Price
              className="text-black !text-sm"
              stayPrice={price(stay)}
            ></Price>
          )}
          {stay.is_an_event && (
            <Price
              className="text-black !text-sm"
              stayPrice={getStandardRoomPrice(stay)}
            ></Price>
          )}

          <AnimatePresence exitBeforeEnter>
            {showPopup && (
              <Popup
                closeButton={false}
                closeOnClick={false}
                longitude={stay.longitude}
                latitude={stay.latitude}
              >
                <motion.div
                  variants={variants}
                  animate="show"
                  initial="hide"
                  exit="exit"
                  className="w-60 absolute -ml-[120px] left-2/4 mt-4 top-full mb-1"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <MapMakerPopup
                    price={price}
                    standardRoomPrice={getStandardRoomPrice}
                    stay={stay}
                  ></MapMakerPopup>
                </motion.div>
              </Popup>
            )}
          </AnimatePresence>
        </div>
      </Marker>
      {activeStay && (
        <Marker longitude={activeStay.longitude} latitude={activeStay.latitude}>
          <div
            className={
              "px-2 py-1 -z-10 rounded-md bg-red-500 relative after:!border-t-red-500 " +
              styles.tooltip
            }
          >
            {!activeStay.is_an_event && (
              <Price
                className="text-white !text-sm"
                stayPrice={price(activeStay)}
              ></Price>
            )}
            {activeStay.is_an_event && (
              <Price
                className="text-white !text-sm"
                stayPrice={getStandardRoomPrice(activeStay)}
              ></Price>
            )}
            <AnimatePresence exitBeforeEnter>
              <Popup
                closeButton={false}
                closeOnClick={false}
                longitude={activeStay.longitude}
                latitude={activeStay.latitude}
              >
                <motion.div
                  variants={variants}
                  animate="show"
                  initial="hide"
                  exit="exit"
                  className="w-60 absolute -ml-[120px] left-2/4 mt-4 top-full mb-1"
                >
                  <MapMakerPopup
                    price={price}
                    standardRoomPrice={getStandardRoomPrice}
                    stay={activeStay}
                  ></MapMakerPopup>
                </motion.div>
              </Popup>
            </AnimatePresence>
          </div>
        </Marker>
      )}
    </div>
  );
};

MapMakers.propTypes = {};

export default MapMakers;
