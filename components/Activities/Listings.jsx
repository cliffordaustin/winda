import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
// import { setFilteredStays } from "../../redux/actions/stay";

import Listing from "./Listing";
import ClientOnly from "../ClientOnly";

function Listings({ getDistance, userLatLng }) {
  const activities = useSelector((state) => state.activity.activities);

  return (
    <ClientOnly>
      <div className="w-full flex flex-wrap gap-4">
        {activities.map((activity, index) => (
          <Listing
            key={index}
            listing={activity}
            getDistance={getDistance}
            userLatLng={userLatLng}
          ></Listing>
        ))}
      </div>
    </ClientOnly>
  );
}

export default Listings;
