import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axios from "axios";

import Button from "../ui/Button";
import Carousel from "../ui/Carousel";
import Price from "../Stay/Price";
import { Icon } from "@iconify/react";
import Link from "next/link";

const Card = ({
  listing,
  userProfile,
  trips,
  userTrips,
  setShowAddToTripPopup,
  showAddToTripPopup,
  setSelectedData,
}) => {
  const dispatch = useDispatch();

  const currencyToKES = useSelector((state) => state.home.currencyToKES);

  const priceConversionRate = useSelector(
    (state) => state.stay.priceConversionRate
  );

  const [liked, setLiked] = useState(false);

  const router = useRouter();

  const sortedImages = listing.single_trip_images.sort(
    (x, y) => y.main - x.main
  );

  const images = sortedImages.map((image) => {
    return image.image;
  });

  const [addToTripLoading, setAddToTripLoading] = useState(false);

  const [listingIsInTrip, setListingIsInTrip] = useState(false);

  const itemIsInTrip = async () => {
    let exist = false;
    let tripExists = false;
    const token = Cookies.get("token");

    if (token && trips.trip) {
      tripExists = trips.trip.some((val) => {
        if (val.stay) {
          return val.stay.slug === listing.slug;
        }
      });

      setListingIsInTrip(exist || tripExists);
    }
  };

  useEffect(() => {
    itemIsInTrip();
  }, [trips]);

  const [loading, setLoading] = useState(false);

  const addToTrip = async () => {
    setLoading(true);

    await axios
      .post(
        `${process.env.NEXT_PUBLIC_baseURL}/create-trip/`,
        {
          stay_id: listing.stay ? listing.stay.id : null,
          activity_id: listing.activity ? listing.activity.id : null,
          transport_id: listing.transport ? listing.transport.id : null,
          flight_id: listing.flight ? listing.flight.id : null,
        },
        {
          headers: {
            Authorization: `Token ${Cookies.get("token")}`,
          },
        }
      )
      .then((res) => {
        router.push({
          pathname: `/trip/plan/${res.data.slug}`,
        });
      })
      .catch((err) => {
        console.log(err.response);
        setLoading(false);
      });
  };

  const totalPrice = () => {
    return listing.price_non_resident || listing.price;
  };

  return (
    <div className="border flex relative overflow-hidden stepWebkitSetting flex-col h-[500px] xl:flex-row w-full md:w-[48%] bg-white xl:h-[265px] mb-6 shadow-md rounded-2xl">
      <div className="xl:w-[320px] h-[230px] xl:h-full">
        <Carousel
          images={images}
          imageClass="xl:rounded-bl-2xl xl:rounded-tl-2xl"
        ></Carousel>
      </div>

      <div className="px-3 py-2 xl:w-[200px] flex-grow relative">
        <div className="text-base text-gray-700 font-bold">{listing.name}</div>

        <p className="mt-2 text-sm text-gray-500">
          {listing.description && listing.description.substring(0, 80)}...
        </p>

        <div className="mt-2">
          {listing.stay && (
            <div className="flex items-center mt-2 gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="1em"
                height="1em"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 16 16"
              >
                <g fill="currentColor" fillRule="evenodd">
                  <path d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z" />
                  <path d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207L1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z" />
                </g>
              </svg>
              <span className="text-sm w-full lowercase truncate">
                {listing.stay.name}
              </span>
            </div>
          )}

          {listing.activity && (
            <div className="flex items-center mt-2 gap-1">
              <Icon
                icon="fa6-solid:person-hiking"
                className="w-5 h-5 text-gray-500"
              />
              <span className="text-sm truncate">{listing.activity.name}</span>
            </div>
          )}
          {listing.transport && (
            <div className="flex items-center mt-2 gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="w-5 h-5"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 16 16"
              >
                <path
                  fill="currentColor"
                  d="M6 9a.749.749 0 1 1-1.498 0A.749.749 0 0 1 6 9Zm4.749.749a.749.749 0 1 0 0-1.498a.749.749 0 0 0 0 1.498ZM3.034 6.074L3.044 6H2.5a.5.5 0 0 1 0-1h.673l.162-1.256A2 2 0 0 1 5.32 2h5.36a2 2 0 0 1 1.984 1.747L12.823 5h.677a.5.5 0 0 1 0 1h-.549l.01.072A1.5 1.5 0 0 1 14 7.5v3a1.5 1.5 0 0 1-1.5 1.5h-.003v1.25a.75.75 0 1 1-1.5 0V12H5v1.25a.75.75 0 0 1-1.5 0V12A1.5 1.5 0 0 1 2 10.5v-3a1.5 1.5 0 0 1 1.034-1.426Zm1.293-2.202L4.052 6h7.891l-.272-2.127A1 1 0 0 0 10.68 3H5.32a1 1 0 0 0-.992.872ZM12.5 11a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h9Z"
                />
              </svg>
              <div className="text-sm w-full lowercase truncate">
                {listing.transport.type_of_car}
              </div>
            </div>
          )}

          {listing.flight && (
            <div className="flex items-center mt-2 gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-500"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M3.414 13.778L2 15.192l4.949 2.121l2.122 4.95l1.414-1.414l-.707-3.536L13.091 14l3.61 7.704l1.339-1.339l-1.19-10.123l2.828-2.829a2 2 0 1 0-2.828-2.828l-2.903 2.903L3.824 6.297L2.559 7.563l7.644 3.67l-3.253 3.253l-3.536-.708z"
                />
              </svg>
              <div className="text-sm w-full lowercase truncate">
                from {listing.flight.starting_point} to{" "}
                {listing.flight.destination}
              </div>
            </div>
          )}
        </div>

        <div className="mt-1 mb-10 xl:mb-0">
          <div className="text-sm text-gray-700 flex gap-0.5 items-center">
            <div className="text-xl mr-0.5 font-bold">
              <Price stayPrice={totalPrice()}></Price>
            </div>
            <div className="mt-0.5 mb-1.5 font-bold">.</div>
            <div className="mt-0.5">/per non-resident/trip</div>
          </div>
        </div>

        <div className="flex mt-0.5 justify-between absolute bottom-2 w-full right-0 px-2">
          <Link href={`/trip/${listing.slug}`}>
            <a className="w-full">
              <Button className="w-full !px-0 !bg-transparent font-bold !bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !text-white">
                view trip
              </Button>
            </a>
          </Link>
        </div>
      </div>

      <div className="absolute top-1.5 left-1.5 w-fit px-2 rounded-md font-bold text-sm py-[2px] bg-yellow-400">
        {listing.total_number_of_days}{" "}
        {listing.total_number_of_days > 1 ? "days" : "day"}
      </div>
    </div>
  );
};

Card.propTypes = {};

export default Card;
