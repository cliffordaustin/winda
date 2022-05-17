import React from "react";
import PropTypes from "prop-types";

const StayType = ({ stay }) => {
  return (
    <div>
      {stay.type_of_stay === "LODGE" && (
        <div className="px-1 rounded-md bg-blue-600 text-white">Lodge</div>
      )}
      {stay.type_of_stay === "HOUSE" && (
        <div className="px-1 rounded-md bg-blue-600 text-white">House</div>
      )}
      {stay.type_of_stay === "UNIQUE SPACE" && (
        <div className="px-1 rounded-md bg-blue-600 text-white">
          Unique space
        </div>
      )}
      {stay.type_of_stay === "CAMPSITE" && (
        <div className="px-1 rounded-md bg-blue-600 text-white">Campsite</div>
      )}
      {stay.type_of_stay === "BOUTIQUE HOTEL" && (
        <div className="px-1 rounded-md bg-blue-600 text-white">
          Boutique hotel
        </div>
      )}
    </div>
  );
};

StayType.propTypes = {};

export default StayType;
