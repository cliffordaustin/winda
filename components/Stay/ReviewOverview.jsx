import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Rating from "../ui/Rating";
import axios from "axios";
import ReverseStarRating from "../ui/ReverseStarRating";

const ReviewOverview = ({ reviews, filterReview, stay, setFilterRateVal }) => {
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
    return stay.count_total_review_rates / stay.total_num_of_reviews;
  };

  const rates = [5, 4, 3, 2, 1];

  const starPercentage = (star) => {
    if (star === 1) {
      return Math.floor(
        100 -
          ((stay.total_num_of_reviews - stay.num_of_one_stars) /
            stay.total_num_of_reviews) *
            100
      );
    } else if (star === 2) {
      return Math.floor(
        100 -
          ((stay.total_num_of_reviews - stay.num_of_two_stars) /
            stay.total_num_of_reviews) *
            100
      );
    } else if (star === 3) {
      return Math.floor(
        100 -
          ((stay.total_num_of_reviews - stay.num_of_three_stars) /
            stay.total_num_of_reviews) *
            100
      );
    } else if (star === 4) {
      return Math.floor(
        100 -
          ((stay.total_num_of_reviews - stay.num_of_four_stars) /
            stay.total_num_of_reviews) *
            100
      );
    }
    if (star === 5) {
      return Math.floor(
        100 -
          ((stay.total_num_of_reviews - stay.num_of_five_stars) /
            stay.total_num_of_reviews) *
            100
      );
    }
  };

  return (
    <div className={"py-3 flex gap-4 w-full"}>
      <div className={"flex gap-4 w-full "}>
        <div className={""}>
          <div className="flex flex-col items-center">
            <h1 className="font-bold text-gray-700 text-4xl font-lobster sm:text-5xl">
              {averageRating().toFixed(1)}
            </h1>
            <div className="text-gray-500 mt-1 text-sm font-lobster whitespace-nowrap">
              Out of 5
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-3">
          <div className={"flex items-center gap-2 w-full"}>
            <div className="whitespace-nowrap">
              <ReverseStarRating
                value={5}
                className="w-4 h-4 md:w-5 md:h-5"
              ></ReverseStarRating>
            </div>
            <div className="bg-gray-300 rounded-3xl overflow-hidden py-1 w-full relative">
              <div
                className={"bg-[#303960] absolute top-0 py-2 left-0"}
                style={{ width: `${starPercentage(5)}%` }}
              ></div>
            </div>
          </div>

          <div className={"flex items-center gap-2 w-full"}>
            <div className="whitespace-nowrap">
              <ReverseStarRating
                value={4}
                className="w-4 h-4 md:w-5 md:h-5"
              ></ReverseStarRating>
            </div>
            <div className="bg-gray-300 rounded-3xl overflow-hidden py-1 w-full relative">
              <div
                className={"bg-[#303960] absolute top-0 py-2 left-0"}
                style={{ width: `${starPercentage(4)}%` }}
              ></div>
            </div>
          </div>

          <div className={"flex items-center gap-2 w-full"}>
            <div className="whitespace-nowrap">
              <ReverseStarRating
                value={3}
                className="w-4 h-4 md:w-5 md:h-5"
              ></ReverseStarRating>
            </div>
            <div className="bg-gray-300 rounded-3xl overflow-hidden py-1 w-full relative">
              <div
                className={"bg-[#303960] absolute top-0 py-2 left-0"}
                style={{ width: `${starPercentage(3)}%` }}
              ></div>
            </div>
          </div>

          <div className={"flex items-center gap-2 w-full"}>
            <div className="whitespace-nowrap">
              <ReverseStarRating
                value={2}
                className="w-4 h-4 md:w-5 md:h-5"
              ></ReverseStarRating>
            </div>
            <div className="bg-gray-300 rounded-3xl overflow-hidden py-1 w-full relative">
              <div
                className={"bg-[#303960] absolute top-0 py-2 left-0"}
                style={{ width: `${starPercentage(2)}%` }}
              ></div>
            </div>
          </div>

          <div className={"flex items-center gap-2 w-full"}>
            <div className="whitespace-nowrap">
              <ReverseStarRating
                value={1}
                className="w-4 h-4 md:w-5 md:h-5"
              ></ReverseStarRating>
            </div>
            <div className="bg-gray-300 rounded-3xl overflow-hidden py-1 w-full relative">
              <div
                className={"bg-[#303960] absolute top-0 py-2 left-0"}
                style={{ width: `${starPercentage(1)}%` }}
              ></div>
            </div>
          </div>

          <div className="text-gray-700 font-lobster font-bold self-end text-sm">
            {stay.total_num_of_reviews} Ratings
          </div>
        </div>
      </div>
    </div>
  );
};

ReviewOverview.propTypes = {};

export default ReviewOverview;
