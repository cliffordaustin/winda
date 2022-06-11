import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";
import Cookies from "js-cookie";

import Card from "../ui/Card";
import styles from "../../styles/Listing.module.css";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";

const TripActivityCard = ({ images, activity, tripId, tripSlug }) => {
  const [newPrice, setNewPrice] = useState(null);

  const currencyToKES = useSelector((state) => state.home.currencyToKES);

  const priceConversionRate = useSelector(
    (state) => state.stay.priceConversionRate
  );

  const [showLoader, setShowLoader] = useState(false);

  const price = () => {
    return activity.price;
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
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_baseURL}/trip/${tripSlug}/`,
        {
          activity_id: activity.id,
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
      });
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
        <h1 className="text-gray-500 truncate">{activity.name}</h1>

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
        </div>

        <div className="text-gray-500 flex gap-1 text-sm truncate flex-wrap">
          {activity.capacity && (
            <div className="flex items-center gap-0.5">
              <svg
                className="w-3 h-3"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="1em"
                height="1em"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 36 36"
              >
                <path
                  fill="currentColor"
                  d="M12 16.14h-.87a8.67 8.67 0 0 0-6.43 2.52l-.24.28v8.28h4.08v-4.7l.55-.62l.25-.29a11 11 0 0 1 4.71-2.86A6.59 6.59 0 0 1 12 16.14Z"
                />
                <path
                  fill="currentColor"
                  d="M31.34 18.63a8.67 8.67 0 0 0-6.43-2.52a10.47 10.47 0 0 0-1.09.06a6.59 6.59 0 0 1-2 2.45a10.91 10.91 0 0 1 5 3l.25.28l.54.62v4.71h3.94v-8.32Z"
                />
                <path
                  fill="currentColor"
                  d="M11.1 14.19h.31a6.45 6.45 0 0 1 3.11-6.29a4.09 4.09 0 1 0-3.42 6.33Z"
                />
                <path
                  fill="currentColor"
                  d="M24.43 13.44a6.54 6.54 0 0 1 0 .69a4.09 4.09 0 0 0 .58.05h.19A4.09 4.09 0 1 0 21.47 8a6.53 6.53 0 0 1 2.96 5.44Z"
                />
                <circle cx="17.87" cy="13.45" r="4.47" fill="currentColor" />
                <path
                  fill="currentColor"
                  d="M18.11 20.3A9.69 9.69 0 0 0 11 23l-.25.28v6.33a1.57 1.57 0 0 0 1.6 1.54h11.49a1.57 1.57 0 0 0 1.6-1.54V23.3l-.24-.3a9.58 9.58 0 0 0-7.09-2.7Z"
                />
                <path fill="none" d="M0 0h36v36H0z" />
              </svg>
              <span>{activity.capacity} Guests</span>
            </div>
          )}
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

TripActivityCard.propTypes = {};

export default TripActivityCard;
