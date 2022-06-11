import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";
import Cookies from "js-cookie";

import Card from "../ui/Card";
import styles from "../../styles/Listing.module.css";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";

const TripStayCard = ({ images, stay, tripId, tripSlug }) => {
  const [newPrice, setNewPrice] = useState(null);

  const currencyToKES = useSelector((state) => state.home.currencyToKES);

  const priceConversionRate = useSelector(
    (state) => state.stay.priceConversionRate
  );

  const [showLoader, setShowLoader] = useState(false);

  const price = () => {
    return stay.price;
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
          stay_id: stay.id,
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
        <h1 className="text-gray-500 truncate">{stay.name}</h1>

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
          {stay.rooms && (
            <div className="flex items-center gap-0.5">
              <svg
                className="w-3 h-3"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="1em"
                height="1em"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M5 5v14a1 1 0 0 0 1 1h3v-2H7V6h2V4H6a1 1 0 0 0-1 1zm14.242-.97l-8-2A1 1 0 0 0 10 3v18a.998.998 0 0 0 1.242.97l8-2A1 1 0 0 0 20 19V5a1 1 0 0 0-.758-.97zM15 12.188a1.001 1.001 0 0 1-2 0v-.377a1 1 0 1 1 2 .001v.376z"
                />
              </svg>

              <span>{stay.rooms} rm</span>
            </div>
          )}

          {stay.beds && (
            <div className="flex items-center gap-0.5">
              <svg
                className="w-3 h-3"
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 0 24 24"
                width="24"
              >
                <path d="M20 9.556V3h-2v2H6V3H4v6.557C2.81 10.25 2 11.526 2 13v4a1 1 0 0 0 1 1h1v4h2v-4h12v4h2v-4h1a1 1 0 0 0 1-1v-4c0-1.474-.811-2.75-2-3.444zM11 9H6V7h5v2zm7 0h-5V7h5v2z" />
              </svg>
              <span>{stay.beds} bd</span>
            </div>
          )}

          {stay.bathrooms && (
            <div className="flex items-center gap-0.5">
              <svg
                className="w-3 h-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M32 384c0 28.32 12.49 53.52 32 71.09V496C64 504.8 71.16 512 80 512h32C120.8 512 128 504.8 128 496v-15.1h256V496c0 8.836 7.164 16 16 16h32c8.836 0 16-7.164 16-16v-40.9c19.51-17.57 32-42.77 32-71.09V352H32V384zM496 256H96V77.25C95.97 66.45 111 60.23 118.6 67.88L132.4 81.66C123.6 108.6 129.4 134.5 144.2 153.2C137.9 159.5 137.8 169.8 144 176l11.31 11.31c6.248 6.248 16.38 6.248 22.63 0l105.4-105.4c6.248-6.248 6.248-16.38 0-22.63l-11.31-11.31c-6.248-6.248-16.38-6.248-22.63 0C230.7 33.26 204.7 27.55 177.7 36.41L163.9 22.64C149.5 8.25 129.6 0 109.3 0C66.66 0 32 34.66 32 77.25v178.8L16 256C7.164 256 0 263.2 0 272v32C0 312.8 7.164 320 16 320h480c8.836 0 16-7.164 16-16v-32C512 263.2 504.8 256 496 256z" />
              </svg>{" "}
              <span>{stay.bathrooms} ba</span>
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

TripStayCard.propTypes = {};

export default TripStayCard;
