import React, { useCallback, useMemo, useEffect } from "react";
import Map, { Source, Layer, Marker } from "react-map-gl";
import { createGlobalStyle } from "styled-components";

function MapBox({ longitude, latitude }) {
  const [viewState, setViewState] = React.useState({
    longitude: longitude,
    latitude: latitude,
    zoom: 14,
  });

  const GlobalStyle = createGlobalStyle`
  .mapboxgl-map {
    -webkit-mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);
    border-radius: 1.5rem !important;
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
      >
        <Marker longitude={longitude} latitude={latitude}>
          <div className={"w-5 h-5 -z-10 bg-blue-500 rounded-full"}></div>
        </Marker>
      </Map>
    </div>
  );
}

export default MapBox;
