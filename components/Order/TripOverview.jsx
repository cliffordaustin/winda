import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Steps from "rc-steps";
import axios from "axios";
import moment from "moment";

import "rc-steps/assets/index.css";
import StayType from "../ui/StayType";

const TripOverview = ({ staysOrder, activitiesOrder }) => {
  const [staysLongAndLat, setStaysLongAndLat] = useState([]);

  const [activitiesLongAndLat, setActivitiesLongAndLat] = useState([]);

  const [stays, setStays] = useState(staysOrder);

  const [activities, setActivities] = useState(activitiesOrder);

  const [staysAndActivitiesLongAndLat, setStaysAndActivitiesLongAndLat] =
    useState({
      distance: 0,
      duration: 0,
    });

  useEffect(() => {
    setStaysLongAndLat([]);
    let staysOrdersFormatted = staysOrder.map((order) => {
      return [order.stay.longitude, order.stay.latitude];
    });

    setStaysLongAndLat(staysOrdersFormatted);
  }, [staysOrder]);

  useEffect(() => {
    setActivitiesLongAndLat([]);
    let staysActivitiesFormatted = activitiesOrder.map((order) => {
      return [order.activity.longitude, order.activity.latitude];
    });

    setActivitiesLongAndLat(staysActivitiesFormatted);
  }, [activitiesOrder]);

  useEffect(() => {
    if (staysLongAndLat.length > 0 && activitiesLongAndLat.length > 0) {
      let addStaysAndActivitiesLongAndLat = [
        ...staysLongAndLat,
        ...activitiesLongAndLat,
      ]
        .slice(0, 24)
        .map((item) => {
          return item.toString() + ";";
        });
      addStaysAndActivitiesLongAndLat = addStaysAndActivitiesLongAndLat
        .toString()
        .replace("[", "")
        .replace("]", "")
        .replaceAll(";,", ";")
        .slice(0, -1);
      if (addStaysAndActivitiesLongAndLat) {
        axios
          .get(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${addStaysAndActivitiesLongAndLat}?geometries=geojson&steps=true&access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`
          )
          .then((res) => {
            setStaysAndActivitiesLongAndLat({
              distance: res.data.routes[0].distance,
              duration: res.data.routes[0].duration,
            });
          });
      }
    }
  }, [staysLongAndLat, activitiesLongAndLat]);

  const getDistance = async (longitude1, latitude1, longitude2, latitude2) => {
    if (longitude1 && latitude1 && longitude2 && latitude2) {
      try {
        const { data } = await axios.get(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${longitude1},${latitude1};${longitude2},${latitude2}?geometries=geojson&steps=true&access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`
        );

        if (data.routes.length > 0) {
          return {
            distance: data.routes[0].distance,
            duration: data.routes[0].duration,
          };
        } else {
          return {
            distance: null,
            duration: null,
          };
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      return {
        distance: null,
        duration: null,
      };
    }
  };

  const getDistanceBetweenStays = async () => {
    let distanceBetweenStays = [];
    let index = 0;
    for (const item of staysOrder) {
      const trip = await getDistance(
        staysLongAndLat[index - 1] ? staysLongAndLat[index - 1][0] : null,
        staysLongAndLat[index - 1] ? staysLongAndLat[index - 1][1] : null,
        staysLongAndLat[index] ? staysLongAndLat[index][0] : null,
        staysLongAndLat[index] ? staysLongAndLat[index][1] : null
      );

      distanceBetweenStays.push({
        distance: trip.distance,
        duration: trip.duration,
        ...item,
      });

      index++;
    }

    setStays(distanceBetweenStays);
  };

  const getDistanceBetweenActivities = async () => {
    let distanceBetweenActivities = [];
    let index = 0;
    for (const item of activitiesOrder) {
      const trip = await getDistance(
        activitiesLongAndLat[index - 1]
          ? activitiesLongAndLat[index - 1][0]
          : null,
        activitiesLongAndLat[index - 1]
          ? activitiesLongAndLat[index - 1][1]
          : null,
        activitiesLongAndLat[index] ? activitiesLongAndLat[index][0] : null,
        activitiesLongAndLat[index] ? activitiesLongAndLat[index][1] : null
      );

      distanceBetweenActivities.push({
        distance: trip.distance,
        duration: trip.duration,
        ...item,
      });

      index++;
    }

    setActivities(distanceBetweenActivities);
  };

  useEffect(() => {
    getDistanceBetweenStays();
  }, [staysOrder, staysLongAndLat]);

  useEffect(() => {
    getDistanceBetweenActivities();
  }, [activitiesOrder, activitiesLongAndLat]);

  return (
    <>
      {stays.length > 1 && (
        <>
          <div className="mt-2 mb-2 ml-4 text-lg font-bold">
            Stays - Trip Overview
          </div>

          <Steps direction="vertical">
            {stays.map((stay, index) => {
              return (
                <Steps.Step
                  key={index}
                  title={<h1 className="text-sm inline">{stay.stay.name}</h1>}
                  subTitle={
                    <div className="px-1 rounded-md bg-blue-600 text-white">
                      {stay.stay.location}
                    </div>
                  }
                  description={
                    index > 0 && stay.distance && stay.duration ? (
                      <p className="text-xs">
                        With a driving distance of about{" "}
                        {(stay.distance * 0.001).toFixed(1)} km, it will take
                        you approximately{" "}
                        {moment.duration(stay.duration, "seconds").humanize()}{" "}
                        to go from{" "}
                        <span className="font-bold">
                          {stays[index - 1].stay.name} in{" "}
                          {stays[index - 1].stay.loaction}
                        </span>{" "}
                        to{" "}
                        <span className="font-bold">
                          {stay.stay.name} in {stay.stay.location}
                        </span>
                      </p>
                    ) : null
                  }
                  status="process"
                />
              );
            })}
          </Steps>
        </>
      )}

      {activities.length > 1 && (
        <>
          <div className="mt-2 mb-2 ml-4 text-lg font-bold">
            Experiences - Trip Overview
          </div>

          <Steps direction="vertical">
            {activities.map((activity, index) => {
              return (
                <Steps.Step
                  key={index}
                  title={
                    <h1 className="text-sm inline">{activity.activity.name}</h1>
                  }
                  subTitle={
                    <div className="px-1 rounded-md bg-blue-600 text-white">
                      {activity.activity.location}
                    </div>
                  }
                  description={
                    index > 0 && activity.distance && activity.duration ? (
                      <p className="text-xs">
                        With a driving distance of about{" "}
                        {(activity.distance * 0.001).toFixed(1)} km, it will
                        take you approximately{" "}
                        {moment
                          .duration(activity.duration, "seconds")
                          .humanize()}{" "}
                        to go from{" "}
                        <span className="font-bold">
                          {activities[index - 1].activity.name} in{" "}
                          {activities[index - 1].activity.location}
                        </span>{" "}
                        to{" "}
                        <span className="font-bold">
                          {activity.activity.name} in{" "}
                          {activity.activity.location}
                        </span>
                      </p>
                    ) : null
                  }
                  status="process"
                />
              );
            })}
          </Steps>
        </>
      )}

      {/* <div className="mt-4 text-sm">
        By driving, your trip has an estimated distance of{" "}
        {(staysAndActivitiesLongAndLat.distance * 0.001).toFixed(1)} km and a
        duration of{" "}
        {moment
          .duration(staysAndActivitiesLongAndLat.duration, "seconds")
          .humanize()}
      </div> */}

      {activities.length === 1 && stays.length === 1 && (
        <>
          <div className="mt-2 mb-2 ml-4 text-lg font-bold">Trip Overview</div>

          <Steps direction="vertical">
            {[...stays, ...activities].map((item, index) => {
              return (
                <Steps.Step
                  key={index}
                  title={
                    <h1 className="text-sm inline">
                      {item.stay ? item.stay.name : item.activity.name}
                    </h1>
                  }
                  subTitle={
                    item.stay ? (
                      <div className="px-1 rounded-md bg-blue-600 text-white">
                        {item.stay.location}
                      </div>
                    ) : item.activity ? (
                      <div className="px-1 rounded-md bg-blue-600 text-white">
                        {item.activity.location}
                      </div>
                    ) : (
                      ""
                    )
                  }
                  status="process"
                />
              );
            })}
          </Steps>
        </>
      )}

      {(activities.length === 0 || stays.length === 0) && (
        <>
          <div className="mt-2 mb-2 ml-4 text-lg font-bold">Trip Overview</div>
          <div className="mt-2 mb-2 ml-4 text-base font-medium">
            Add one more item to your trip to display location overview
          </div>
        </>
      )}

      {activitiesLongAndLat.length > 0 && staysLongAndLat.length > 0 && (
        <div className="mt-4">
          <div className="py-2 px-2 bg-gray-100 flex justify-between rounded-t-lg">
            <h1 className="font-bold text-sm">Total estimated distance</h1>
            <span className="font-bold text-sm">
              {" "}
              {(staysAndActivitiesLongAndLat.distance * 0.001).toFixed(1)} km
            </span>
          </div>
          <div className="py-2 px-2 bg-gray-100 flex justify-between rounded-b-lg">
            <h1 className="font-bold text-sm">Total estimated duration</h1>
            <span className="font-bold text-sm">
              {moment
                .duration(staysAndActivitiesLongAndLat.duration, "seconds")
                .humanize()}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

TripOverview.propTypes = {};

export default TripOverview;
