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
          className={"w-6 h-6"}
          preserveAspectRatio="xMidYMid meet"
          style={{ color: driver.vehicle_color }}
          onClick={() => {
            setShowPopup(!showPopup);
          }}
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="m20.772 10.155l-1.368-4.104A2.995 2.995 0 0 0 16.559 4H7.441a2.995 2.995 0 0 0-2.845 2.051l-1.368 4.104A2 2 0 0 0 2 12v5c0 .738.404 1.376 1 1.723V21a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2h12v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2.277A1.99 1.99 0 0 0 22 17v-5a2 2 0 0 0-1.228-1.845zM7.441 6h9.117c.431 0 .813.274.949.684L18.613 10H5.387l1.105-3.316A1 1 0 0 1 7.441 6zM5.5 16a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 5.5 16zm13 0a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 18.5 16z"
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
