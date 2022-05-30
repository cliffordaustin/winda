import React from "react";
import { useSelector } from "react-redux";

import ClientOnly from "../ClientOnly";
import Card from "./ActivityCard";

function ActivityTrip({ userProfile, trips }) {
  const activities = useSelector((state) => state.activity.activities);

  return (
    <ClientOnly>
      <div className="w-full flex flex-wrap justify-between">
        {activities.map((activity, index) => (
          <Card
            key={index}
            listing={activity}
            userProfile={userProfile}
            trips={trips}
          ></Card>
        ))}
      </div>
    </ClientOnly>
  );
}

export default ActivityTrip;
