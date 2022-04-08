import React from "react";
import { useState } from "react";
import MapBox from "./Map";
import Input from "../ui/Input";
import styles from "../../styles/Search.module.css";
import stayStyles from "../../styles/Stay.module.css";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";

import { updateViewState } from "../../redux/actions/stay";

function Location() {
  const dispatch = useDispatch();

  const [location, setLocation] = useState("");
  const viewState = useSelector((state) => state.stay.viewState);

  const [autoComplete, setAutoComplete] = useState([]);

  const onChange = (event) => {
    setLocation(event.target.value);

    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${event.target.value}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&autocomplete=true&country=gh`
      )
      .then((response) => {
        setAutoComplete(response.data.features);
      });
  };

  const locationSearch = (item) => {
    setLocation(item.place_name);
    setAutoComplete([]);

    dispatch(
      updateViewState({
        latitude: item.geometry.coordinates[1],
        longitude: item.geometry.coordinates[0],
        zoom: 14,
      })
    );
  };
  return (
    <div className="h-[98%] relative">
      <div
        className={
          "w-[90%] sm:w-[80%] absolute top-32 left-2/4 right-2/4 -translate-x-2/4 z-20 "
        }
      >
        <div
          onClick={(event) => {
            event.stopPropagation();
          }}
          className={
            "w-full relative !py-4 !justify-between stepWebkitSetting hover:!bg-gray-50 bg-white rounded-t-full rounded-b-full " +
            styles.searchInput +
            (autoComplete.length > 0 && " !rounded-t-xl !rounded-b-none")
          }
        >
          <Input
            placeholder="Where is your location?"
            type="text"
            name="location"
            value={location}
            className={
              styles.input +
              " ml-6 truncate " +
              (autoComplete.length > 0 && "!ml-3 truncate")
            }
            autoComplete="off"
            onChange={(event) => {
              onChange(event);
            }}
          ></Input>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-6 top-2/4 -translate-y-2/4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          {location && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute right-6 z-10 top-2/4 -translate-y-2/4 cursor-pointer"
              viewBox="0 0 20 20"
              fill="currentColor"
              onClick={() => {
                setLocation("");
                setAutoComplete([]);
              }}
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {autoComplete.length > 0 && (
            <div className="absolute top-full left-0 rounded-b-xl w-full py-2 bg-white">
              {autoComplete.map((item, index) => (
                <div
                  key={index}
                  onClick={() => locationSearch(item)}
                  className="flex items-center gap-6 hover:bg-gray-100 transition-all duration-300 ease-linear cursor-pointer px-4 py-3"
                >
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
                  <span className="truncate">{item.place_name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <MapBox></MapBox>
    </div>
  );
}

export default Location;
