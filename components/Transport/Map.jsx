import React, { useCallback, useMemo, useEffect, useRef } from "react";
import Map, { Source, Layer, Marker, NavigationControl } from "react-map-gl";
import Image from "next/image";
import { createGlobalStyle } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import Button from "../ui/Button";

function MapBox({ longitude, latitude }) {
  const mapRoute = useSelector((state) => state.home.mapRoute);

  const [viewState, setViewState] = React.useState({
    longitude: longitude,
    latitude: latitude,
    zoom: 8,
  });

  const mapRef = useRef();

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

  const dataOne = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: [...mapRoute.geometry.coordinates],
    },
  };

  const clicked = () => {
    mapRef.current.easeTo({
      center: mapRoute.geometry.coordinates[0],
      zoom: 12,
      duration: 500,
    });
  };

  useEffect(() => {
    if (mapRef.current) {
      clicked();
    }
  }, [mapRoute]);

  return (
    <div className="h-full w-full">
      <GlobalStyle></GlobalStyle>
      <Map
        reuseMaps
        width="100%"
        height="100%"
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        // mapStyle="mapbox://styles/cliffaustin/cl0psgnss008714n29bmcpx68"
      >
        <Source id="polylineLayer" type="geojson" data={dataOne}>
          <Layer
            id="lineLayer"
            type="line"
            source="my-data"
            layout={{
              "line-join": "round",
              "line-cap": "round",
            }}
            paint={{
              "line-color": "rgba(3, 170, 238, 0.8)",
              "line-width": 5,
            }}
          />
        </Source>
        <NavigationControl />
      </Map>
    </div>
  );
}

export default MapBox;
