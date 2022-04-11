import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import Listing from "./Listing";
import ClientOnly from "../ClientOnly";

function Listings({ getDistance, userLatLng }) {
  const stays = useSelector((state) => state.stay.stays);
  return (
    <ClientOnly>
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
    </ClientOnly>
  );
}

export default Listings;
