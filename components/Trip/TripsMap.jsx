import React, { useMemo, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import Map, { Marker, NavigationControl, Source, Layer } from "react-map-gl";

import { createGlobalStyle } from "styled-components";

import { Icon } from "@iconify/react";
import MapMakers from "./MapMakers";

const locations = [
  {
    trip: "April 23: African Heritage House, Nairobi",
    latitude: -1.400327852,
    longitude: 36.93917108,
  },
  {
    trip: "April 24 - 25: Camping in Shompole, Lake Magadi",
    latitude: -2.012615428,
    longitude: 36.04457107,
  },
  {
    trip: "April 25 - 26: AA Lodges, Amboseli National Park",
    latitude: -2.752776836,
    longitude: 37.39852237,
  },
  {
    trip: "April 26 - 28: Lion’s Bluff Lodge, Tsavo National Park",
    latitude: -3.497287131,
    longitude: 38.20656041,
  },
  {
    trip: "April 28 - 30: Watamu Beach Cottages, Watamu",
    latitude: -3.383028007,
    longitude: 39.98184201,
  },
  {
    trip: "April 30 - May 3: Boutique Villa, Lamu",
    latitude: -2.295315429,
    longitude: 40.91508387,
  },
  {
    trip: "May 3 - 4: Treehouse, Nairobi",
    latitude: -1.368808558,
    longitude: 36.75073857,
  },
  {
    trip: "May 4 - 7: Camping, Loita Hills",
    latitude: -1.799830952,
    longitude: 35.89447973,
  },
  {
    trip: "May 7 - 9: Amazing Mara Camp, Maasai Mara",
    latitude: -1.429567715,
    longitude: 35.18561773,
  },
  {
    trip: "May 9 - 10: Airbnb in Westlands, Nairobi",
    latitude: -1.261191622,
    longitude: 36.7894403,
  },
  {
    trip: "May 10 - 11: River Trees Inn, Arusha",
    latitude: -3.373356693,
    longitude: 36.86441968,
  },
  {
    trip: "May 11 - 13: Kirurumu Lodge, Lake Manyara",
    latitude: -3.360558469,
    longitude: 35.83304911,
  },
  {
    trip: "May 13 - 15: The Plantation Lodge, Ngorongoro crater",
    latitude: -3.327826974,
    longitude: 35.6345586,
  },
];
function TripsMap() {
  const mapRef = useRef();

  const [viewportExpandedMap, setViewportExpandedMap] = useState({
    longitude: 36.8442449,
    latitude: -1.3924933,
    zoom: 6,
  });

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <div className="w-full h-[90vh]">
        <Map
          {...viewportExpandedMap}
          maxZoom={20}
          reuseMaps
          ref={mapRef}
          width="100%"
          height="100%"
          scrollZoom={true}
          boxZoom={true}
          doubleClickZoom={true}
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
    </div>
  );
}

TripsMap.propTypes = {};

export default TripsMap;
