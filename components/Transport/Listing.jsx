import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { Icon } from "@iconify/react";

import { setActiveStay } from "../../redux/actions/stay";
import { randomNumber } from "../../lib/random";
import Card from "../ui/Card";
import SecondCard from "../ui/SecondCard";
import styles from "../../styles/Listing.module.css";
import Rating from "../ui/Rating";
import Badge from "../ui/Badge";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";
import Button from "../ui/Button";
import Carousel from "../ui/Carousel";

function Listing({ listing, userProfile, slugIsCorrect, setCurrentListing }) {
  const currencyToKES = useSelector((state) => state.home.currencyToKES);

  const router = useRouter();

  const [isSafari, setIsSafari] = useState(false);

  const randomRatingNum = randomNumber(3, 5).toFixed(1);

  useEffect(() => {
    if (process.browser) {
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      setIsSafari(isSafari);
    }
  }, []);

  const priceConversionRate = useSelector(
    (state) => state.stay.priceConversionRate
  );
  const sortedImages = listing.transportation_images.sort(
    (x, y) => y.main - x.main
  );

  const images = sortedImages.map((image) => {
    return image.image;
  });

  const [newPrice, setNewPrice] = useState(null);

  const [liked, setLiked] = useState(listing.has_user_saved);

  const price = () => {
    return listing.price_per_day;
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

  const [addToTripLoading, setAddToTripLoading] = useState(false);

  const addToTrip = async () => {
    const token = Cookies.get("token");

    setAddToTripLoading(true);

    if (token) {
      await axios
        .put(
          `${process.env.NEXT_PUBLIC_baseURL}/trip/${router.query.trip}/`,
          {
            transport_id: listing.id,
          },
          {
            headers: {
              Authorization: "Token " + token,
            },
          }
        )
        .then(() => {
          router.push({
            pathname: `/trip/plan/${router.query.group_trip}`,
          });
        })
        .catch((err) => {
          setAddToTripLoading(false);
        });
    }
  };

  useEffect(() => {
    priceConversion(price());
  }, [price(), currencyToKES, priceConversionRate]);

  const changeLikeState = () => {
    if (Cookies.get("token")) {
      setLiked(false);
      axios
        .delete(
          `${process.env.NEXT_PUBLIC_baseURL}/transport/${listing.id}/delete/`,
          {
            headers: {
              Authorization: `Token ${Cookies.get("token")}`,
            },
          }
        )
        .then(() => {})
        .catch((err) => console.log(err.response));
    } else {
      router.push({
        pathname: "/login",
        query: { redirect: `${router.asPath}` },
      });
    }
  };

  const changeUnLikeState = () => {
    if (Cookies.get("token")) {
      setLiked(true);
      axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/transport/${listing.slug}/save/`,
          "",
          {
            headers: {
              Authorization: "Token " + Cookies.get("token"),
            },
          }
        )
        .then(() => {})
        .catch((err) => console.log(err.response));
    } else {
      router.push({
        pathname: "/login",
        query: { redirect: `${router.asPath}` },
      });
    }
  };

  return (
    <div
      onClick={() => {
        // if (router.query.trip) {
        //   router.push({
        //     pathname: `transport/${listing.slug}`,
        //     query: {
        //       trip: router.query.trip,
        //       group_trip: router.query.group_trip,
        //     },
        //   });
        // } else {
        //   router.push(`transport/${listing.slug}`);
        // }
      }}
      className="smMax:!w-full mdMax:!w-[48%] md:!w-[47%] lg:!w-[48%] xl:!w-[31%] !relative select-none"
    >
      <div
        className={styles.card + " w-full rounded-md overflow-hidden bg-white"}
      >
        <div className="h-[200px] relative">
          <div className="px-2 py-0.5 rounded-full text-sm z-10 bg-blue-300 absolute left-3 bottom-3">
            or similar
          </div>
          <Carousel
            images={images}
            imageClass="rounded-tl-md rounded-tr-2xl"
          ></Carousel>
        </div>
        <div className="px-2 mt-2 mb-2">
          <div className="flex items-center justify-between gap-2">
            <div className="text-lg font-semibold w-full text-gray-700 truncate">
              {listing.vehicle_make}
            </div>

            <div className="flex">
              {!currencyToKES && (
                <h1 className={"font-bold text-lg font-OpenSans "}>
                  {price()
                    ? "$" + Math.ceil(price()).toLocaleString()
                    : "No data"}
                </h1>
              )}
              {currencyToKES && (
                <h1 className={"font-bold text-lg font-OpenSans "}>
                  {price()
                    ? "KES" + Math.ceil(newPrice).toLocaleString()
                    : "No data"}
                </h1>
              )}
              <div className="text-xs mt-2">/day</div>
            </div>
          </div>
          <div className="text-sm ml-1 capitalize font-bold">
            {listing.type_of_car.toLowerCase()}
          </div>

          <div className="py-2 border-t border-b border-gray-400 px-2 my-2 text-sm text-gray-600 flex justify-between items-center">
            <div className="flex items-center gap-0.5">
              <Icon className="w-4 h-4" icon="carbon:user-filled" />
              <p>{listing.capacity}</p>
            </div>
            <div className="flex items-center gap-0.5">
              <Icon className="w-4 h-4" icon="bi:bag-fill" />
              <p>{listing.bags}</p>
            </div>
            <div className="flex items-center gap-0.5">
              <Icon className="w-4 h-4" icon="icon-park-solid:manual-gear" />
              <p className="capitalize">{listing.transmission.toLowerCase()}</p>
            </div>
            <div className="flex items-center gap-0.5">
              <Icon className="w-4 h-4" icon="ic:baseline-severe-cold" />
              <p className="capitalize">
                {listing.has_air_condition ? "AC" : "No AC"}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button className="flex w-full items-center gap-1 !px-0 !py-1.5 font-bold !bg-blue-500 !text-white">
              <span>Add to basket</span>
            </Button>

            <Button
              onClick={() => {
                setCurrentListing(listing);
              }}
              className="flex w-full items-center gap-1 !px-0 !py-1.5 font-bold !bg-transparent border-2 border-blue-500 !text-black"
            >
              <span>View</span>
            </Button>
          </div>

          <div className="absolute bg-white rounded-3xl mt-2 mr-2 flex z-10 items-center justify-center gap-0.5 top-0 right-0">
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
                  changeLikeState();
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
                  changeUnLikeState();
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

          {/* {listing.total_num_of_reviews > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <div className={!isSafari ? "-mb-0.5" : "-mb-1"}>
              <Badge className={"bg-blue-500"}>
                {Number(
                  (
                    listing.count_total_review_rates /
                    listing.total_num_of_reviews
                  ).toFixed(2)
                )}
              </Badge>
            </div>
            <Rating
              rating={Number(
                (
                  listing.count_total_review_rates /
                  listing.total_num_of_reviews
                ).toFixed(2)
              )}
              fontSize={!isSafari ? 25 : 16}
            ></Rating>
            <div className="font-medium text-sm">
              ({listing.total_num_of_reviews})
            </div>
          </div>
        )} */}

          {slugIsCorrect && (
            <div className="mt-2">
              <Button
                onClick={() => {
                  addToTrip();
                }}
                className="!bg-blue-500 !absolute top-0 left-0 !rounded-none !rounded-tl-md !py-1 flex gap-2 !px-1.5"
              >
                <span className="text-white text-sm">Add to trip</span>

                {addToTripLoading && (
                  <div>
                    <LoadingSpinerChase
                      width={14}
                      height={14}
                    ></LoadingSpinerChase>
                  </div>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Listing;
