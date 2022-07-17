import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";

import Listing from "./Listing";
import ClientOnly from "../ClientOnly";

function Listings({
  userProfile,
  transports,
  setCurrentListing,
  slugIsCorrectForGroupTrip,
  slugIsCorrect,
}) {
  return (
    <ClientOnly>
      <div className="w-full flex px-3 md:px-0 smUpdate:justify-center md:justify-center md:ml-0 flex-wrap gap-8 sm:gap-3 xl:gap-4">
        {transports.map((transport, index) => (
          <Listing
            slugIsCorrect={slugIsCorrect}
            slugIsCorrectForGroupTrip={slugIsCorrectForGroupTrip}
            key={index}
            listing={transport}
            userProfile={userProfile}
            setCurrentListing={setCurrentListing}
          ></Listing>
        ))}
      </div>
    </ClientOnly>
  );
}

export default Listings;
