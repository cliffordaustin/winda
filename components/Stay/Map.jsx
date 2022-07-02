import React, { useCallback, useMemo, useEffect } from "react";
import Map, { Source, Layer, Marker, NavigationControl } from "react-map-gl";
import { createGlobalStyle } from "styled-components";
import { Icon } from "@iconify/react";

function MapBox({ longitude, latitude }) {
  const [viewState, setViewState] = React.useState({
    longitude: longitude,
    latitude: latitude,
    zoom: 9,
  });

  const GlobalStyle = createGlobalStyle`
  .mapboxgl-map {
    -webkit-mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);
    
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
        scrollZoom={false}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <NavigationControl />
        <Marker longitude={longitude} latitude={latitude}>
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
            <Icon icon="fa6-solid:house" className="text-white w-6 h-6" />
          </div>
        </Marker>
      </Map>
    </div>
  );
}

export default MapBox;
