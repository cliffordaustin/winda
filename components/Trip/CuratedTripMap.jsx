import React, { useMemo, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import Map, { Marker, NavigationControl } from "react-map-gl";

import { createGlobalStyle } from "styled-components";

import { Icon } from "@iconify/react";
import MapMakers from "./MapMakers";

function CuratedTripMap({ locations }) {
  const mapRef = useRef();

  const [viewport, setViewport] = useState({
    longitude: 36.8442449,
    latitude: -1.3924933,
    zoom: 5,
  });

  const GlobalStyle = createGlobalStyle`
  .mapboxgl-map {
    -webkit-mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);
    @media (min-width: 768px) {
      border-radius: 0rem !important;
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
        <NavigationControl></NavigationControl>
        {locations.map((location, index) => (
          <MapMakers key={index} location={location}></MapMakers>
        ))}
      </Map>
      <div className="absolute top-1 left-1 bg-gray-600 w-10 h-10 flex items-center justify-center font-bold bg-opacity-70 cursor-pointer text-center">
        <Icon className="w-8 h-8" icon="fluent:arrow-expand-24-filled" />
      </div>
    </div>
  );
}

CuratedTripMap.propTypes = {};

export default CuratedTripMap;
