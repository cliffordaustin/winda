import React, { useMemo, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import Map, { Marker, NavigationControl, Source, Layer } from "react-map-gl";
import axios from "axios";
import { useRouter } from "next/router";

import { createGlobalStyle } from "styled-components";

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

  const [viewportExpandedMap, setViewportExpandedMap] = useState({
    longitude: 36.8442449,
    latitude: -1.3924933,
    zoom: 6,
  });

  const markers = useMemo(() => {
    return locations.map((location, index) => (
      //   <MapMakers num={index + 1} key={index} location={location}></MapMakers>
      <Marker
        key={index}
        latitude={location.latitude}
        longitude={location.longitude}
      >
        <h1 className="font-bold">map</h1>
      </Marker>
    ));
  }, [locations]);

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <div className="w-full h-[90vh]">
        <Map
          {...viewportExpandedMap}
          maxZoom={20}
          ref={mapRef}
          width="100%"
          height="100%"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
          onMove={(evt) => setViewportExpandedMap(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        >
          <NavigationControl></NavigationControl>
          {markers}
        </Map>
      </div>
    </div>
  );
}

TripsMap.propTypes = {};

export default TripsMap;
