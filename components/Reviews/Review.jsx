import React from "react";
import PropTypes from "prop-types";
import Rating from "../ui/Rating";

function Review({ userName, review, subText, rate }) {
  return (
    <div className="px-4 py-2 border rounded-md max-w-xl">
      <div className="flex items-center gap-2">
        <h1 className="font-black">{userName}</h1>
        {rate && (
          <div className="mb-1 flex items-center">
            <div className="font-black mb-1 mr-1"> . </div>
            <Rating
              rating={rate}
              fontSize={16}
              className="!bg-yellow-500"
            ></Rating>
          </div>
        )}
      </div>
      <h1 className="mt-0.5 text-sm font-bold">{subText}</h1>

      <div className="mt-3 text-sm">{review}</div>
    </div>
  );
}

Review.propTypes = {};

export default Review;
