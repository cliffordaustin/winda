import React from "react";
import PropTypes from "prop-types";

function Rating({ rating, fontSize = 10 }) {
  return (
    <div>
      <div
        className="stars"
        style={{ "--rating": rating, "--font-size": fontSize + "px" }}
      ></div>
    </div>
  );
}

Rating.propTypes = {
  rating: PropTypes.number.isRequired,
  fontSize: PropTypes.number,
};

export default Rating;
