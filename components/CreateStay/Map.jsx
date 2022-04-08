import React from "react";
import Map, { Source, Layer, GeolocateControl, Marker } from "react-map-gl";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

import { updateViewState } from "../../redux/actions/stay";
import { createGlobalStyle } from "styled-components";

function MapBox() {
  const dispatch = useDispatch();
  const viewState = useSelector((state) => state.stay.viewState);

  const [moving, setMoving] = React.useState(false);

  const GlobalStyle = createGlobalStyle`
  .mapboxgl-map {
    border-top-left-radius: 24px !important;
    border-bottom-left-radius: 24px !important;
    -webkit-mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);
  }
`;

  const geolocateControlRef = React.useCallback((ref) => {
    if (ref) {
      // Activate as soon as the control is loaded
      ref.trigger();
    }
  }, []);

  return (
    <div className="h-full w-full">
      <GlobalStyle></GlobalStyle>
      <Map
        reuseMaps
        width="100%"
        height="100%"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
        {...viewState}
        onMove={(evt) => {
          dispatch(updateViewState(evt.viewState));
          setMoving(true);
        }}
        onMoveEnd={(evt) => {
          setMoving(false);
        }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        // mapStyle="mapbox://styles/cliffaustin/cl0psgnss008714n29bmcpx68"
      >
        <Marker longitude={viewState.longitude} latitude={viewState.latitude}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={"h-10 w-10 absolute " + (moving ? "-top-1.5" : "")}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
        </Marker>
      </Map>
    </div>
  );
}

export default MapBox;
