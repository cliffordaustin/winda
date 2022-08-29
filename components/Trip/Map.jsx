import React, { useMemo, useEffect, useState, useRef } from "react";
import Map, { Marker } from "react-map-gl";

import { createGlobalStyle } from "styled-components";

import { Icon } from "@iconify/react";

function MapBox({ trip }) {
  const mapRef = useRef();

  const [viewport, setViewport] = useState({
    longitude: trip.stay
      ? trip.stay.longitude
      : trip.activity
      ? trip.activity.longitude
      : 36.8442449,
    latitude: trip.stay
      ? trip.stay.latitude
      : trip.activity
      ? trip.activity.latitude
      : -1.3924933,
    zoom: 5,
  });

  const GlobalStyle = createGlobalStyle`
  .mapboxgl-map {
    -webkit-mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);
    @media (min-width: 768px) {
      border-radius: 0.5rem !important;
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
        scrollZoom={false}
        boxZoom={false}
        doubleClickZoom={false}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
        onMove={(evt) => setViewport(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        {trip.stay && (
          <Marker longitude={trip.stay.longitude} latitude={trip.stay.latitude}>
            <Icon icon="gis:home" className="w-6 h-6 text-gray-800" />
          </Marker>
        )}

        {trip.activity && (
          <Marker
            longitude={trip.activity.longitude}
            latitude={trip.activity.latitude}
          >
            <Icon
              icon="fa6-solid:person-hiking"
              className="w-6 h-6 text-gray-800"
            />
          </Marker>
        )}
      </Map>
      <div
        id="distance"
        className="absolute bottom-2 right-4 font-bold px-2 py-2 bg-opacity-50 rounded-lg text-center"
      ></div>
    </div>
  );
}

export default MapBox;
