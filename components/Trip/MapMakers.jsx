import React, { useState } from "react";
import { Marker, Popup } from "react-map-gl";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

const MapMakers = ({ location, num }) => {
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
    <div>
      <Marker longitude={location.longitude} latitude={location.latitude}>
        <div
          onMouseOver={() => setShowPopup(true)}
          onMouseLeave={() => setShowPopup(false)}
          onClick={() => setShowPopup(!showPopup)}
          className="relative"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-10 h-10 text-red-500"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 16 16"
          >
            <path
              fill="white"
              stroke="black"
              strokeWidth="0.7px"
              d="M10.832 2.688A4.056 4.056 0 0 0 8.02 1.5h-.04a4.056 4.056 0 0 0-4 4c-.013.75.198 1.487.606 2.117L7.734 14h.533l3.147-6.383c.409-.63.62-1.367.606-2.117a4.056 4.056 0 0 0-1.188-2.812z"
            ></path>
            <text x="6.5" y="9" fill="black" style={{ fontSize: "6px" }}>
              {num}
            </text>
          </svg>
        </div>

        <AnimatePresence exitBeforeEnter>
          {showPopup && (
            <Popup
              closeButton={false}
              longitude={location.longitude}
              latitude={location.latitude}
            >
              <motion.div
                variants={variants}
                animate="show"
                initial="hide"
                exit="exit"
                className="bg-gray-100 rounded-md p-2 font-bold"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {location.location} - {location.nights} nights
              </motion.div>
            </Popup>
          )}
        </AnimatePresence>
      </Marker>
      {/* <Marker longitude={order.longitude} latitude={order.latitude}>
        <div
          className={"px-2 py-1 -z-10 rounded-md relative "}
          onClick={() => setShowPopup(!showPopup)}
        >
          

          
        </div>

        <AnimatePresence exitBeforeEnter>
          {(router.query.label === "show" || showPopup) && (
            <Popup
              closeButton={false}
              longitude={order.longitude}
              latitude={order.latitude}
            >
              <motion.div
                variants={variants}
                animate="show"
                initial="hide"
                exit="exit"
                className="bg-gray-100 rounded-md p-2 font-bold"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {order.name}
              </motion.div>
            </Popup>
          )}
        </AnimatePresence>
      </Marker> */}
    </div>
  );
};

MapMakers.propTypes = {};

export default MapMakers;
