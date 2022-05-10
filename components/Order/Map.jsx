import React, {
  useCallback,
  useMemo,
  useEffect,
  useState,
  useRef,
} from "react";
import Map, {
  NavigationControl,
  useControl,
  Marker,
  Source,
  Layer,
} from "react-map-gl";
import Image from "next/image";
import { createGlobalStyle } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { length } from "@turf/turf";

import MapMakers from "./MapMakers";
import Search from "../Order/Search";
import DeckGL from "@deck.gl/react";
import { LineLayer, GeoJsonLayer } from "@deck.gl/layers";
import { load } from "@loaders.gl/core";
import { MVTLoader } from "@loaders.gl/mvt";
import { geojsonToBinary } from "@loaders.gl/gis";
import SearchDetails from "./SearchDetails";
import DriversMarker from "./DriversMarker";
import { randomNumber } from "./../../lib/random";

function MapBox({ staysOrders, activitiesOrders }) {
  const mapRoute = useSelector((state) => state.home.mapRoute);
  const activeItem = useSelector((state) => state.order.activeItem);
  const mapRef = useRef();

  const [state, setState] = useState({
    from: "",
    to: "",
    fromLong: 0,
    fromLat: 0,
    toLong:
      staysOrders.length > 0
        ? staysOrders[0].stay.longitude
        : activitiesOrders.length > 0
        ? activitiesOrders[0].activity.longitude
        : 0,
    toLat:
      staysOrders.length > 0
        ? staysOrders[0].stay.latitude
        : activitiesOrders.length > 0
        ? activitiesOrders[0].activity.latitude
        : 0,
  });

  const geojson = {
    type: "FeatureCollection",
    features: [],
  };

  // Used to draw a line between points
  const linestring = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [],
    },
  };

  useEffect(() => {
    if (activeItem) {
      setState({
        ...state,
        toLong: activeItem.longitude,
        toLat: activeItem.latitude,
      });
    }
    if (mapRef.current && activeItem) {
      mapRef.current.flyTo({
        center: [activeItem.longitude, activeItem.latitude],
        zoom: 14,
        duration: 1000,
      });
    }
  }, [activeItem]);

  const [drivers, setDrivers] = useState([
    {
      name: "John Doe",
      lat: -1.2828533,
      lng: 36.8105449,
      id: 1,
      status: "available",
      vehicle: "car",
      vehicle_type: "sedan",
      vehicle_color: "red",
      vehicle_plate: "ABC123",
      vehicle_model: "2019",
      vehicle_make: "Honda",
      vehicle_year: "2019",
      vehicle_image:
        "https://images.unsplash.com/photo-1614220654876-8a75c41f7a7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGhvbmRhfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
    },
    {
      name: "Jane Doe",
      lat: -1.2804533,
      lng: 36.8142449,
      id: 2,
      status: "available",
      vehicle: "car",
      vehicle_type: "Sedan",
      vehicle_color: "blue",
      vehicle_plate: "EFG123",
      vehicle_model: "2016",
      vehicle_make: "Toyota",
      vehicle_year: "2016",
      vehicle_image:
        "https://images.unsplash.com/photo-1638618164682-12b986ec2a75?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    },
    {
      name: "Jack Doe",
      lat: -1.2852533,
      lng: 36.8112449,
      id: 3,
      status: "available",
      vehicle: "car",
      vehicle_type: "SUV",
      vehicle_color: "black",
      vehicle_plate: "HIJ123",
      vehicle_model: "2018",
      vehicle_make: "KIA",
      vehicle_year: "2018",
      vehicle_image:
        "https://images.unsplash.com/photo-1626630530997-2d26c0438401?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Jill Doe",
      lat: -1.2888533,
      lng: 36.8199449,
      id: 4,
      status: "available",
      vehicle: "car",
      vehicle_type: "SUV",
      vehicle_color: "green",
      vehicle_plate: "KLM123",
      vehicle_model: "2015",
      vehicle_make: "Mazda",
      vehicle_year: "2015",
      vehicle_image:
        "https://images.unsplash.com/photo-1531181616225-f8e50c1ab53e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    },
    {
      name: "Joe Doe",
      lat: -1.2826533,
      lng: 36.8191449,
      id: 5,
      status: "not available",
      vehicle: "car",
      vehicle_type: "Estate",
      vehicle_color: "orange",
      vehicle_plate: "NOP123",
      vehicle_model: "2019",
      vehicle_make: "Nissan",
      vehicle_year: "2019",
      vehicle_image:
        "https://images.unsplash.com/photo-1486496572940-2bb2341fdbdf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    },
  ]);

  const [staysLongAndLat, setStaysLongAndLat] = useState([]);

  const [activitiesLongAndLat, setActivitiesLongAndLat] = useState([]);

  const changeDriversState = () => {
    const allDrivers = drivers.map((driver) => ({
      ...driver,
      lng: driver.lng + 1,
      lat: driver.lat + 1,
    }));

    setDrivers(allDrivers);
  };

  const [viewState, setViewState] = useState({
    longitude: state.toLong,
    latitude: state.toLat,
    zoom: 14,
  });

  const [routeData, setRouteData] = useState({});

  const [showSearchDetails, setShowSearchDetails] = useState(false);

  useEffect(() => {
    staysOrders.forEach((order) => {
      setStaysLongAndLat((staysLongAndLat) => [
        ...staysLongAndLat,
        order.stay.longitude,
        order.stay.latitude,
      ]);
    });
  }, [staysOrders]);

  useEffect(() => {
    activitiesOrders.forEach((order) => {
      setActivitiesLongAndLat((activitiesLongAndLat) => [
        ...activitiesLongAndLat,
        order.activity.longitude,
        order.activity.latitude,
      ]);
    });
  }, [activitiesOrders]);

  //   useEffect(() => {
  //     setViewState({
  //       longitude: state.fromLong,
  //       latitude: state.fromLat,
  //       zoom: 14,
  //     });
  //   }, [state.fromLat, state.fromLong]);

  //   useEffect(() => {
  //     setViewState({
  //       ...viewState,
  //       zoom: 14,
  //     });
  //   }, [state.fromLat, state.fromLong]);

  const GlobalStyle = createGlobalStyle`
  .mapboxgl-map {
    -webkit-mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);
    @media (min-width: 768px) {
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

  const data = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [staysLongAndLat, activitiesLongAndLat],
        },
      },
    ],
  };

  const onSelectPlace = useCallback((longitude, latitude, zoom = 13) => {
    mapRef.current.flyTo({
      center: [longitude, latitude],
      zoom: zoom,
      duration: 2000,
    });
  }, []);

  const staysMarkers = useMemo(
    () =>
      staysOrders.map((order, index) => (
        <MapMakers order={order.stay} key={index} state="stay"></MapMakers>
      )),
    [staysOrders]
  );

  const activitiesMarkers = useMemo(
    () =>
      activitiesOrders.map((order, index) => (
        <MapMakers
          order={order.activity}
          key={index}
          state="activity"
        ></MapMakers>
      )),
    [activitiesOrders]
  );

  const driverMarkers = useMemo(
    () =>
      drivers.map((driver, index) => (
        <DriversMarker key={index} driver={driver}></DriversMarker>
      )),
    [drivers]
  );

  const distanceContainer = process.browser
    ? document.getElementById("distance")
    : null;

  const pointClick = (evt) => {
    const features = mapRef.current.queryRenderedFeatures(evt.point, {
      layers: ["pointLayer"],
    });

    if (geojson.features.length > 1) {
      geojson.features.pop();
    }

    if (features.length) {
      const id = features[0].properties.id;
      geojson.features = geojson.features.filter(
        (point) => point.properties.id !== id
      );
    } else {
      const point = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [evt.lngLat.lng, evt.lngLat.lat],
        },
        properties: {
          id: String(new Date().getTime()),
        },
      };

      geojson.features.push(point);
    }

    if (geojson.features.length > 1) {
      console.log("first here");
      linestring.geometry.coordinates = geojson.features.map(
        (point) => point.geometry.coordinates
      );

      geojson.features.push(linestring);

      if (process.browser) {
        distanceContainer.innerHTML = `Total distance: ${length(
          linestring
        ).toFixed(2)}km`;
        distanceContainer.classList.add("bg-black");
      }
    } else if (geojson.features.length <= 1) {
      if (process.browser) {
        distanceContainer.innerHTML = ``;
        distanceContainer.classList.remove("bg-black");
      }
    }

    mapRef.current.getSource("geojson").setData(geojson);
  };

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <GlobalStyle></GlobalStyle>

      <Map
        reuseMaps
        ref={mapRef}
        width="100%"
        height="100%"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
        initialViewState={{
          longitude: 36.8172449,
          latitude: -1.2832533,
          zoom: 14,
        }}
        // onMove={(evt) => setViewState(evt.viewState)}
        onMouseMove={(evt) => {
          const features = mapRef.current.queryRenderedFeatures(evt.point, {
            layers: ["pointLayer"],
          });
          mapRef.current.getCanvas().style.cursor = features.length
            ? "pointer"
            : "crosshair";
        }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onClick={pointClick}
      >
        <NavigationControl />
        {driverMarkers}
        {staysMarkers}
        {activitiesMarkers}

        <Source id="geojson" type="geojson" data={geojson}>
          <Layer
            id="lineLayer"
            type="line"
            source="geojson"
            layout={{
              "line-join": "round",
              "line-cap": "round",
            }}
            paint={{
              "line-color": "#dd2e01",
              "line-width": 3.5,
            }}
            filter={["in", "$type", "LineString"]}
          />

          <Layer
            id="pointLayer"
            type="circle"
            source="geojson"
            paint={{
              "circle-radius": 10,
              "circle-color": "#dd2e01",
            }}
            filter={["in", "$type", "Point"]}
          />
        </Source>

        {state.fromLat && state.fromLong && (
          <Marker longitude={state.fromLong} latitude={state.fromLat}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              className="w-9 h-9 text-red-600"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 21a29.776 29.776 0 0 1-3.5-3.531C6.9 15.558 5 12.712 5 10a7 7 0 0 1 11.952-4.951A6.955 6.955 0 0 1 19 10c0 2.712-1.9 5.558-3.5 7.469A29.777 29.777 0 0 1 12 21Zm0-14a3 3 0 1 0 0 6a3 3 0 0 0 0-6Z"
              />
            </svg>
          </Marker>
        )}
      </Map>

      <div
        id="distance"
        className="absolute bottom-2 right-4 font-bold px-2 py-2 bg-opacity-50 rounded-lg text-center"
      ></div>
      <div className="absolute top-6 left-5 lg:w-[50%] w-[70%]">
        <Search
          state={state}
          setState={setState}
          setRouteData={setRouteData}
          setShowSearchDetails={setShowSearchDetails}
          onSelectPlace={onSelectPlace}
        ></Search>
      </div>

      {showSearchDetails && (
        <div className="absolute lg:left-2 left-2/4 lg:-translate-x-0 -translate-x-2/4 bottom-[50%] md:bottom-12">
          <SearchDetails
            location={state.from}
            routeData={routeData}
          ></SearchDetails>
        </div>
      )}
    </div>
  );
}

export default MapBox;
