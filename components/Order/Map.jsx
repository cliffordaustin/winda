import React, { useMemo, useEffect, useState, useRef } from "react";
import Map, { NavigationControl } from "react-map-gl";

import { createGlobalStyle } from "styled-components";
import { useSelector } from "react-redux";

import { useRouter } from "next/router";

import MapMakers from "./MapMakers";

import DriversMarker from "./DriversMarker";

import { clusterLayer } from "./Cluster";

function MapBox({ staysOrders, activitiesOrders, trips, startingPoint }) {
  const activeItem = useSelector((state) => state.order.activeItem);
  const mapRef = useRef();
  const router = useRouter();

  const [viewport, setViewport] = useState({
    longitude:
      trips.length > 0 && trips[0].stay
        ? trips[0].stay.longitude
        : trips.length > 0 && trips[0].activity
        ? trips[0].activity.longitude
        : 36.8442449,
    latitude:
      trips.length > 0 && trips[0].stay
        ? trips[0].stay.latitude
        : trips.length > 0 && trips[0].activity
        ? trips[0].activity.latitude
        : -1.3924933,
    zoom: 5,
  });

  const [state, setState] = useState({
    from: "",
    to: "",
    fromLong: 0,
    fromLat: 0,
    toLong:
      trips.length > 0 && trips[0].stay
        ? trips[0].stay.longitude
        : trips.length > 0 && trips[0].activity
        ? trips[0].activity.longitude
        : 36.8442449,
    toLat:
      trips.length > 0 && trips[0].stay
        ? trips[0].stay.latitude
        : trips.length > 0 && trips[0].activity
        ? trips[0].activity.latitude
        : -1.3924933,
  });

  useEffect(() => {
    if (activeItem) {
      setState({
        ...state,
        toLong: activeItem.longitude,
        toLat: activeItem.latitude,
      });
    }
    if (mapRef.current && activeItem) {
      mapRef.current.flyTo({
        center: [activeItem.longitude, activeItem.latitude],
        zoom: 14,
        duration: 1000,
      });
    }
  }, [activeItem]);

  const [staysLongAndLat, setStaysLongAndLat] = useState([]);

  const [activitiesLongAndLat, setActivitiesLongAndLat] = useState([]);

  const [data, setData] = useState({
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: [],
    },
  });

  useEffect(() => {
    setStaysLongAndLat([]);
    trips.forEach((trip) => {
      if (trip.stay) {
        setStaysLongAndLat((staysLongAndLat) => [
          ...staysLongAndLat,
          [trip.stay.longitude, trip.stay.latitude],
        ]);

        setData({
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [
              ...data.geometry.coordinates,
              [trip.stay.longitude, trip.stay.latitude],
            ],
          },
        });
      }
    });
  }, [trips]);

  useEffect(() => {
    setActivitiesLongAndLat([]);
    trips.forEach((trip) => {
      if (trip.activity) {
        setActivitiesLongAndLat((activitiesLongAndLat) => [
          ...activitiesLongAndLat,
          [trip.activity.longitude, trip.activity.latitude],
        ]);
      }
    });
  }, [trips]);

  const GlobalStyle = createGlobalStyle`
  .mapboxgl-map {
    -webkit-mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);
    @media (min-width: 768px) {
      border-radius: 1.5rem !important;
    }
  }
  .mapboxgl-popup-content {
    background: none;
    box-shadow: none !important;
  }
  .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
    border-top-color: transparent !important;
    border: none !important;
  }
`;

  useEffect(() => {
    setData({
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [...staysLongAndLat, ...activitiesLongAndLat],
      },
    });
  }, []);

  const staysMarkers = useMemo(
    () =>
      trips.map((trip, index) => (
        <div key={index}>
          {trip.stay && (
            <MapMakers order={trip.stay} index={index} state="stay"></MapMakers>
          )}
        </div>
      )),
    [trips]
  );

  const activitiesMarkers = useMemo(
    () =>
      trips.map((trip, index) => (
        <div key={index}>
          {trip.activity && (
            <MapMakers
              order={trip.activity}
              index={index}
              state="activity"
            ></MapMakers>
          )}
        </div>
      )),
    [trips]
  );

  const driverMarkers = useMemo(
    () =>
      trips.map((trip, index) => {
        if (trip.transport) {
          return (
            <DriversMarker
              key={index}
              driver={trip.transport}
              startingPoint={
                index === 0
                  ? startingPoint
                  : trips[index - 1].stay && trips[index - 1].stay.location
                  ? trips[index - 1].stay.location
                  : trips[index - 1].activity &&
                    trips[index - 1].activity.location
                  ? trips[index - 1].activity.location
                  : "Nairobi"
              }
            ></DriversMarker>
          );
        }
      }),
    [trips]
  );

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <GlobalStyle></GlobalStyle>

      <Map
        {...viewport}
        maxZoom={20}
        reuseMaps
        ref={mapRef}
        width="100%"
        height="100%"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
        onMove={(evt) => setViewport(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        interactiveLayerIds={[clusterLayer.id]}
      >
        <NavigationControl />
        {staysMarkers}
        {activitiesMarkers}

        {router.query.transport === "show" && driverMarkers}
      </Map>
      <div
        id="distance"
        className="absolute bottom-2 right-4 font-bold px-2 py-2 bg-opacity-50 rounded-lg text-center"
      ></div>
    </div>
  );
}

export default MapBox;
