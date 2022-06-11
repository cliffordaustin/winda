import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";
import Cookies from "js-cookie";

import Card from "../ui/Card";
import styles from "../../styles/Listing.module.css";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";

const TripTransportCard = ({
  images,
  transport,
  tripId,
  tripSlug,
  groupTripSlug,
  isGroupTripTransport = false,
}) => {
  const [newPrice, setNewPrice] = useState(null);

  const currencyToKES = useSelector((state) => state.home.currencyToKES);

  const priceConversionRate = useSelector(
    (state) => state.stay.priceConversionRate
  );

  const [showLoader, setShowLoader] = useState(false);

  const price = () => {
    return transport.price;
  };

  const priceConversion = async (price) => {
    if (price) {
      if (currencyToKES && priceConversionRate) {
        setNewPrice(priceConversionRate * price);
      } else {
        setNewPrice(price);
      }
    } else {
      return null;
    }
  };

  const addToTrip = async () => {
    setShowLoader(true);
    if (!isGroupTripTransport) {
      await axios
        .put(
          `${process.env.NEXT_PUBLIC_baseURL}/trip/${tripSlug}/`,
          {
            transport_id: transport.id,
          },
          {
            headers: {
              Authorization: "Token " + Cookies.get("token"),
            },
          }
        )
        .then(() => {
          location.reload();
        })
        .catch((err) => {
          console.log(err.response);
          setShowLoader(false);
        });
    } else if (isGroupTripTransport) {
      await axios
        .put(
          `${process.env.NEXT_PUBLIC_baseURL}/trips/${groupTripSlug}/`,
          {
            transport_id: transport.id,
          },
          {
            headers: {
              Authorization: "Token " + Cookies.get("token"),
            },
          }
        )
        .then(() => {
          location.reload();
        })
        .catch((err) => {
          console.log(err);
          setShowLoader(false);
        });
    }
  };

  useEffect(() => {
    priceConversion(price());
  }, [price(), currencyToKES, priceConversionRate]);
  return (
    <div>
      <Card
        imagePaths={images}
        carouselClassName="h-[150px]"
        subCarouselClassName="hidden"
        className={styles.card + " !shadow-sm"}
        childrenClass="!mt-1"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: transport.vehicle_color }}
          ></div>
          <div className="text-gray-500 flex gap-[3px] lowercase">
            <h1>{transport.vehicle_make}</h1>
            <span className="-mt-[5px] font-bold text-lg text-black">.</span>
            <h1>{transport.type_of_car}</h1>
          </div>
        </div>

        <div className="flex gap-1">
          {!currencyToKES && (
            <h1 className={"font-bold text-xl font-OpenSans "}>
              {price() ? "$" + Math.ceil(price()).toLocaleString() : "No data"}
            </h1>
          )}
          {currencyToKES && (
            <h1 className={"font-bold text-xl font-OpenSans "}>
              {price()
                ? "KES" + Math.ceil(newPrice).toLocaleString()
                : "No data"}
            </h1>
          )}
          <div className="text-xs mt-1">/10km</div>
        </div>

        <div className="mt-1 mb-2">
          <h1 className="font-semibold mb-1 text-sm">Driver operates within</h1>
          <div className="flex flex-wrap">
            {transport.dropoff_city.split(",").map((city, index) => (
              <div
                key={index}
                className="bg-blue-500 text-xs mt-0.5 text-white px-1 font-bold py-1 mr-1 rounded-full"
              >
                {city}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2">
          <div
            onClick={(e) => {
              addToTrip();
            }}
            className="py-1.5 rounded-md bg-blue-600 bg-opacity-10 gap-1 flex cursor-pointer font-bold items-center justify-center text-blue-800 mb-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              className="w-5 h-5"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                d="M12 20v-8m0 0V4m0 8h8m-8 0H4"
              />
            </svg>
            <span>Add </span>

            <div className={" " + (!showLoader ? "hidden" : "")}>
              <LoadingSpinerChase
                width={13}
                height={13}
                color="blue"
              ></LoadingSpinerChase>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

TripTransportCard.propTypes = {};

export default TripTransportCard;
