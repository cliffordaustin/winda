import React from "react";
import { useSelector } from "react-redux";

import ClientOnly from "../ClientOnly";
import Card from "./Card";

function AllTrips({
  userProfile,
  trips,
  userTrips,
  recommendedTrips,
  isSecondTrip,
  setShowAddToTripPopup,
  showAddToTripPopup,
  setSelectedData,
}) {
  return (
    <ClientOnly>
      <div className="w-full flex flex-wrap justify-between">
        {recommendedTrips.map((trip, index) => (
          <Card
            key={index}
            listing={trip}
            userProfile={userProfile}
            trips={trips}
            userTrips={userTrips}
            isSecondTrip={isSecondTrip}
            setSelectedData={setSelectedData}
            setShowAddToTripPopup={setShowAddToTripPopup}
            showAddToTripPopup={showAddToTripPopup}
          ></Card>
        ))}

        {recommendedTrips.length === 0 && (
          <div className="font-bold text-2xl text-center w-full mt-4">
            No result for this filter
          </div>
        )}
      </div>
    </ClientOnly>
  );
}

export default AllTrips;
