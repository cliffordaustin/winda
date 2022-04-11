import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import Listing from "./Listing";
import Link from "next/link";

function Listings({ getDistance, userLatLng }) {
  const stays = useSelector((state) => state.stay.stays.stay.stays);
  return (
    <div className="w-full flex justify-between flex-wrap gap-4">
      {stays.map((stay, index) => (
        <Listing
          key={index}
          listing={stay}
          getDistance={getDistance}
          userLatLng={userLatLng}
        ></Listing>
      ))}
    </div>
  );
}

export default Listings;
