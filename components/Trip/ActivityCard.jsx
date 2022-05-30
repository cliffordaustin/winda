import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axios from "axios";

import LoadingSpinerChase from "../ui/LoadingSpinerChase";
import styles from "../../styles/Listing.module.css";
import ItemCard from "../ui/SecondCard";
import Button from "../ui/Button";

const ActivityCard = ({ listing, userProfile, trips }) => {
  const dispatch = useDispatch();

  const currencyToDollar = useSelector((state) => state.home.currencyToDollar);

  const priceConversionRate = useSelector(
    (state) => state.stay.priceConversionRate
  );

  const [liked, setLiked] = useState(false);

  const router = useRouter();

  const sortedImages = listing.activity_images.sort((x, y) => y.main - x.main);

  const images = sortedImages.map((image) => {
    return image.image;
  });

  const [newPrice, setNewPrice] = useState(null);

  const price = () => {
    return listing.price;
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
  }, [price(), currencyToDollar, priceConversionRate]);

  const [addToTripLoading, setAddToTripLoading] = useState(false);

  const [listingIsInTrip, setListingIsInTrip] = useState(false);

  const addToTrip = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    setAddToTripLoading(true);

    if (Cookies.get("token") && !listingIsInTrip) {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/create-trip/`,
          {
            stay_id: null,
            activity_id: listing.id,
            transport_id: null,
          },
          {
            headers: {
              Authorization: `Token ${Cookies.get("token")}`,
            },
          }
        )
        .then((res) => {
          router.reload();
        })
        .catch((err) => {
          console.log(err.response);
          setAddToTripLoading(false);
        });
    } else if (Cookies.get("token") && listingIsInTrip) {
      router.push("/trip/plan");
    } else {
      router.push({
        pathname: "/login",
        query: {
          redirect: router.asPath,
        },
      });
    }
  };

  const itemIsInTrip = async () => {
    let exist = false;
    let tripExists = false;
    const token = Cookies.get("token");

    if (token && trips.trip) {
      tripExists = trips.trip.some((val) => {
        if (val.activity) {
          return val.activity.slug === listing.slug;
        }
      });

      setListingIsInTrip(exist || tripExists);
    }
  };

  useEffect(() => {
    itemIsInTrip();
  }, [trips]);
  return (
    <div className="w-full lg:w-[48%] mb-6">
      <ItemCard
        imagePaths={images}
        carouselClassName="!w-[50%]"
        subCarouselClassName="hidden"
        className={styles.card}
      >
        <div className="relative w-full">
          <div className="flex flex-col gap-1">
            <h1 className="text-gray-500 truncate">{listing.name}</h1>

            {currencyToDollar && (
              <h1 className="font-bold text-xl font-OpenSans">
                {price()
                  ? "$" + Math.ceil(newPrice).toLocaleString()
                  : "No data"}
              </h1>
            )}
            {!currencyToDollar && (
              <h1 className="font-bold text-xl font-OpenSans">
                {price()
                  ? "KES" + Math.ceil(price()).toLocaleString()
                  : "No data"}
              </h1>
            )}
          </div>
          <div className="text-gray-500 flex gap-1 text-sm truncate mt-1">
            {listing.guest && <span>{listing.guest}</span>}
          </div>
          <div className="text-gray-500 flex gap-1 text-sm truncate mt-1 flex-wrap">
            {listing.capacity && (
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
                <span>{listing.capacity} Guests</span>
              </div>
            )}
          </div>
          <div className="font-bold text-sm truncate mt-1">
            {listing.location}
          </div>

          <Button
            onClick={(e) => {
              addToTrip(e);
            }}
            className="!bg-blue-600 flex gap-2 md:!py-2 lg:!py-1 md:!px-2 lg:!px-1 md:mt-2"
          >
            {!listingIsInTrip && <span className="font-bold">Add to trip</span>}
            {listingIsInTrip && <span className="font-bold">View in trip</span>}
            <div className={" " + (!addToTripLoading ? "hidden" : "")}>
              <LoadingSpinerChase
                width={14}
                height={14}
                color="white"
              ></LoadingSpinerChase>
            </div>
          </Button>

          <div className="absolute flex z-10 bg-white items-center justify-center gap-0.5 top-0 right-0">
            {liked && (
              <svg
                width="28px"
                height="28px"
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 py-1 rounded-3xl hover:bg-gray-200 cursor-pointer"
                viewBox="0 0 20 20"
                fill="#e63946"
                onClick={(e) => {
                  e.stopPropagation();
                  setLiked(false);
                }}
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {!liked && (
              <svg
                width="28px"
                height="28px"
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 py-1 rounded-3xl hover:bg-gray-200 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={(e) => {
                  e.stopPropagation();
                  setLiked(true);
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
          </div>
        </div>
      </ItemCard>
    </div>
  );
};

ActivityCard.propTypes = {};

export default ActivityCard;
