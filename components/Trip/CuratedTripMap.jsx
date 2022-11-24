import React, { useMemo, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import Map, { Marker, NavigationControl } from "react-map-gl";

import { createGlobalStyle } from "styled-components";
import SwiperCore, { FreeMode, Navigation, Thumbs } from "swiper";

import { Icon } from "@iconify/react";
import MapMakers from "./MapMakers";
import Dialogue from "../Home/Dialogue";
import { Swiper, SwiperSlide } from "swiper/react";

// import "swiper/css";
import "swiper/css/thumbs";
SwiperCore.use([Navigation]);
function CuratedTripMap({ locations }) {
  const mapRef = useRef();

  const [expandMap, setExpandMap] = useState(false);

  const [viewport, setViewport] = useState({
    longitude: locations.length > 0 ? locations[0].longitude : 36.8442449,
    latitude: locations.length > 0 ? locations[0].latitude : -1.3924933,
    zoom: 5,
  });

  const [viewportExpandedMap, setViewportExpandedMap] = useState({
    longitude: locations.length > 0 ? locations[0].longitude : 36.8442449,
    latitude: locations.length > 0 ? locations[0].latitude : -1.3924933,
    zoom: 4,
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

  const settings = {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  };

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
          <MapMakers
            num={index + 1}
            key={index}
            location={location}
          ></MapMakers>
        ))}
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
        {/* <div className="mt-2 flex items-center">
          <Swiper
            {...settings}
            slidesPerView={"auto"}
            freeMode={true}
            modules={[Navigation, Thumbs]}
            className={"!w-full !relative !px-4 "}
          >
            {locations.map((location, index) => (
              <SwiperSlide
                key={index}
                className="!w-fit flex items-center justify-center"
              >
                <div className="px-2 py-1 text-sm font-bold text-white bg-blue-500 rounded-3xl items-center">
                  {location.location}
                </div>
                {locations.length !== index + 1 && (
                  <div className="w-[50px] h-[1px] bg-gray-500"></div>
                )}
              </SwiperSlide>
            ))}

            <div
              className={
                "hidden absolute h-14 w-20 pl-2 bg-gradient-to-r from-white text-white left-0 z-20 -top-[50%] md:flex items-center justify-start "
              }
            >
              <div className="cursor-pointer h-5 w-5 swiper-button-prev rounded-full border bg-gray-50 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </div>
            </div>

            <div
              className={
                "hidden absolute h-14 w-20 pr-2 bg-gradient-to-l from-white text-white right-0 z-20 -top-[50%] md:flex items-center justify-end "
              }
            >
              <div className="cursor-pointer h-5 w-5 swiper-button-next rounded-full border bg-gray-50 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Swiper>
        </div> */}
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
      </Dialogue>
    </div>
  );
}

CuratedTripMap.propTypes = {};

export default CuratedTripMap;
