import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

import styles from "../../styles/Search.module.css";
import Input from "../ui/Input";
import { Icon } from "@iconify/react";
import SearchOptions from "../ui/SearchOptions";

const Search = ({
  setLocation,
  location,
  placeholder = "Starting point",
  inputClassName = "",
  autoCompleteClassName = "",
  inputBoxClassName = "",
  iconContainerClassName = "!text-gray-600",
  autoCompleteSearchClassName = "!rounded-t-xl !rounded-b-none",
  searchClass = "",
  handlePropagation = (event) => {
    event.stopPropagation();
  },
  search = () => {},
  onKeyDown = () => {},
  showSearchOptions = false,
  showSearchBtn = false,
}) => {
  const [autoCompleteSearch, setAutoCompleteSearch] = useState([]);

  const onChange = (event) => {
    setLocation(event.target.value);

    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${event.target.value}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&autocomplete=true&country=ke,ug,tz`
      )
      .then((response) => {
        setAutoCompleteSearch(response.data.features);
      });
  };

  return (
    <div className={"flex " + searchClass}>
      <div className="w-full flex flex-col gap-1">
        <div className="relative">
          <div
            onClick={(event) => {
              handlePropagation(event);
            }}
            className={
              "w-full flex items-center !py-3 stepWebkitSetting border border-gray-200 rounded-md " +
              (autoCompleteSearch.length > 0 && autoCompleteSearchClassName) +
              " " +
              inputBoxClassName
            }
          >
            <div
              className={
                "h-full w-10 ml-1 flex justify-center items-center z-10 cursor-pointer " +
                iconContainerClassName
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="w-5 h-5"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 16 16"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                >
                  <path d="m11.25 11.25l3 3" />
                  <circle cx="7.5" cy="7.5" r="4.75" />
                </g>
              </svg>
            </div>
            <Input
              placeholder={placeholder}
              type="text"
              name="from"
              value={location}
              className={styles.input + " truncate !w-full " + inputClassName}
              autoComplete="off"
              onChange={(event) => {
                onChange(event);
              }}
              onKeyPress={onKeyDown}
            ></Input>

            <div className="flex h-[80%] max-w-[150px] absolute right-2">
              <div className="h-full w-10 mr-1 flex justify-center items-center">
                {location && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={(e) => {
                      e.preventDefault();
                      setLocation("");
                      setAutoCompleteSearch([]);
                    }}
                    className="w-5 h-5 cursor-pointer text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </div>
              {showSearchBtn && (
                <div
                  className={
                    "rounded-full text-white font-bold w-[120px] bg-red-500 ml-1 flex gap-2 justify-center items-center z-10 cursor-pointer "
                  }
                  onClick={() => {
                    search(location);
                  }}
                >
                  <span>Search</span>
                  <Icon icon="bx:right-arrow-alt" className="mt-0.5" />
                </div>
              )}
            </div>
          </div>
          {autoCompleteSearch.length > 0 && (
            <div
              className={
                "absolute top-full left-0 z-30 rounded-b-xl w-full py-2 border border-t-0 border-gray-200 bg-white " +
                autoCompleteClassName
              }
            >
              {showSearchOptions && (
                <div className="border-t border-b py-1.5">
                  <SearchOptions></SearchOptions>
                </div>
              )}
              {autoCompleteSearch.map((item, index) => (
                <div
                  key={index}
                  onMouseDown={(e) => {
                    setLocation(item.place_name);
                    setAutoCompleteSearch([]);
                    search(item.place_name);
                  }}
                  onClick={(e) => {
                    setLocation(item.place_name);
                    setAutoCompleteSearch([]);
                    search(item.place_name);
                  }}
                  className="flex items-center gap-3 hover:bg-gray-100 transition-all duration-300 ease-linear cursor-pointer px-4 py-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    className="w-6 h-6"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 32 32"
                  >
                    <g
                      fill="none"
                      stroke="currentcolor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <circle cx="16" cy="11" r="4" />
                      <path d="M24 15c-3 7-8 15-8 15s-5-8-8-15s2-13 8-13s11 6 8 13Z" />
                    </g>
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
