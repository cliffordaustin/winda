import React, { useCallback, useMemo, useEffect, useState } from "react";
import Map, { Source, Layer, Marker } from "react-map-gl";
import Image from "next/image";
import { createGlobalStyle } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import MapMakers from "./MapMakers";
import PulseLoader from "react-spinners/PulseLoader";
import axios from "axios";
import { useRouter } from "next/router";

function MapBox() {
  const activeActivity = useSelector((state) => state.activity.activeStay);

  const [viewState, setViewState] = React.useState({
    longitude: 36.8172449,
    latitude: -1.2832533,
    zoom: 5,
  });

  const GlobalStyle = createGlobalStyle`
  .mapboxgl-map {
    -webkit-mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);
    @media (min-width: 1024px) {
      border-radius: 0.8rem !important;
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

  const [isLoading, setIsLoading] = useState(false);
  const [activities, setActivities] = useState([]);

  const router = useRouter();

  const getAllActivities = async () => {
    setIsLoading(true);
    const allactivities = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/all-activities/?search=${
        router.query.search ? router.query.search : ""
      }&d_search=${
        router.query.d_search ? router.query.d_search : ""
      }&min_capacity=${
        router.query.min_capacity ? router.query.min_capacity : ""
      }&pricing_type=${
        router.query.pricing_type ? router.query.pricing_type : ""
      }&type_of_activities=${
        router.query.type_of_stay ? router.query.type_of_stay : ""
      }&min_price=${
        router.query.min_price ? router.query.min_price : ""
      }&max_price=${
        router.query.max_price ? router.query.max_price : ""
      }&ordering=${router.query.ordering ? router.query.ordering : ""}&tags=${
        router.query.tags ? router.query.tags : ""
      }`
    );
    setActivities(allactivities.data.results);
    setIsLoading(false);
  };

  useEffect(() => {
    getAllActivities();
  }, []);

  const override = {
    display: "block",
    margin: "0 auto",
    marginTop: "3px",
  };

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
    <div className="h-full w-full shadow-lg rounded-xl">
      <GlobalStyle></GlobalStyle>
      {!isLoading && (
        <Map
          reuseMaps
          width="100%"
          height="100%"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
          minZoom={3}
          maxZoom={10}
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        >
          {markers}
        </Map>
      )}

      {isLoading && (
        <div className="flex items-center h-full justify-center">
          <PulseLoader
            color={"#000"}
            loading={isLoading}
            cssOverride={override}
            size={7}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
    </div>
  );
}

export default MapBox;
