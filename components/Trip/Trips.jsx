import React from "react";
import { useSelector } from "react-redux";

import ClientOnly from "../ClientOnly";
import Card from "./Card";

function AllTrips({ userProfile, trips }) {
  const stays = useSelector((state) => state.stay.stays);

  return (
    <ClientOnly>
      <div className="w-full flex flex-wrap justify-between">
        {stays.map((stay, index) => (
          <Card
            key={index}
            listing={stay}
            userProfile={userProfile}
            trips={trips}
          ></Card>
        ))}
      </div>
    </ClientOnly>
  );
}

export default AllTrips;
