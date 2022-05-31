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
    <Marker longitude={36.9405449} latitude={-1.1204533}>
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="img"
          className={"w-10 h-10"}
          style={{ color: "#333" }}
          onClick={() => {
            setShowPopup(!showPopup);
          }}
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M16 6h-5.5v4H1v5h2a3 3 0 0 0 3 3a3 3 0 0 0 3-3h6a3 3 0 0 0 3 3a3 3 0 0 0 3-3h2v-3c0-1.11-.89-2-2-2h-2l-3-4m-4 1.5h3.5l1.96 2.5H12V7.5m-6 6A1.5 1.5 0 0 1 7.5 15A1.5 1.5 0 0 1 6 16.5A1.5 1.5 0 0 1 4.5 15A1.5 1.5 0 0 1 6 13.5m12 0a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5Z"
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
              longitude={36.9405449}
              latitude={-1.1204533}
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
