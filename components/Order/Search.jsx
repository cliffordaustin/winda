import React from "react";
import { useState, useEffect } from "react";
import MapBox from "./Map";
import Input from "../ui/Input";
import styles from "../../styles/Search.module.css";
import stayStyles from "../../styles/Stay.module.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

function Search({
  state,
  setState,
  setRouteData,
  setShowSearchDetails,
  onSelectPlace,
}) {
  const dispatch = useDispatch();

  const [autoCompleteFromSearch, setAutoCompleteFromSearch] = useState([]);
  const [autoCompleteToSearch, setAutoCompleteToSearch] = useState([]);

  const onChangeFrom = (event) => {
    setState({ ...state, from: event.target.value });
    setShowSearchDetails(false);

    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${event.target.value}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&autocomplete=true&country=ke,ug,tz,rw,bi,tz,ug,tz,gh`
      )
      .then((response) => {
        setAutoCompleteFromSearch(response.data.features);
      });
  };

  //   const onChangeTo = (event) => {
  //     setState({ ...state, to: event.target.value });

  //     axios
  //       .get(
  //         `https://api.mapbox.com/geocoding/v5/mapbox.places/${event.target.value}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&autocomplete=true&country=ke`
  //       )
  //       .then((response) => {
  //         setAutoCompleteToSearch(response.data.features);
  //       });
  //   };

  //   const locationFromSearch = (item) => {
  //     setState({
  //       ...state,
  //       from: item.place_name,
  //       fromLat: item.geometry.coordinates[1],
  //       fromLong: item.geometry.coordinates[0],
  //     });
  //     setAutoCompleteFromSearch([]);
  //   };

  const getRoute = async (longitude, latitude) => {
    await axios
      .get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${longitude},${latitude};${state.toLong},${state.toLat}?geometries=geojson&steps=true&access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`
      )
      .then((response) => {
        if (response.data.routes.length > 0) {
          dispatch({
            type: "SET_MAP_ROUTE",
            payload: response.data.routes[0].geometry.coordinates,
          });
        } else {
          console.log("empty!!!");
          console.log(response.data);
        }
        setRouteData(response.data.routes[0]);
        console.log(response.data);
      });
  };

  const locationFromSearch = async (item) => {
    setState({
      ...state,
      from: item.place_name,
      fromLat: item.geometry.coordinates[1],
      fromLong: item.geometry.coordinates[0],
    });
    setAutoCompleteFromSearch([]);

    await axios
      .get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${item.geometry.coordinates[0]},${item.geometry.coordinates[1]};${state.toLong},${state.toLat}?geometries=geojson&steps=true&access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`
      )
      .then((response) => {
        if (response.data.routes.length > 0) {
          dispatch({
            type: "SET_MAP_ROUTE",
            payload: response.data.routes[0].geometry.coordinates,
          });
        } else {
          console.log("empty!!!");
          console.log(response.data);
        }

        onSelectPlace(
          item.geometry.coordinates[0],
          item.geometry.coordinates[1]
        );

        setRouteData(response.data.routes[0]);
        setShowSearchDetails(true);
        console.log(response.data);
      });
  };

  useEffect(() => {
    if (state.fromLong && state.fromLat) {
      getRoute(state.fromLong, state.fromLat);
    }
  }, [state.toLong, state.toLat]);

  return (
    <div>
      {/* <div
        onClick={(event) => {
          event.stopPropagation();
        }}
        className={
          "w-full flex items-center !py-4 stepWebkitSetting hover:!bg-gray-50 bg-white rounded-t-full rounded-b-full " +
          (autoCompleteFromSearch.length > 0 ||
            (autoCompleteToSearch > 0 && " !rounded-t-xl !rounded-b-none"))
        }
      >
        <div className="h-full w-10 ml-1 flex justify-center items-center z-10cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <Input
          placeholder="Where is your location?"
          type="text"
          name="from"
          value={state.from}
          className={styles.input + " truncate !w-full "}
          autoComplete="off"
          onChange={(event) => {
            onChangeFrom(event);
          }}
        ></Input>

        <div className="h-full w-10 mr-1 flex justify-center items-center">
          {state.from && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 cursor-pointer"
              viewBox="0 0 20 20"
              fill="currentColor"
              onClick={() => {
                setState({ ...state, from: "" });
                setAutoCompleteFromSearch([]);
              }}
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div> */}
      <div
        onClick={(event) => {
          event.stopPropagation();
        }}
        className={
          "w-full flex items-center !py-4 stepWebkitSetting hover:!bg-gray-50 bg-white rounded-t-full rounded-b-full " +
          (autoCompleteFromSearch.length > 0 &&
            " !rounded-t-xl !rounded-b-none")
        }
      >
        <div className="h-full w-10 ml-1 flex justify-center items-center z-10cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <Input
          placeholder="Where is your location?"
          type="text"
          name="from"
          value={state.from}
          className={styles.input + " truncate !w-full "}
          autoComplete="off"
          onChange={(event) => {
            onChangeFrom(event);
          }}
        ></Input>

        <div className="h-full w-10 mr-1 flex justify-center items-center">
          {state.from && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 cursor-pointer"
              viewBox="0 0 20 20"
              fill="currentColor"
              onClick={() => {
                setState({ ...state, from: "" });
                setAutoCompleteFromSearch([]);
                setShowSearchDetails(false);
              }}
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
      {/* {autoCompleteFromSearch.length > 0 && (
        <div className="absolute top-full left-0 rounded-b-xl w-full py-2 bg-white">
          {autoCompleteFromSearch.map((item, index) => (
            <div
              key={index}
              onClick={() => locationFromSearch(item)}
              className="flex items-center gap-6 hover:bg-gray-100 transition-all duration-300 ease-linear cursor-pointer px-4 py-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="truncate">{item.place_name}</span>
            </div>
          ))}
        </div>
      )} */}

      {autoCompleteFromSearch.length > 0 && (
        <div className="absolute top-full left-0 z-30 rounded-b-xl w-full py-2 bg-white">
          {autoCompleteFromSearch.map((item, index) => (
            <div
              key={index}
              onClick={() => locationFromSearch(item)}
              className="flex items-center gap-6 hover:bg-gray-100 transition-all duration-300 ease-linear cursor-pointer px-4 py-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="truncate">{item.place_name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
