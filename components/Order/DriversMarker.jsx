import React, { useState } from "react";
import PropTypes from "prop-types";
import Map, { Source, Layer, Marker, Popup } from "react-map-gl";
import { motion, AnimatePresence } from "framer-motion";
import MapMakerPopup from "./MapMakerPopup";

function DriversMarker({ driver }) {
  const [showPopup, setShowPopup] = useState(false);

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
  return (
    <Marker longitude={driver.lng} latitude={driver.lat}>
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="img"
          style={{ color: driver.vehicle_color }}
          className={"w-8 h-8"}
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 640 512"
          onClick={() => {
            setShowPopup(!showPopup);
          }}
        >
          <path
            fill="currentColor"
            d="M544 192h-16L419.22 56.02A64.025 64.025 0 0 0 369.24 32H155.33c-26.17 0-49.7 15.93-59.42 40.23L48 194.26C20.44 201.4 0 226.21 0 256v112c0 8.84 7.16 16 16 16h48c0 53.02 42.98 96 96 96s96-42.98 96-96h128c0 53.02 42.98 96 96 96s96-42.98 96-96h48c8.84 0 16-7.16 16-16v-80c0-53.02-42.98-96-96-96zM160 432c-26.47 0-48-21.53-48-48s21.53-48 48-48s48 21.53 48 48s-21.53 48-48 48zm72-240H116.93l38.4-96H232v96zm48 0V96h89.24l76.8 96H280zm200 240c-26.47 0-48-21.53-48-48s21.53-48 48-48s48 21.53 48 48s-21.53 48-48 48z"
          />
        </svg>

        <AnimatePresence exitBeforeEnter>
          {showPopup && (
            <Popup
              closeButton={false}
              // closeOnMove={true}
              closeOnClick={false}
              onOpen={() => {
                setShowPopup(true);
              }}
              onClose={() => {
                setShowPopup(false);
              }}
              longitude={driver.lng}
              latitude={driver.lat}
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
                <MapMakerPopup driver={driver}></MapMakerPopup>
              </motion.div>
            </Popup>
          )}
        </AnimatePresence>
      </div>
    </Marker>
  );
}

DriversMarker.propTypes = {};

export default DriversMarker;
