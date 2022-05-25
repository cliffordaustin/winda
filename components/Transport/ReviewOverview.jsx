import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Rating from "../ui/Rating";
import axios from "axios";

const ReviewOverview = ({
  reviews,
  filterReview,
  transport,
  setFilterRateVal,
}) => {
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
    return transport.count_total_review_rates / transport.total_num_of_reviews;
  };

  const rates = [5, 4, 3, 2, 1];

  const starPercentage = (star) => {
    if (star === 1) {
      return Math.floor(
        100 -
          ((transport.total_num_of_reviews - transport.num_of_one_stars) /
            transport.total_num_of_reviews) *
            100
      );
    } else if (star === 2) {
      return Math.floor(
        100 -
          ((transport.total_num_of_reviews - transport.num_of_two_stars) /
            transport.total_num_of_reviews) *
            100
      );
    } else if (star === 3) {
      return Math.floor(
        100 -
          ((transport.total_num_of_reviews - transport.num_of_three_stars) /
            transport.total_num_of_reviews) *
            100
      );
    } else if (star === 4) {
      return Math.floor(
        100 -
          ((transport.total_num_of_reviews - transport.num_of_four_stars) /
            transport.total_num_of_reviews) *
            100
      );
    }
    if (star === 5) {
      return Math.floor(
        100 -
          ((transport.total_num_of_reviews - transport.num_of_five_stars) /
            transport.total_num_of_reviews) *
            100
      );
    }
  };

  return (
    <div className={"px-4 bg-gray-100 py-3 rounded-xl flex gap-4 w-full"}>
      <div className={"flex flex-col gap-2 w-full px-4"}>
        <div className={""}>
          <div className="flex">
            <h1 className="font-bold text-3xl">{averageRating().toFixed(1)}</h1>
            <p className="text-base self-end">/5</p>
          </div>
          <div className="text-gray-500 mt-1 text-sm md:text-base sm:whitespace-nowrap">
            Based on {transport.total_num_of_reviews} reviews
          </div>
          <div className="mt-1 hidden md:block">
            <Rating
              fontSize={!isSafari ? 45 : 35}
              rating={averageRating()}
            ></Rating>
          </div>
          <div className="mt-1 md:hidden">
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
                setFilterRateVal(rate);
              }}
              key={index}
              className={"flex items-center gap-2 w-full cursor-pointer"}
            >
              <div className="whitespace-nowrap">{rate} stars</div>
              <div className="bg-gray-300 rounded-3xl overflow-hidden py-2 w-full relative">
                <div
                  className={
                    "bg-[#303960] absolute rounded-tr-3xl rounded-br-3xl top-0 py-2 left-0"
                  }
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
