import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import Listing from "./Listing";

function Listings() {
  const stays = useSelector((state) => state.stay.stays);
  return (
    <div className="w-full flex justify-between flex-wrap gap-4">
      {stays.map((stay, index) => (
        <Listing key={index} listing={stay}></Listing>
      ))}
    </div>
  );
}

export default Listings;
