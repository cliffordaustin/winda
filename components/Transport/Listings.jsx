import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import Listing from "./Listing";
import ClientOnly from "../ClientOnly";

function Listings({ userProfile }) {
  const transports = useSelector((state) => state.transport.transports);

  return (
    <ClientOnly>
      <div className="w-full flex px-6 smUpdate:justify-center md:justify-start md:ml-0 flex-wrap gap-4">
        {transports.map((transport, index) => (
          <Listing
            key={index}
            listing={transport}
            userProfile={userProfile}
          ></Listing>
        ))}
      </div>
    </ClientOnly>
  );
}

export default Listings;
