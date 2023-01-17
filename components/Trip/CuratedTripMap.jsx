import React, { useMemo, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import Map, { NavigationControl } from "react-map-gl";

import { createGlobalStyle } from "styled-components";

import { Icon } from "@iconify/react";
import MapMakers from "./MapMakers";
import Dialogue from "../Home/Dialogue";
function CuratedTripMap({ locations }) {
  const mapRef = useRef();

  // const [expandMap, setExpandMap] = useState(false);

  const [viewport, setViewport] = useState({
    longitude: locations.length > 0 ? locations[0].longitude : 36.8442449,
    latitude: locations.length > 0 ? locations[0].latitude : -1.3924933,
    zoom: 4,
  });

  // const [viewportExpandedMap, setViewportExpandedMap] = useState({
  //   longitude: locations.length > 0 ? locations[0].longitude : 36.8442449,
  //   latitude: locations.length > 0 ? locations[0].latitude : -1.3924933,
  //   zoom: 5,
  // });

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
        scrollZoom={true}
        boxZoom={true}
        doubleClickZoom={true}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
        onMove={(evt) => viewport(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <NavigationControl></NavigationControl>
        {locations.map((location, index) => (
          <MapMakers
            key={index}
            num={index + 1}
            location={location}
          ></MapMakers>
        ))}
      </Map>
      {/* <div
        onClick={() => {
          setExpandMap(!expandMap);
        }}
        className="absolute top-1 left-1 bg-gray-600 w-10 h-10 flex items-center justify-center font-bold bg-opacity-70 cursor-pointer text-center"
      >
        <Icon className="w-8 h-8" icon="fluent:arrow-expand-24-filled" />
      </div>

      <Dialogue
        isOpen={expandMap}
        closeModal={() => {
          setExpandMap(false);
        }}
        title="Map"
        dialogueTitleClassName="!font-bold ml-3"
        dialoguePanelClassName="max-h-[500px] !px-0 max-w-xl overflow-y-scroll remove-scroll"
      >
        <div className="mt-2 w-full h-[500px]">
          <Map
            {...viewportExpandedMap}
            maxZoom={20}
            reuseMaps
            ref={mapRef}
            width="100%"
            height="100%"
            scrollZoom={false}
            boxZoom={false}
            doubleClickZoom={false}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
            onMove={(evt) => setViewportExpandedMap(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/streets-v9"
          >
            <NavigationControl></NavigationControl>
            {locations.map((location, index) => (
              <MapMakers
                key={index}
                num={index + 1}
                location={location}
              ></MapMakers>
            ))}
          </Map>
        </div>

        <div className="fixed top-3 right-4 flex flex-col">
          <div
            onClick={(e) => {
              e.stopPropagation();
              setExpandMap(false);
            }}
            className="flex cursor-pointer items-center justify-center w-7 h-7 rounded-full bg-white shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
      </Dialogue> */}
    </div>
  );
}

CuratedTripMap.propTypes = {};

export default CuratedTripMap;
