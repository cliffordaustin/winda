import React from "react";
import PropTypes from "prop-types";

function Review({ userName, review, bookingType }) {
  return (
    <div className="px-4 py-2 border rounded-md max-w-xl">
      <h1 className="font-black">{userName}</h1>
      <h1 className="mt-0.5 text-sm font-bold">{bookingType}</h1>

      <div className="mt-3 text-sm">{review}</div>
    </div>
  );
}

Review.propTypes = {};

export default Review;
