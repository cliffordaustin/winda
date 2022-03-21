import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import Card from "../ui/Card";
import SecondCard from "../ui/SecondCard";
import styles from "../../styles/Listing.module.css";
import Rating from "../ui/Rating";
import Badge from "../ui/Badge";

function Listing({ listing }) {
  const [isSafari, setIsSafari] = useState(false);

  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (process.browser) {
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      setIsSafari(isSafari);
    }
  }, []);
  return (
    <div className="w-full xsMax:!w-full mdMax:!w-47p lgMax:!w-[31.5%] xl:!w-47p !relative select-none">
      <div className="lgMax:block lg:hidden xl:block relative">
        <Card
          imagePaths={listing.imagePaths}
          carouselClassName="h-44"
          subCarouselClassName="hidden"
          className={styles.card}
        >
          <div className="flex items-end">
            <h1 className="font-bold text-xl font-OpenSans">
              KES{listing.price.toLocaleString()}
            </h1>
            <p className="mb-0.5 inline-block">/night</p>
          </div>
          <div className="font-bold text-sm truncate mt-1">
            {listing.address}
          </div>
          <div className="flex items-center gap-1 mt-2">
            <div className={!isSafari ? "-mb-0.5" : "-mb-1"}>
              <Badge
                className={
                  listing.rating >= 4.5
                    ? "!bg-green-700"
                    : listing.rating >= 4
                    ? "!bg-green-600"
                    : listing.rating >= 3.5
                    ? "!bg-green-500"
                    : listing.rating >= 3
                    ? "!bg-yellow-500"
                    : "!bg-red-500"
                }
              >
                {listing.rating}
              </Badge>
            </div>
            <Rating
              rating={listing.rating}
              fontSize={!isSafari ? 25 : 16}
            ></Rating>
            <div className="font-medium text-sm">({listing.numRating})</div>
          </div>
        </Card>
        <div className="absolute top-2 right-2 z-10">
          {liked && (
            <svg
              width="28px"
              height="28px"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="#e63946"
              className="cursor-pointer"
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
              className="text-white cursor-pointer"
              fill="#000"
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
      <div className="lgMax:hidden lg:block xl:hidden">
        <SecondCard
          imagePaths={listing.imagePaths}
          carouselClassName="h-44 !w-[45%]"
          subCarouselClassName="hidden"
          className={styles.card}
        >
          <div className="relative w-full">
            <div className="flex items-end">
              <h1 className="font-bold text-xl font-OpenSans">
                KES{listing.price.toLocaleString()}
              </h1>
              <p className="mb-0.5 inline-block">/night</p>
            </div>
            <div className="font-bold text-sm truncate mt-1">
              {listing.address}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <div className={!isSafari ? "-mb-0.5" : "-mb-1"}>
                <Badge
                  className={
                    listing.rating >= 4.5
                      ? "!bg-green-700"
                      : listing.rating >= 4
                      ? "!bg-green-600"
                      : listing.rating >= 3.5
                      ? "!bg-green-500"
                      : listing.rating >= 3
                      ? "!bg-yellow-500"
                      : "!bg-red-500"
                  }
                >
                  {listing.rating}
                </Badge>
              </div>
              <Rating
                rating={listing.rating}
                fontSize={!isSafari ? 25 : 16}
              ></Rating>
              <div className="font-medium text-sm">({listing.numRating})</div>
            </div>

            <div className="absolute flex items-center gap-3 top-0 right-0 z-10">
              {liked && (
                <svg
                  width="28px"
                  height="28px"
                  xmlns="http://www.w3.org/2000/svg"
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
                  className="text-black"
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
        </SecondCard>
      </div>
    </div>
  );
}

export default Listing;
