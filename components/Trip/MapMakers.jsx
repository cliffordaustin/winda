import React, { useState } from "react";
import { Marker, Popup } from "react-map-gl";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

const MapMakers = ({ location }) => {
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
          className="w-10 h-10"
        >
          <Icon className="w-9 h-9 text-gray-800" icon="entypo:location-pin" />
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
