import React from "react";
import { useSelector } from "react-redux";

import ClientOnly from "../ClientOnly";
import Card from "./Card";

function AllTrips({ trips }) {
  return (
    <ClientOnly>
      <div className="w-full flex flex-wrap justify-between">
        {trips.map((trip, index) => (
          <Card
            key={index}
            listing={trip}
            isSecondTrip={trip.curated_trip_images ? true : false}
          ></Card>
        ))}

        {trips.length === 0 && (
          <div className="font-bold text-2xl text-center w-full mt-4">
            No result for this filter
          </div>
        )}
      </div>
    </ClientOnly>
  );
}

export default AllTrips;
