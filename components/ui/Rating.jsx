import React from "react";
import PropTypes from "prop-types";

function Rating({ rating, fontSize = 10, className = "bg-slate-800" }) {
  return (
    <div>
      <div
        className={"stars !bg-clip-text " + className}
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
