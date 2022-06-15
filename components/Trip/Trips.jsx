import React from "react";
import { useSelector } from "react-redux";

import ClientOnly from "../ClientOnly";
import Card from "./Card";

function AllTrips({ userProfile, trips, recommendedTrips }) {
  return (
    <ClientOnly>
      <div className="w-full flex flex-wrap justify-between">
        {recommendedTrips.map((trip, index) => (
          <Card
            key={index}
            listing={trip}
            userProfile={userProfile}
            trips={trips}
          ></Card>
        ))}
      </div>
    </ClientOnly>
  );
}

export default AllTrips;
