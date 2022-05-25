import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import { setActiveStay } from "../../redux/actions/stay";
import { randomNumber } from "../../lib/random";
import Card from "../ui/Card";
import SecondCard from "../ui/SecondCard";
import styles from "../../styles/Listing.module.css";
import Rating from "../ui/Rating";
import Badge from "../ui/Badge";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";

function Listing({ listing, userProfile }) {
  const currencyToDollar = useSelector((state) => state.home.currencyToDollar);

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

  const [liked, setLiked] = useState(false);

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
  return (
    <div
      onClick={() => {
        router.push({
          pathname: `transport/${listing.slug}`,
        });
      }}
      className="smMax:!w-full mdMax:!w-[48%] md:!w-[47%] lg:!w-[31%] xl:!w-[25%] !relative select-none"
    >
      <Card
        imagePaths={images}
        carouselClassName="h-44"
        subCarouselClassName="hidden"
        className={styles.card}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: listing.vehicle_color }}
          ></div>
          <div className="text-gray-500 flex gap-[3px] lowercase">
            <h1>{listing.vehicle_make}</h1>
            <span className="-mt-[5px] font-bold text-lg text-black">.</span>
            <h1>{listing.type_of_car}</h1>
          </div>
        </div>
        <div className="flex gap-1">
          {currencyToDollar && (
            <h1 className="font-bold text-xl font-OpenSans">
              {price() ? "$" + Math.ceil(newPrice).toLocaleString() : "No data"}
            </h1>
          )}
          {!currencyToDollar && (
            <h1 className="font-bold text-xl font-OpenSans">
              {price()
                ? "KES" + Math.ceil(price()).toLocaleString()
                : "No data"}
            </h1>
          )}
          <div className="text-xs mt-2">/10km</div>
        </div>

        <div className="absolute bg-white rounded-3xl mt-2 pr-2 mr-2 flex z-10 items-center justify-center gap-0.5 top-0 right-0">
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

        <div className="flex items-center gap-1 mt-2">
          <div className={!isSafari ? "-mb-0.5" : "-mb-1"}>
            <Badge className={"bg-blue-500"}>{randomRatingNum}</Badge>
          </div>
          <Rating
            rating={Number(randomRatingNum)}
            fontSize={!isSafari ? 25 : 16}
          ></Rating>
          <div className="font-medium text-sm">
            ({randomNumber(20, 100).toFixed(0)})
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Listing;
