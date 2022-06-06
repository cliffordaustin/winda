import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

import styles from "../../styles/Search.module.css";
import Input from "../ui/Input";

const Search = ({ setLocation, location }) => {
  const [autoCompleteSearch, setAutoCompleteSearch] = useState([]);

  const onChange = (event) => {
    setLocation(event.target.value);

    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${event.target.value}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&autocomplete=true&country=ke,ug,tz,rw,bi,tz,ug,tz,gh`
      )
      .then((response) => {
        setAutoCompleteSearch(response.data.features);
      });
  };

  return (
    <div className="flex">
      <div className="w-full flex flex-col gap-1">
        <div className="relative">
          <div
            onClick={(event) => {
              event.stopPropagation();
            }}
            className={
              "w-full flex items-center !py-3 stepWebkitSetting border border-gray-200 rounded-md " +
              (autoCompleteSearch.length > 0 &&
                " !rounded-t-xl !rounded-b-none")
            }
          >
            <div className="h-full w-10 ml-1 flex justify-center items-center z-10 cursor-pointer">
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
              placeholder="Starting point"
              type="text"
              name="from"
              value={location}
              className={styles.input + " truncate !w-full "}
              autoComplete="off"
              onChange={(event) => {
                onChange(event);
              }}
            ></Input>

            <div className="h-full w-10 mr-1 flex justify-center items-center">
              {location && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 cursor-pointer"
                  viewBox="0 0 20 20"
                  onClick={() => {
                    setLocation("");
                    setAutoCompleteSearch([]);
                  }}
                  fill="currentColor"
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

          {autoCompleteSearch.length > 0 && (
            <div className="absolute top-full left-0 z-30 rounded-b-xl w-full py-2 shadow-md bg-white">
              {autoCompleteSearch.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setLocation(item.place_name);
                    setAutoCompleteSearch([]);
                  }}
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
      </div>
    </div>
  );
};

Search.propTypes = {};

export default Search;
