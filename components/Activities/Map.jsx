import React, { useCallback, useMemo, useEffect } from "react";
import Map, { Source, Layer, Marker } from "react-map-gl";
import Image from "next/image";
import { createGlobalStyle } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import MapMakers from "./MapMakers";

function MapBox() {
  const activities = useSelector((state) => state.activity.activities);
  const activeActivity = useSelector((state) => state.activity.activeStay);

  const [viewState, setViewState] = React.useState({
    longitude: activities.length > 0 ? activities[0].longitude : 36.8172449,
    latitude: activities.length > 0 ? activities[0].latitude : -1.2832533,
    zoom: 7,
  });

  const GlobalStyle = createGlobalStyle`
  .mapboxgl-map {
    -webkit-mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);
    @media (min-width: 1024px) {
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

  const filteredActivities = useCallback(() => {
    let activityItems = [];
    if (activeActivity) {
      activityItems = activities.filter(
        (activity) => activity.id !== activeActivity.id
      );
      return activityItems;
    } else {
      return activities;
    }
  }, [activities, activeActivity]);

  const markers = useMemo(
    () =>
      filteredActivities().map((activity, index) => (
        <MapMakers activity={activity} key={index}></MapMakers>
      )),
    [filteredActivities]
  );

  return (
    <div className="h-full w-full">
      <GlobalStyle></GlobalStyle>
      <Map
        reuseMaps
        width="100%"
        height="100%"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        // mapStyle="mapbox://styles/cliffaustin/cl0psgnss008714n29bmcpx68"
      >
        {markers}
      </Map>
    </div>
  );
}

export default MapBox;
