import React, { useMemo, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import Map, { Marker, NavigationControl, Source, Layer } from "react-map-gl";
import axios from "axios";
import { useRouter } from "next/router";

import { createGlobalStyle } from "styled-components";
import Dialogue from "../Home/Dialogue";

import { Icon } from "@iconify/react";
import MapMakers from "./MapMakers";

function TripsMap() {
  const router = useRouter();

  const [locations, setLocations] = useState([]);

  const getLocation = async () => {
    const locations = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/curated-trips/${router.query.slug}/locations/`
    );
    setLocations(locations.data.results);
  };

  useEffect(() => {
    getLocation();
  }, []);

  const mapRef = useRef();

  const [viewport, setViewport] = useState({
    longitude: 36.8442449,
    latitude: -1.3924933,
    zoom: 4,
  });

  const [expandMap, setExpandMap] = useState(false);

  const [viewportExpandedMap, setViewportExpandedMap] = useState({
    longitude: 36.8442449,
    latitude: -1.3924933,
    zoom: 5,
  });

  const markers = useMemo(() => {
    return locations.map((location, index) => (
      <Marker
        longitude={location.longitude}
        latitude={location.latitude}
        key={index}
      >
        <h1 className="font-bold">map</h1>
      </Marker>
    ));
  }, [locations]);

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <Map
        {...viewport}
        maxZoom={20}
        ref={mapRef}
        width="100%"
        height="100%"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
        onMove={(evt) => setViewport(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <NavigationControl></NavigationControl>
        {/* {markers} */}
      </Map>

      <div
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
            {/* {markers} */}
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
      </Dialogue>
    </div>
  );
}

TripsMap.propTypes = {};

export default TripsMap;
