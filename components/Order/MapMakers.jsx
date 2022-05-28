import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Map, { Source, Layer, Marker, Popup } from "react-map-gl";
import styles from "../../styles/BottomTooltip.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import ListingMapMakerPopup from "./ListingMapMakerPopup";
import { useRouter } from "next/router";

const MapMakers = ({ order, state }) => {
  const [showPopup, setShowPopup] = useState(false);

  const currencyToDollar = useSelector((state) => state.home.currencyToDollar);

  const priceConversionRate = useSelector(
    (state) => state.stay.priceConversionRate
  );

  const router = useRouter();

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

  const [newPrice, setNewPrice] = useState();

  const price = () => {
    return order.price;
  };

  const priceConversion = async (price) => {
    if (price) {
      if (currencyToDollar && priceConversionRate) {
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
      <Marker longitude={order.longitude} latitude={order.latitude}>
        <div
          className={"px-2 py-1 -z-10 rounded-md relative "}
          onClick={() => setShowPopup(!showPopup)}
        >
          {state === "activity" && router.query.experiences === "show" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              className="w-8 h-8"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
              >
                <path d="m14.571 15.004l.858 1.845s3.857.819 3.857 2.767C19.286 21 17.57 21 17.57 21H13l-2.25-1.25" />
                <path d="m9.429 15.004l-.857 1.845s-3.858.819-3.858 2.767C4.714 21 6.43 21 6.43 21H8.5l2.25-1.25L13.5 18" />
                <path d="M3 15.926s2.143-.461 3.429-.922C7.714 8.546 11.57 9.007 12 9.007c.429 0 4.286-.461 5.571 5.997c1.286.46 3.429.922 3.429.922M12 7a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z" />
              </g>
            </svg>
          )}
          {state === "stay" && router.query.stay === "show" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              className="w-6 h-6"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M22 20v-7.826a4 4 0 0 0-1.253-2.908l-7.373-6.968a2 2 0 0 0-2.748 0L3.253 9.266A4 4 0 0 0 2 12.174V20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"
              />
            </svg>
          )}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-8 h-8 text-red-500"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 16 16"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M10.832 2.688A4.056 4.056 0 0 0 8.02 1.5h-.04a4.056 4.056 0 0 0-4 4c-.013.75.198 1.487.606 2.117L7.734 14h.533l3.147-6.383c.409-.63.62-1.367.606-2.117a4.056 4.056 0 0 0-1.188-2.812zM7.925 2.5l.082.01l.074-.01a3.075 3.075 0 0 1 2.941 3.037a2.74 2.74 0 0 1-.467 1.568l-.02.034l-.017.035L8 12.279l-2.517-5.1l-.017-.039l-.02-.034a2.74 2.74 0 0 1-.467-1.568A3.074 3.074 0 0 1 7.924 2.5zm.612 2.169a1 1 0 1 0-1.112 1.663a1 1 0 0 0 1.112-1.663zM6.87 3.837a2 2 0 1 1 2.22 3.326a2 2 0 0 1-2.22-3.326z"
              clipRule="evenodd"
            />
          </svg>
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
      </Marker>
    </div>
  );
};

MapMakers.propTypes = {};

export default MapMakers;
