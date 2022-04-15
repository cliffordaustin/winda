import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
// import { setFilteredStays } from "../../redux/actions/stay";

import Listing from "./Listing";
import ClientOnly from "../ClientOnly";

function Listings({ getDistance, userLatLng }) {
  const stays = useSelector((state) => state.stay.stays);
  // const filteredStays = useSelector((state) => state.stay.filteredStays);

  return (
    <ClientOnly>
      <div className="w-full flex flex-wrap gap-4">
        {stays.map((stay, index) => (
          <Listing
            key={index}
            listing={stay}
            getDistance={getDistance}
            userLatLng={userLatLng}
          ></Listing>
        ))}
      </div>
      {/* {filteredStays && (
        <div className="w-full flex flex-wrap gap-4">
          {filteredStays.map((stay, index) => (
            <Listing
              key={index}
              listing={stay}
              getDistance={getDistance}
              userLatLng={userLatLng}
            ></Listing>
          ))}
        </div>
      )} */}
    </ClientOnly>
  );
}

export default Listings;
