import React, { useCallback, useMemo, useEffect, useState } from "react";
import Map, { Source, Layer, Marker } from "react-map-gl";
import Image from "next/image";
import { createGlobalStyle } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import MapMakers from "./MapMakers";
import { useRouter } from "next/router";
import { stayUrl } from "../../lib/stayUrl";
import PulseLoader from "react-spinners/PulseLoader";
import axios from "axios";

function MapBox() {
  const activeStay = useSelector((state) => state.stay.activeStay);

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

  const [stays, setStays] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const getAllStays = async () => {
    setIsLoading(true);
    const allStaysUrl = stayUrl(router.query, true);
    const allStays = await axios.get(`${allStaysUrl}`);
    setStays(allStays.data.results);
    setIsLoading(false);
  };

  useEffect(() => {
    getAllStays();
  }, []);

  const filteredStays = useCallback(() => {
    let staysItems = [];
    if (activeStay) {
      staysItems = stays.filter((stay) => stay.id !== activeStay.id);
      return staysItems;
    } else {
      return stays;
    }
  }, [stays, activeStay]);

  const markers = useMemo(
    () =>
      filteredStays().map((stay, index) => (
        <MapMakers stay={stay} key={index}></MapMakers>
      )),
    [filteredStays]
  );

  const override = {
    display: "block",
    margin: "0 auto",
    marginTop: "3px",
  };

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
