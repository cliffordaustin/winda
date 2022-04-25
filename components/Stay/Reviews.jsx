import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Review from "./Review";
import axios from "axios";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";

const Reviews = ({
  reviews,
  spinner,
  filteredReviews,
  setShowAllReviews,
  count,
  reviewLoading,
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

  return (
    <>
      {!spinner && (
        <div className="flex flex-col gap-4">
          {!filteredReviews &&
            reviews.map((review) => (
              <Review
                isSafari={isSafari}
                key={review.id}
                review={review}
              ></Review>
            ))}
          {filteredReviews &&
            filteredReviews.map((review) => (
              <Review
                isSafari={isSafari}
                key={review.id}
                review={review}
              ></Review>
            ))}
        </div>
      )}
      {filteredReviews && filteredReviews.length === 0 && (
        <div className="text-center text-gray-500">
          <p className="text-base">No reviews found for this filter</p>
        </div>
      )}
      {spinner && (
        <div className="flex justify-center items-center">
          <LoadingSpinerChase
            width={35}
            height={35}
            color="#000"
          ></LoadingSpinerChase>
        </div>
      )}
      {!filteredReviews && !spinner && count > reviews.length && (
        <div
          onClick={() => {
            setShowAllReviews(true);
          }}
          className="border border-gray-300 rounded-xl mt-4 py-3 cursor-pointer text-center font-bold"
        >
          Show all reviews
        </div>
      )}

      {filteredReviews && !spinner && count > filteredReviews.length && (
        <div
          onClick={() => {
            setShowAllReviews(true);
          }}
          className="border border-gray-300 rounded-xl mt-4 py-3 cursor-pointer text-center font-bold"
        >
          Show all reviews
        </div>
      )}
    </>
  );
};

Reviews.propTypes = {};

export default Reviews;
