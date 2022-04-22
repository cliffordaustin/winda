import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Rating from "../ui/Rating";
import axios from "axios";

const ReviewOverview = ({ reviews, filterReview }) => {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    if (process.browser) {
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      setIsSafari(isSafari);
    }
  }, []);

  const averageRating = () => {
    let totalRating = 0;
    reviews.forEach((review) => {
      totalRating += review.rate;
    });
    return totalRating / reviews.length;
  };

  const rates = [5, 4, 3, 2, 1];

  const starPercentage = (star) => {
    let numberOfReviewers = 0;
    reviews.forEach((review) => {
      if (Math.floor(review.rate) === star) {
        numberOfReviewers++;
      }
    });
    return Math.floor(
      100 - ((reviews.length - numberOfReviewers) / reviews.length) * 100
    );
  };

  return (
    <div className={"px-4 bg-gray-100 py-3 rounded-3xl flex gap-4 w-full"}>
      <div className={"flex sm:flex-row flex-col gap-4 w-full md:px-8"}>
        <div className={""}>
          <div className="flex">
            <h1 className="font-bold text-3xl">{averageRating().toFixed(1)}</h1>
            <p className="text-base self-end">/5</p>
          </div>
          <div className="text-gray-500 mt-1 text-sm md:text-base sm:whitespace-nowrap">
            Based on {reviews.length} reviews
          </div>
          <div className="mt-1 sm:mt-3 hidden md:block">
            <Rating
              fontSize={!isSafari ? 45 : 35}
              rating={averageRating()}
            ></Rating>
          </div>
          <div className="mt-1 sm:mt-3 md:hidden">
            <Rating
              fontSize={!isSafari ? 30 : 22}
              rating={averageRating()}
            ></Rating>
          </div>
        </div>
        <div className="w-full flex flex-col gap-3">
          {rates.map((rate, index) => (
            <div
              onClick={() => {
                filterReview(rate);
              }}
              key={index}
              className={"flex items-center gap-2 w-full cursor-pointer"}
            >
              <div className="whitespace-nowrap">{rate} stars</div>
              <div className="bg-gray-300 rounded-3xl overflow-hidden py-2 w-full relative">
                <div
                  className={"bg-orange-400 absolute top-0 py-2 left-0"}
                  style={{ width: `${starPercentage(rate)}%` }}
                ></div>
              </div>
              <div>{starPercentage(rate)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

ReviewOverview.propTypes = {};

export default ReviewOverview;
