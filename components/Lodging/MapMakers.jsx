import React, { useState } from "react";
import PropTypes from "prop-types";
import Map, { Source, Layer, Marker, Popup } from "react-map-gl";
import styles from "../../styles/BottomTooltip.module.css";
import { motion, AnimatePresence } from "framer-motion";
import MapMakerPopup from "./MapMakerPopup";
import { useDispatch, useSelector } from "react-redux";

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

  const price = () => {
    return (
      stay.pricing_per_room ||
      stay.pricing_per_person ||
      stay.pricing_per_whole_place ||
      null
    );
  };

  return (
    <div>
      <Marker longitude={stay.longitude} latitude={stay.latitude}>
        <div
          className={
            "px-2 py-1 -z-10 rounded-md bg-blue-600 relative after:!border-t-blue-600 " +
            styles.tooltip
          }
          onMouseEnter={() => setShowPopup(true)}
          onMouseLeave={() => setShowPopup(false)}
          onClick={() => setShowPopup(!showPopup)}
        >
          <h1 className="font-medium text-xs text-white">
            {price() ? "KES" + price().toLocaleString() : "No data"}
          </h1>
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
                  <MapMakerPopup stay={stay}></MapMakerPopup>
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
            <h1 className="font-medium text-xs text-white">
              {price() ? "KES" + price().toLocaleString() : "No data"}
            </h1>
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
                  <MapMakerPopup stay={activeStay}></MapMakerPopup>
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